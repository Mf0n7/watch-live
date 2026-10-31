// Ferramenta LOCAL: abre o player em um Chrome controlado e fecha o modal de
// anúncio sempre que ele aparecer (clica no botão ✕ que o próprio embed fornece).
// Não roda na Vercel; roda na sua máquina apontando para o site hospedado.
//
// Uso:
//   node tools/watch.js                      -> abre public/index.html local
//   node tools/watch.js https://seu.vercel.app
//   WATCH_URL=https://seu.vercel.app node tools/watch.js
const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');

const PAGE = process.argv[2]
  || process.env.WATCH_URL
  || pathToFileURL(path.join(__dirname, '..', 'public', 'index.html')).href;
const CLOSE_SELECTORS = ['.vip-modal-close', '.embed-close'];
const INTERVAL_MS = 400;

(async () => {
  const browser = await chromium.launch({
    headless: false, channel: 'chrome',
    args: ['--start-maximized', '--autoplay-policy=no-user-gesture-required', '--disable-gpu'],
  });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();
  await page.goto(PAGE);

  let closed = 0;
  const timer = setInterval(async () => {
    for (const frame of page.frames()) {
      for (const sel of CLOSE_SELECTORS) {
        try {
          const btn = frame.locator(sel).first();
          if (await btn.isVisible({ timeout: 50 }).catch(() => false)) {
            await btn.click({ timeout: 500, force: true });
            closed++;
            console.log(`[${new Date().toLocaleTimeString()}] anúncio fechado (#${closed})`);
          }
        } catch (_) { /* frame navegou ou botão sumiu; tenta de novo no próximo ciclo */ }
      }
    }
  }, INTERVAL_MS);

  page.on('close', () => { clearInterval(timer); browser.close().catch(() => {}); });
  browser.on('disconnected', () => { clearInterval(timer); process.exit(0); });
  console.log('Player aberto. Feche a janela do navegador para encerrar.');
})().catch(err => { console.error(err); process.exit(1); });
