import http from 'node:http';
import path from 'node:path';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { Readable, Transform } from 'node:stream';

const PORT = Number(process.env.ANALYTICS_PORT || 8787);
const API_URL = 'https://api-metrika.yandex.net/stat/v1/data';
const TRANSCRIPTION_API_URL = 'https://transcribe.toporkovdsgnr.ru/api/transcribe';
const MAX_TRANSCRIPTION_REQUEST_SIZE = 101 * 1024 * 1024;
const CACHE_TTL = 15 * 60 * 1000;
const cache = new Map();
const pendingRequests = new Map();
const DASHBOARD_DATA_FILE = process.env.DASHBOARD_DATA_FILE || path.resolve('data/dashboard-applications.json');
const TRANSCRIPTION_HISTORY_FILE = process.env.TRANSCRIPTION_HISTORY_FILE || path.resolve('data/transcription-history.json');
const MAX_TRANSCRIPTION_HISTORY_ITEMS = 100;
const PERIODS = {
  today: { current: [0, 0], previous: [1, 1] },
  yesterday: { current: [1, 1], previous: [2, 2] },
  week: { current: [6, 0], previous: [13, 7] },
  month: { current: [29, 0], previous: [59, 30] },
};

function iso(date) { return date.toISOString().slice(0, 10); }
function daysAgo(days) { const date = new Date(); date.setUTCDate(date.getUTCDate() - days); return iso(date); }

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function report(token, counterId, params, attempt = 0) {
  const url = new URL(API_URL);
  url.search = new URLSearchParams({ ids: counterId, accuracy: 'full', lang: 'ru', ...params }).toString();
  const response = await fetch(url, { headers: { Authorization: `OAuth ${token}` } });
  if (response.status === 429 && attempt < 3) {
    await wait(600 * (attempt + 1));
    return report(token, counterId, params, attempt + 1);
  }
  if (!response.ok) throw new Error(`Yandex Metrica API: ${response.status} ${await response.text()}`);
  return response.json();
}

function metricTotal(reportData, index = 0) { return Number(reportData.totals?.[index] || 0); }

async function fetchAnalytics(periodKey) {
  const token = process.env.YANDEX_METRIKA_TOKEN;
  const counterId = process.env.YANDEX_COUNTER_ID;
  if (!token || !counterId) throw new Error('YANDEX_METRIKA_TOKEN or YANDEX_COUNTER_ID is not configured');
  const selectedPeriod = PERIODS[periodKey];
  const currentDates = { date1: daysAgo(selectedPeriod.current[0]), date2: daysAgo(selectedPeriod.current[1]) };
  const previousDates = { date1: daysAgo(selectedPeriod.previous[0]), date2: daysAgo(selectedPeriod.previous[1]) };
  const summary = await report(token, counterId, { ...currentDates, metrics: 'ym:s:users,ym:s:pageviews' });
  const previous = await report(token, counterId, { ...previousDates, metrics: 'ym:s:users' });
  const countriesReport = await report(token, counterId, { ...currentDates, dimensions: 'ym:s:regionCountry', metrics: 'ym:s:users', limit: '10000' });
  const devicesReport = await report(token, counterId, { ...currentDates, dimensions: 'ym:s:deviceCategory', metrics: 'ym:s:users', limit: '20' });
  const sourcesReport = await report(token, counterId, { ...currentDates, dimensions: 'ym:s:trafficSource', metrics: 'ym:s:visits', sort: '-ym:s:visits', limit: '5' });
  const chartReport = await report(token, counterId, { ...currentDates, dimensions: 'ym:s:date', metrics: 'ym:s:pageviews', sort: 'ym:s:date', limit: '40' });

  const visitors = metricTotal(summary, 0);
  const previousVisitors = metricTotal(previous, 0);
  const deviceRows = devicesReport.data || [];
  const deviceUsers = deviceRows.reduce((sum, row) => sum + Number(row.metrics?.[0] || 0), 0);
  const mobileUsers = deviceRows.filter((row) => ['mobile', 'tablet'].includes(String(row.dimensions?.[0]?.id))).reduce((sum, row) => sum + Number(row.metrics?.[0] || 0), 0);

  const value = {
    visitors,
    pageviews: metricTotal(summary, 1),
    countries: (countriesReport.data || []).filter((row) => row.dimensions?.[0]?.id !== '0').length,
    mobileShare: deviceUsers ? Math.round((mobileUsers / deviceUsers) * 100) : 0,
    periodChange: previousVisitors ? Math.round(((visitors - previousVisitors) / previousVisitors) * 1000) / 10 : 0,
    chart: (chartReport.data || []).map((row) => ({ date: row.dimensions?.[0]?.name || row.dimensions?.[0]?.id, pageviews: Number(row.metrics?.[0] || 0) })),
    sources: (sourcesReport.data || []).map((row) => ({ name: row.dimensions?.[0]?.name || 'Не определено', visits: Number(row.metrics?.[0] || 0) })),
    period: { key: periodKey, ...currentDates },
    updatedAt: new Date().toISOString(),
  };
  cache.set(periodKey, { createdAt: Date.now(), value });
  return value;
}

