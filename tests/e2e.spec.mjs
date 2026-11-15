import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createStaticServer } from '../scripts/serve.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const SCREENSHOTS_DIR = path.join(ROOT, 'screenshots');

async function skipBootIfPresent(page) {
  const boot = page.locator('#boot-overlay');
  if (await boot.isVisible().catch(() => false)) {
    await boot.click({ force: true }).catch(() => {});
    await page.waitForSelector('#boot-overlay', { state: 'hidden', timeout: 5000 }).catch(() => {});
  }
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert.ok(
    metrics.scrollWidth <= metrics.clientWidth,
    `${label}: horizontal overflow detected (scrollWidth=${metrics.scrollWidth}, clientWidth=${metrics.clientWidth})`
  );
}

async function runE2E() {
  assert.ok(fs.existsSync(DIST_DIR), 'dist/ missing — run npm run build first');
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const server = createStaticServer(DIST_DIR);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch({ headless: true });

  try {
    // --- DESKTOP 1280x800 ---
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    // 1. Home loads
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await skipBootIfPresent(page);
    await page.waitForSelector('.handout-card');
    await page.waitForFunction(
      () => document.getElementById('hero-ascii')?.textContent?.includes('|____/|____/')
    );
    const cardCount = await page.locator('.handout-card').count();
    assert.equal(cardCount, 8, `Expected 8 handout cards on home, got ${cardCount}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'home-desktop.png'), fullPage: false });

    // 2. Navigate to a handout & check all tabs
    await page.locator('a[href="#/network/storage/reviewer"]').first().click();
    await page.waitForSelector('#reviewer-prose h2');
    // Answer key must be collapsed by default
    assert.equal(await page.locator('#answer-key-box').isHidden(), true);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'reviewer-desktop.png'), fullPage: false });

    // Toggle show answers & cram mode
    await page.click('#btn-answers');
    await page.waitForSelector('#answer-key-box:not([hidden])');
    await page.click('#btn-cram');
    await page.waitForFunction(
      () => document.getElementById('rev-box-title')?.textContent?.includes('cram')
    );

    // 3. PDF tab renders canvas with non-zero dimensions and painted content
    await page.click('a[href="#/network/storage/pdf"]');
    await page.waitForFunction(() => {
      const status = document.querySelector('[data-pdf="status"]')?.textContent || '';
      const canvas = document.querySelector('[data-pdf="canvas"]');
      return status.includes('page 1 /') && canvas && canvas.width > 100 && canvas.height > 100;
    }, { timeout: 15000 });

    // 4. Drill tab works
    await page.click('a[href="#/network/storage/drill"]');
    await page.waitForSelector('#drill-card');
    await page.click('#drill-card');
    await page.waitForSelector('.drill-term');

    // 5. Quiz tab: 2 deliberate wrong answers -> retry shows exactly 2 -> cleared
    await page.click('a[href="#/network/storage/quiz"]');
    await page.waitForSelector('#btn-start-quiz');
    // Keep question order predictable so we can look up answers from /data/network/storage.json
    const storageData = await page.evaluate(async () => {
      const r = await fetch('/data/network/storage.json');
      return r.json();
    });
    const answerById = new Map(
      storageData.questions.map((q) => [q.id, q.answer])
    );

    await page.click('#toggle-sq'); // turn shuffle off for deterministic test
    await page.click('#btn-start-quiz');
    await page.waitForSelector('#quiz-prompt');
    await page.waitForTimeout(400);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'quiz-desktop.png'), fullPage: false });

    const totalQs = storageData.questions.length;
    for (let i = 0; i < totalQs; i++) {
      const qId = await page.locator('#quiz-prompt').getAttribute('data-question-id');
      const correct = answerById.get(qId);
      assert.ok(correct, `Could not find answer for question id: ${qId}`);

      // Deliberately pick wrong answer on first 2 questions
      const pick = i < 2 ? (correct === 'A' ? 'B' : 'A') : correct;
      await page.click(`button[data-choice="${pick}"]`);
      await page.waitForSelector('#btn-next-q');
      await page.click('#btn-next-q');
    }

    await page.waitForSelector('#btn-retry-missed');
    const retryText = await page.locator('#btn-retry-missed').textContent();
    assert.ok(retryText.includes('(2)'), `Expected retry missed (2), got: ${retryText}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'results-desktop.png'), fullPage: false });

    // Start Retry round -> must have exactly 2 questions
    await page.click('#btn-retry-missed');
    await page.waitForSelector('#quiz-prompt');
    for (let i = 0; i < 2; i++) {
      const header = await page.locator('#tab-panel .tui-title').textContent();
      assert.ok(header.includes('/02'), `Expected retry round of 2 questions, got header: ${header}`);
      const qId = await page.locator('#quiz-prompt').getAttribute('data-question-id');
      const correct = answerById.get(qId);
      await page.click(`button[data-choice="${correct}"]`);
      await page.waitForSelector('#btn-next-q');
      await page.click('#btn-next-q');
    }

    // Cleared screen (line-by-line animation)
    await page.waitForFunction(
      () => document.getElementById('cleared-box')?.textContent?.includes('ROUND CLEARED')
    );

    // 6. Search (command palette) finds a term
    await page.keyboard.press('/');
    await page.waitForSelector('#palette-modal:not([hidden])');
    await page.fill('#palette-input', 'Glacier');
    await page.waitForSelector('.palette-item');
    const firstResult = await page.locator('.palette-item-title').first().textContent();
    assert.ok(
      firstResult.toLowerCase().includes('glacier'),
      `Expected search result for Glacier, got: ${firstResult}`
    );
    await page.keyboard.press('Escape');

    // 7. Deep link opens the right tab
    await page.goto(`${baseUrl}/#/graphics/scene-graph/quiz`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#btn-start-quiz');
    const activeTab = await page.locator('.tab-link.active').textContent();
    assert.ok(activeTab.includes('Quiz'), `Expected active Quiz tab on deep link, got: ${activeTab}`);

    // 8. Offline PWA reload works after service worker activates
    await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.ready;
      }
    });
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await skipBootIfPresent(page);
    await page.waitForSelector('#btn-start-quiz');
    await context.setOffline(false);

    assert.deepEqual(pageErrors, [], `Unexpected page errors: ${pageErrors.join('; ')}`);
    await context.close();

    // --- MOBILE 390x844 & 360x740 ---
    const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileCtx.newPage();

    await mobilePage.goto(baseUrl, { waitUntil: 'networkidle' });
    await skipBootIfPresent(mobilePage);
    await mobilePage.waitForSelector('.handout-card');
    await mobilePage.waitForFunction(
      () => document.getElementById('hero-ascii')?.textContent?.includes('|____/|____/')
    );
    await assertNoHorizontalOverflow(mobilePage, 'home 390px');
    await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'home-mobile.png'), fullPage: false });

    await mobilePage.goto(`${baseUrl}/#/network/storage/reviewer`, { waitUntil: 'networkidle' });
    await mobilePage.waitForSelector('#reviewer-prose table');
    await assertNoHorizontalOverflow(mobilePage, 'reviewer 390px');
    await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'reviewer-mobile.png'), fullPage: false });

    await mobilePage.goto(`${baseUrl}/#/network/storage/quiz`, { waitUntil: 'networkidle' });
    await mobilePage.waitForSelector('#btn-start-quiz');
    await mobilePage.click('#btn-start-quiz');
    await mobilePage.waitForSelector('#quiz-prompt');
    await mobilePage.waitForTimeout(400);
    await assertNoHorizontalOverflow(mobilePage, 'quiz 390px');
    await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'quiz-mobile.png'), fullPage: false });

    // Complete mobile quiz to capture results-mobile.png
    const mobileStorage = await mobilePage.evaluate(async () => {
      const r = await fetch('/data/network/storage.json');
      return r.json();
    });
    const mAns = new Map(mobileStorage.questions.map((q) => [q.id, q.answer]));
    for (let i = 0; i < mobileStorage.questions.length; i++) {
      const qId = await mobilePage.locator('#quiz-prompt').getAttribute('data-question-id');
      const correct = mAns.get(qId);
      const pick = i === 0 ? (correct === 'A' ? 'B' : 'A') : correct;
      await mobilePage.click(`button[data-choice="${pick}"]`);
      await mobilePage.waitForSelector('#btn-next-q');
      await mobilePage.click('#btn-next-q');
    }
    await mobilePage.waitForSelector('#btn-retry-missed');
    await assertNoHorizontalOverflow(mobilePage, 'results 390px');
    await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'results-mobile.png'), fullPage: false });

    // Strict 360px overflow check across home, reviewer, and quiz
    await mobilePage.setViewportSize({ width: 360, height: 740 });
    await assertNoHorizontalOverflow(mobilePage, 'quiz 360px');
    await mobilePage.goto(`${baseUrl}/#/network/storage/reviewer`, { waitUntil: 'networkidle' });
    await mobilePage.waitForSelector('#reviewer-prose table');
    await assertNoHorizontalOverflow(mobilePage, 'reviewer 360px');
    await mobilePage.goto(`${baseUrl}/#/`, { waitUntil: 'networkidle' });
    await mobilePage.waitForSelector('.handout-card');
    await assertNoHorizontalOverflow(mobilePage, 'home 360px');

    await mobileCtx.close();
    console.log('E2E ALL PASSED (desktop 1280 + mobile 390/360 + PDF + quiz retry + search + deep link)');
  } finally {
    await browser.close();
    server.close();
  }
}

runE2E().catch((err) => {
  console.error(err);
  process.exit(1);
});
