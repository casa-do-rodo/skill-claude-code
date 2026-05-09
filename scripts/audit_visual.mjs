import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = 'docs/audits/screenshots';
mkdirSync(OUT, { recursive: true });

const URL = 'http://localhost:8080/facioflow-v3/';

const sections = [
  { name: 'hero',      selector: '.hero' },
  { name: 'problem',   selector: '#problem' },
  { name: 'stacks',    selector: '#stacks' },
  { name: 'compare',   selector: '#pipeline' },
  { name: 'arsenal',   selector: '#arsenal' },
  { name: 'cta-footer', selector: null },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto(URL);
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);

// Scroll through entire page to trigger IntersectionObserver reveals
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 400;
for (let y = 0; y <= pageHeight; y += step) {
  await page.evaluate(y => window.scrollTo(0, y), y);
  await page.waitForTimeout(120);
}
// Back to top
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);

// Force all reveals visible in case any were missed
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