async function loadAnalytics(periodKey) {
  const cached = cache.get(periodKey);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL) return cached.value;
  if (!pendingRequests.has(periodKey)) pendingRequests.set(periodKey, fetchAnalytics(periodKey).finally(() => { pendingRequests.delete(periodKey); }));
  return pendingRequests.get(periodKey);
}

export async function analyticsHandler(request, response) {
  if (request.method !== 'GET') { response.writeHead(405, { Allow: 'GET' }); response.end(); return; }
  try {
    const requestedPeriod = new URL(request.url, `http://${request.headers.host || 'localhost'}`).searchParams.get('period') || 'month';
    const periodKey = Object.hasOwn(PERIODS, requestedPeriod) ? requestedPeriod : 'month';
    const data = await loadAnalytics(periodKey);
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, max-age=300' });
    response.end(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify({ error: 'analytics_unavailable' }));
  }
}

async function readDashboardApplications() {
  try {
    const value = JSON.parse(await readFile(DASHBOARD_DATA_FILE, 'utf8'));
    return Array.isArray(value) ? value : null;
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeDashboardApplications(applications) {
  await mkdir(path.dirname(DASHBOARD_DATA_FILE), { recursive: true });
  const temporaryFile = `${DASHBOARD_DATA_FILE}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(applications, null, 2), 'utf8');
  await rename(temporaryFile, DASHBOARD_DATA_FILE);
}

export async function dashboardApplicationsHandler(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  try {
    if (request.method === 'GET') {
      response.writeHead(200);
      response.end(JSON.stringify({ applications: await readDashboardApplications() }));
      return;
    }
    if (request.method === 'PUT') {
      let body = '';
      for await (const chunk of request) {
        body += chunk;
        if (body.length > 10 * 1024 * 1024) throw new Error('request_too_large');
      }
      const applications = JSON.parse(body).applications;
      if (!Array.isArray(applications)) throw new Error('invalid_applications');
      await writeDashboardApplications(applications);
      response.writeHead(200);
      response.end(JSON.stringify({ applications }));
      return;
    }
    response.writeHead(405, { Allow: 'GET, PUT' });
    response.end(JSON.stringify({ error: 'method_not_allowed' }));
  } catch (error) {
    console.error(error);
    response.writeHead(error?.message === 'request_too_large' ? 413 : 400);
    response.end(JSON.stringify({ error: 'dashboard_storage_unavailable' }));
  }
}

export async function transcriptionHandler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.writeHead(405, { Allow: 'POST', 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ detail: 'Метод не поддерживается' }));
    return;
  }

  const apiKey = process.env.TRANSCRIPTION_API_KEY;
  if (!apiKey) {
    console.error('TRANSCRIPTION_API_KEY is not configured');
    response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ detail: 'Сервис транскрибации не настроен' }));
    return;
  }

  const contentType = request.headers['content-type'] || '';
  const contentLength = Number(request.headers['content-length'] || 0);
  if (!contentType.startsWith('multipart/form-data')) {
    response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ detail: 'Ожидается multipart/form-data' }));
    return;
  }
  if (contentLength > MAX_TRANSCRIPTION_REQUEST_SIZE) {
    response.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ detail: 'Файл превышает допустимый размер 100 МБ' }));
    return;
  }

  const controller = new AbortController();
  request.on('aborted', () => controller.abort());
  response.on('close', () => { if (!response.writableEnded) controller.abort(); });

  let received = 0;
  const limiter = new Transform({
    transform(chunk, encoding, callback) {
      received += chunk.length;
      if (received > MAX_TRANSCRIPTION_REQUEST_SIZE) {
        callback(new Error('request_too_large'));
        return;
      }
      callback(null, chunk);
    },
  });
  request.pipe(limiter);

  try {
    const upstream = await fetch(TRANSCRIPTION_API_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': contentType,
        ...(contentLength ? { 'Content-Length': String(contentLength) } : {}),
      },
      body: Readable.toWeb(limiter),
      duplex: 'half',
      signal: controller.signal,
    });
    const responseContentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';
    if (upstream.ok) {
      const result = await upstream.json();
      const encodedFileName = String(request.headers['x-transcription-file-name'] || 'Запись');
      let fileName = 'Запись';
      try { fileName = decodeURIComponent(encodedFileName).slice(0, 255) || 'Запись'; } catch {}
      const fileSize = Math.max(0, Number(request.headers['x-transcription-file-size'] || 0));
      await addTranscriptionHistoryItem({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        fileName,
        fileSize,
        createdAt: new Date().toISOString(),
        language: String(result.language || ''),
        duration: Number(result.duration || 0),
        text: String(result.text || ''),
        segments: Array.isArray(result.segments) ? result.segments : [],
      });
      response.writeHead(upstream.status, { 'Content-Type': responseContentType, 'Cache-Control': 'no-store' });
      response.end(JSON.stringify(result));
      return;
    }
    response.writeHead(upstream.status, {
      'Content-Type': responseContentType,
      'Cache-Control': 'no-store',
    });
    if (upstream.body) Readable.fromWeb(upstream.body).pipe(response);
    else response.end();
  } catch (error) {
    if (response.headersSent || response.writableEnded) return;
    const tooLarge = error?.message === 'request_too_large' || error?.cause?.message === 'request_too_large';
    if (!controller.signal.aborted) console.error('Transcription proxy:', error);
    response.writeHead(tooLarge ? 413 : 503, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ detail: tooLarge ? 'Файл превышает допустимый размер 100 МБ' : 'Сервис транскрибации временно недоступен' }));
  }
}

async function readTranscriptionHistory() {
  try {
    const value = JSON.parse(await readFile(TRANSCRIPTION_HISTORY_FILE, 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeTranscriptionHistory(items) {
  await mkdir(path.dirname(TRANSCRIPTION_HISTORY_FILE), { recursive: true });
  const temporaryFile = `${TRANSCRIPTION_HISTORY_FILE}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(items, null, 2), 'utf8');
  await rename(temporaryFile, TRANSCRIPTION_HISTORY_FILE);
}

async function addTranscriptionHistoryItem(item) {
  const items = await readTranscriptionHistory();
  await writeTranscriptionHistory([item, ...items].slice(0, MAX_TRANSCRIPTION_HISTORY_ITEMS));
}

export async function transcriptionHistoryHandler(request, response, itemId = '') {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  try {
    if (request.method === 'GET' && !itemId) {
      response.writeHead(200);
      response.end(JSON.stringify({ items: await readTranscriptionHistory() }));
      return;
    }
    if (request.method === 'DELETE' && itemId) {
      const items = await readTranscriptionHistory();
      await writeTranscriptionHistory(items.filter((item) => item.id !== itemId));
      response.writeHead(200);
      response.end(JSON.stringify({ ok: true }));
      return;
    }
    response.writeHead(405, { Allow: 'GET, DELETE' });
    response.end(JSON.stringify({ detail: 'Метод не поддерживается' }));
  } catch (error) {
    console.error('Transcription history:', error);
    response.writeHead(503);
    response.end(JSON.stringify({ detail: 'История временно недоступна' }));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  http.createServer((request, response) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
    if (pathname === '/api/analytics') return analyticsHandler(request, response);
    if (pathname === '/api/dashboard/applications') return dashboardApplicationsHandler(request, response);
    if (pathname === '/api/transcribe') return transcriptionHandler(request, response);
    if (pathname === '/api/transcriptions') return transcriptionHistoryHandler(request, response);
    if (pathname.startsWith('/api/transcriptions/')) return transcriptionHistoryHandler(request, response, decodeURIComponent(pathname.slice('/api/transcriptions/'.length)));
    response.writeHead(404); response.end('Not found');
  }).listen(PORT, '127.0.0.1', () => console.log(`Analytics API: http://127.0.0.1:${PORT}/api/analytics`));
}
