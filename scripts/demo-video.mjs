import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';

const scenarioPath = process.argv[2];
const outputPath = process.argv[3] ?? 'routes-prototype-demo.webm';

if (!scenarioPath) {
  console.error('Usage: npm run demo:video -- path/to/scenario.json [output.webm]');
  process.exit(1);
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    return import('/Users/sertop/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  }
}

const { chromium } = await loadPlaywright();
const scenario = JSON.parse(await readFile(scenarioPath, 'utf8'));
const viewport = scenario.viewport ?? { width: 1920, height: 1060 };
const outputDir = path.resolve('.codex-video');
const finalOutput = path.resolve(outputPath);
const scenarioUrl = new URL(scenario.url);
if (scenarioUrl.hostname === 'localhost') {
  scenarioUrl.hostname = '127.0.0.1';
}

async function waitForLocalServer(url) {
  if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
    return null;
  }

  const isReady = async () => {
    try {
      const response = await fetch(url.origin);
      return response.ok;
    } catch {
      return false;
    }
  };

  if (await isReady()) {
    return null;
  }

  const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1'], {
    cwd: process.cwd(),
    stdio: 'ignore',
  });

  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await isReady()) {
      return server;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  server.kill();
  throw new Error(`Local dev server did not start at ${url.origin}`);
}

if (existsSync(outputDir)) rmSync(outputDir, { recursive: true, force: true });
if (existsSync(finalOutput)) rmSync(finalOutput, { force: true });
mkdirSync(outputDir, { recursive: true });
const devServer = await waitForLocalServer(scenarioUrl);

const browser = await chromium.launch({
  headless: false,
  executablePath: existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined,
  args: [
    `--window-size=${viewport.width},${viewport.height}`,
    '--window-position=0,0',
    '--force-device-scale-factor=1',
  ],
});

const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 1,
  recordVideo: {
    dir: outputDir,
    size: viewport,
  },
});

const page = await context.newPage();
const video = page.video();
await page.goto(scenarioUrl.toString(), { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(1000);

await page.evaluate(() => {
  const style = document.createElement('style');
  style.textContent = `
    * { cursor: none !important; }
    .demo-cursor {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 999999;
      width: 28px;
      height: 28px;
      pointer-events: none;
      transform: translate3d(-100px, -100px, 0);
      filter: drop-shadow(0 2px 4px rgba(0,0,0,.35));
    }
    .demo-cursor svg {
      display: block;
      width: 28px;
      height: 28px;
    }
    .demo-click-ring {
      position: fixed;
      z-index: 999998;
      width: 42px;
      height: 42px;
      margin: -21px 0 0 -21px;
      border: 3px solid #1677ff;
      border-radius: 999px;
      pointer-events: none;
      animation: demo-click-ring .52s ease-out forwards;
      box-shadow: 0 0 0 5px rgba(22,119,255,.12);
    }
    @keyframes demo-click-ring {
      0% { opacity: 1; transform: scale(.45); }
      100% { opacity: 0; transform: scale(1.45); }
    }
  `;
  document.head.append(style);

  const cursor = document.createElement('div');
  cursor.className = 'demo-cursor';
  cursor.innerHTML = `
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 3.5 22.5 16 14.6 17.4 10.7 24.6 4 3.5Z" fill="white" stroke="#111827" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `;
  document.body.append(cursor);

  window.__demoCursorMove = (x, y) => {
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  window.__demoCursorClick = (x, y) => {
    window.__demoCursorMove(x, y);
    const ring = document.createElement('span');
    ring.className = 'demo-click-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    document.body.append(ring);
    window.setTimeout(() => ring.remove(), 700);
  };
});

const moveTo = async (x, y, steps = 16) => {
  await page.mouse.move(x, y, { steps });
  await page.evaluate(([nextX, nextY]) => window.__demoCursorMove(nextX, nextY), [x, y]);
};

const waitForUiIdle = async (timeout = 700) => {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {});
  await page.waitForTimeout(timeout);
};

const getLocatorCenter = async (selector) => {
  if (!selector) {
    return null;
  }

  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible', timeout: 2500 }).catch(() => {});
  if (await locator.count() !== 1) {
    return null;
  }

  const box = await locator.boundingBox();
  if (!box) {
    return null;
  }

  return {
    x: Math.round(box.x + box.width / 2),
    y: Math.round(box.y + box.height / 2),
  };
};

const clickAt = async (x, y) => {
  await moveTo(x, y);
  await page.evaluate(([nextX, nextY]) => window.__demoCursorClick(nextX, nextY), [x, y]);
  await page.mouse.click(x, y);
};

await moveTo(Math.round(viewport.width / 2), Math.round(viewport.height / 2), 1);
await waitForUiIdle(900);

for (const event of scenario.events ?? []) {
  const delay = scenario.version === 1 && event.type === 'drag'
    ? Math.max(0, (event.delay ?? 0) - (event.duration ?? 0))
    : event.delay ?? 0;
  await page.waitForTimeout(Math.max(250, delay));

  if (event.type === 'click') {
    const point = await getLocatorCenter(event.target?.selector);
    await clickAt(point?.x ?? event.x, point?.y ?? event.y);
    await waitForUiIdle(650);
  }

  if (event.type === 'drag') {
    await moveTo(event.from.x, event.from.y);
    await page.evaluate(([x, y]) => window.__demoCursorClick(x, y), [event.from.x, event.from.y]);
    await page.waitForTimeout(80);
    await page.mouse.down();
    const rawPath = Array.isArray(event.path) && event.path.length > 1
      ? event.path
      : [event.from, event.to];
    const steps = rawPath.length - 1;
    const stepDelay = Math.max(8, Math.round((event.duration ?? 300) / Math.max(steps, 1)));
    for (let step = 1; step < rawPath.length; step += 1) {
      const { x, y } = rawPath[step];
      await page.mouse.move(x, y);
      await page.evaluate(([nextX, nextY]) => window.__demoCursorMove(nextX, nextY), [x, y]);
      await page.waitForTimeout(stepDelay);
    }
    await page.mouse.up();
    await waitForUiIdle(650);
  }

  if (event.type === 'input' && event.selector) {
    const input = page.locator(event.selector);
    const inputCount = await input.count();
    if (inputCount === 1) {
      const point = await getLocatorCenter(event.selector);
      if (point) {
        await clickAt(point.x, point.y);
      } else {
        await input.click();
      }
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
      await page.keyboard.type(event.value ?? '', { delay: 18 });
      await waitForUiIdle(450);
    } else if (event.point) {
      await clickAt(event.point.x, event.point.y);
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
      await page.keyboard.type(event.value ?? '', { delay: 18 });
      await waitForUiIdle(450);
    }
  }
}

await page.waitForTimeout(1000);
await context.close();
await browser.close();

const recordedPath = video ? await video.path() : null;
if (!recordedPath || !existsSync(recordedPath)) {
  throw new Error('Video was not recorded');
}

spawnSync('/bin/mv', [recordedPath, finalOutput], { stdio: 'inherit' });
if (existsSync(outputDir)) rmSync(outputDir, { recursive: true, force: true });
devServer?.kill();
console.log(finalOutput);
