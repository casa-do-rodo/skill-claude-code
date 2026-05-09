import { chromium } from 'playwright';
import { mkdirSync, rmSync, existsSync } from 'fs';

// CLI args: --project=<name> [--port=<n>] — namespacing por projeto evita ambiguidade entre audits
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

const PROJECT = args.project || 'facioflow-agency';
const PORT = args.port;
const OUT = `docs/audits/screenshots/${PROJECT}`;

// Limpa pasta do projeto antes — garante que só screenshots do run atual existam
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 2 modos:
// - "sections": single-page LP, captura cada section por selector
// - "routes":   multi-page app/dashboard, captura cada rota como full-page
//
// Default port varia: LPs usam 8080 (python http.server), Next.js usa 3000.
const projectConfig = {
  'facioflow-v3': {
    mode: 'sections',
    port: 8080,
    urlPath: '/facioflow-v3/',
    sections: [
      { name: 'hero',       selector: '.hero' },
      { name: 'problem',    selector: '#problem' },
      { name: 'stacks',     selector: '#stacks' },
      { name: 'compare',    selector: '#pipeline' },
      { name: 'arsenal',    selector: '#arsenal' },
      { name: 'cta-footer', selector: null },
    ],
  },
  'facioflow-agency': {
    mode: 'sections',
    port: 8080,
    urlPath: '/facioflow-agency/',
    sections: [
      { name: 'hero',       selector: '.hero' },
      { name: 'context',    selector: '#context' },
      { name: 'services',   selector: '#servicos' },
      { name: 'process',    selector: '#processo' },
      { name: 'benefits',   selector: '#beneficios' },
      { name: 'security',   selector: '#seguranca' },
      { name: 'cta-footer', selector: null },
    ],
  },
  'facioflow-skills-landing': {
    mode: 'sections',
    port: 8080,
    urlPath: '/facioflow-skills-landing/',
    sections: [
      { name: 'hero',         selector: '.hero' },
      { name: 'problem',      selector: '#problem' },
      { name: 'pipeline',     selector: '#pipeline' },
      { name: 'capabilities', selector: '#capabilities' },
      { name: 'arsenal',      selector: '#arsenal' },
      { name: 'cta-footer',   selector: null },
    ],
  },
  'facioflow-dashboard': {
    mode: 'routes',
    port: 3000,
    routes: [
      { name: 'overview',  path: '/' },
      { name: 'projetos',  path: '/projetos' },
      { name: 'projetos-imbil', path: '/projetos/90175378084' },
      { name: 'clientes',  path: '/clientes' },
    ],
  },
};

const config = projectConfig[PROJECT];
if (!config) {
  console.error(`Projeto '${PROJECT}' não tem config em audit_visual.mjs`);
  process.exit(1);
}

const port = PORT || config.port;
const baseUrl = `http://localhost:${port}`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(`[${page.url()}] ${msg.text()}`); });

if (config.mode === 'sections') {
  await captureSections(page, `${baseUrl}${config.urlPath}`, config.sections, OUT);
} else if (config.mode === 'routes') {
  await captureRoutes(page, baseUrl, config.routes, OUT);
}

await browser.close();
console.log(`\nConsole errors: ${errors.length ? errors.join('\n') : 'nenhum'}`);
console.log(`\nScreenshots em: ${OUT}/`);

// ────────────────────────────────────────────────────────────────────

async function captureSections(page, url, sections, out) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);

  // Scroll para disparar IntersectionObserver reveals
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 400;
  for (let y = 0; y <= pageHeight; y += step) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  // Force all reveals visible
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  });
  await page.waitForTimeout(500);

  await page.screenshot({ path: `${out}/00_full_page.png`, fullPage: true });
  console.log('✓ full page');

  for (const { name, selector } of sections) {
    if (selector) {
      const el = page.locator(selector).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await el.screenshot({ path: `${out}/${name}.png` });
    } else {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${out}/cta-footer.png` });
    }
    console.log(`✓ ${name}`);
  }
}

async function captureRoutes(page, baseUrl, routes, out) {
  for (const { name, path } of routes) {
    const fullUrl = `${baseUrl}${path}`;
    console.log(`→ navigating ${fullUrl}`);
    await page.goto(fullUrl);
    await page.waitForLoadState('networkidle').catch(() => {}); // tolerante a long polling
    await page.waitForTimeout(1500); // espera animações iniciais (counters, charts) renderizarem

    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
    console.log(`✓ ${name}`);
  }
}
