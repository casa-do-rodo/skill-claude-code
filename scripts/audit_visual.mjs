import { chromium } from 'playwright';
import { mkdirSync, rmSync, existsSync } from 'fs';

// CLI args: --project=<name> [--port=<n>] — namespacing por projeto evita ambiguidade entre audits
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

const PROJECT = args.project || 'facioflow-agency';
const PORT = args.port || 8080;
const URL = `http://localhost:${PORT}/${PROJECT}/`;
const OUT = `docs/audits/screenshots/${PROJECT}`;

// Limpa pasta do projeto antes — garante que só screenshots do run atual existam
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Sections por projeto — adicionar entradas conforme novos projetos
const sectionsByProject = {
  'facioflow-v3': [
    { name: 'hero',      selector: '.hero' },
    { name: 'problem',   selector: '#problem' },
    { name: 'stacks',    selector: '#stacks' },
    { name: 'compare',   selector: '#pipeline' },
    { name: 'arsenal',   selector: '#arsenal' },
    { name: 'cta-footer', selector: null },
  ],
  'facioflow-agency': [
    { name: 'hero',      selector: '.hero' },
    { name: 'context',   selector: '#context' },
    { name: 'services',  selector: '#servicos' },
    { name: 'process',   selector: '#processo' },
    { name: 'benefits',  selector: '#beneficios' },
    { name: 'security',  selector: '#seguranca' },
    { name: 'cta-footer', selector: null },
  ],
  'facioflow-skills-landing': [
    { name: 'hero',         selector: '.hero' },
    { name: 'problem',      selector: '#problem' },
    { name: 'pipeline',     selector: '#pipeline' },
    { name: 'capabilities', selector: '#capabilities' },
    { name: 'arsenal',      selector: '#arsenal' },
    { name: 'cta-footer',   selector: null },
  ],
};

const sections = sectionsByProject[PROJECT];
if (!sections) {
  console.error(`Projeto '${PROJECT}' não tem sections registradas em audit_visual.mjs`);
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto(URL);
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

await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});
await page.waitForTimeout(500);

await page.screenshot({ path: `${OUT}/00_full_page.png`, fullPage: true });
console.log('✓ full page');

for (const { name, selector } of sections) {
  if (selector) {
    const el = page.locator(selector).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await el.screenshot({ path: `${OUT}/${name}.png` });
  } else {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/cta-footer.png` });
  }
  console.log(`✓ ${name}`);
}

await browser.close();
console.log(`\nConsole errors: ${errors.length ? errors.join('\n') : 'nenhum'}`);
console.log(`\nScreenshots em: ${OUT}/`);
