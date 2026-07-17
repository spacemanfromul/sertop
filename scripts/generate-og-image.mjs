import { spawn } from 'node:child_process';
import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const outputPath = path.join(rootDir, 'public', 'og-image.jpg');
const port = process.env.OG_PREVIEW_PORT ?? '41739';
const previewUrl = `http://127.0.0.1:${port}/og-preview`;

const browserCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.platform === 'win32' ? path.join(process.env.PROGRAMFILES ?? '', 'Google', 'Chrome', 'Application', 'chrome.exe') : null,
  process.platform === 'win32' ? path.join(process.env['PROGRAMFILES(X86)'] ?? '', 'Microsoft', 'Edge', 'Application', 'msedge.exe') : null,
  process.platform === 'linux' ? '/usr/bin/google-chrome' : null,
  process.platform === 'linux' ? '/usr/bin/chromium' : null,
].filter(Boolean);

async function waitForServer(url, timeoutMs = 30_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Vite did not become ready at ${url}`);
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch (defaultError) {
    for (const executablePath of browserCandidates) {
      try {
        await access(executablePath);
        return await chromium.launch({ headless: true, executablePath });
      } catch {
        // Try the next installed browser.
      }
    }

    throw new Error(
      `Chromium is unavailable. Run "npm run setup:og" once before building.\n${defaultError instanceof Error ? defaultError.message : defaultError}`,
    );
  }
}

const vite = spawn(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', port, '--strictPort'], {
  cwd: rootDir,
  stdio: ['ignore', 'pipe', 'pipe'],
});

vite.stdout.on('data', (chunk) => process.stdout.write(chunk));
vite.stderr.on('data', (chunk) => process.stderr.write(chunk));

let browser;
try {
  await waitForServer(previewUrl);
  browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(previewUrl, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) => image.complete ? Promise.resolve() : image.decode()),
    );
  });
  await page.screenshot({ path: outputPath, type: 'jpeg', quality: 90, fullPage: false, animations: 'disabled' });
  console.log(`OG image generated: ${path.relative(rootDir, outputPath)} (1200x630)`);
} finally {
  await browser?.close();
  vite.kill();
}
