// Собирает PDF-резюме на трёх языках из готовой сборки (dist/) — запускается после `vite build`.
// Локально: npm run build && npm run pdf   (нужен браузер: npx playwright install chromium)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const BASE = '/KutEmpResume/';
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const LANGS = ['ru', 'kg', 'en'];
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.pdf': 'application/pdf',
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!path.startsWith(BASE)) { res.writeHead(404).end(); return; }
    path = normalize(path.slice(BASE.length)).replace(/^(\.\.[/\\])+/, '');
    let file = join(DIST, path || 'index.html');
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
let failed = false;

try {
  for (const lang of LANGS) {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}${BASE}?print=1&lang=${lang}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    const out = join(DIST, `Omuraliev_Kutman_CV_${lang.toUpperCase()}.pdf`);
    const pdf = await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`✓ ${out} — ${pages} стр., ${(pdf.length / 1024).toFixed(0)} КБ`);
    if (pages !== 1) {
      console.warn(`⚠ PDF (${lang}) занимает ${pages} стр. — сократите текст, чтобы резюме помещалось на один лист.`);
    }
    await page.close();
  }
} catch (err) {
  failed = true;
  console.error('Не удалось собрать PDF:', err);
} finally {
  await browser.close();
  server.close();
}
process.exit(failed ? 1 : 0);
