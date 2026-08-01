// End-to-end smoke test: serves mobile-shell and drives it in Chromium.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..', 'mobile-shell');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(ROOT, url === '/' ? 'index.html' : url);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end('not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
});

const fail = [];
function check(name, cond, detail) {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  if (!cond) fail.push(name);
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'ko-KR' });

  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const txt = m.text();
    if (/favicon\.ico/.test(txt) || /status of 404/.test(txt)) return; // browser favicon probe
    errors.push('console: ' + txt);
  });
  const failedReq = [];
  page.on('requestfailed', r => failedReq.push(r.url()));
  page.on('response', r => {
    if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) failedReq.push(r.status() + ' ' + r.url());
  });
  page.on('response', r => { if (r.status() >= 400) console.log('    [http ' + r.status() + '] ' + r.url()); });

  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  console.log('\n--- home ---');
  const verse = await page.textContent('#verse');
  const ref = await page.textContent('#reference');
  const attribution = await page.textContent('#verseAttribution');
  check('verse rendered', verse && verse.length > 10, JSON.stringify(verse && verse.slice(0, 46)));
  check('reference is localized Korean', /[가-힣]/.test(ref), ref);
  check('attribution names the translation', attribution.includes('개역한글'), attribution.slice(0, 40));
  check('hymn title rendered', (await page.textContent('#hymn')).length > 2, await page.textContent('#hymn'));
  check('prayer rendered', (await page.textContent('#prayer')).length > 5);
  check('date rendered', (await page.textContent('#date')).length > 4, await page.textContent('#date'));

  console.log('\n--- youtube tile replaces date-format tile ---');
  check('video card present', await page.isVisible('#videoCard'));
  check('no date-format quick tile', await page.locator('[data-feature="date"]').count() === 0);
  await page.evaluate(() => { window.__opened = null; window.open = (u) => { window.__opened = u; return {}; }; });
  await page.click('#videoCard');
  const opened = await page.evaluate(() => window.__opened);
  check('video card opens YouTube', /^https:\/\/www\.youtube\.com\//.test(opened || ''), opened);

  console.log('\n--- people ---');
  await page.click('[data-view="people"]');
  await page.waitForSelector('.person-card', { timeout: 5000 });
  const nPeople = await page.locator('.person-card').count();
  check('people list populated', nPeople >= 15, nPeople + ' people');
  await page.locator('.person-card', { hasText: '다윗' }).first().click();
  await page.waitForSelector('#detailSheet:not([hidden])');
  const detail = await page.textContent('#detailContent');
  check('character detail has scripture text', (await page.locator('#detailContent .scripture .s-text').count()) >= 3);
  check('scripture shown is Korean PD text', /[가-힣]/.test(await page.textContent('#detailContent .s-text')));
  check('raw section present', detail.includes('밧세바') || detail.includes('우리아') || detail.includes('옥상'), 'David raw material');
  check('turning point present', detail.includes('시편') || detail.includes('범죄'));
  check('reflection questions present', (await page.locator('#detailContent .ask-list li').count()) >= 2);
  await page.click('[data-close="detailSheet"]');

  console.log('\n--- study ---');
  await page.click('[data-view="study"]');
  await page.waitForSelector('.course-card', { timeout: 5000 });
  const nCourses = await page.locator('.course-card').count();
  check('courses listed', nCourses >= 4, nCourses + ' courses');
  await page.locator('.course-card').first().click();
  await page.waitForSelector('#detailSheet:not([hidden])');
  check('lesson shows scripture', await page.isVisible('#detailContent .scripture'));
  const lesson1 = await page.textContent('#detailContent h3');
  await page.click('[data-lesson]:not([disabled]):last-of-type');
  await page.waitForTimeout(200);
  const lesson2 = await page.textContent('#detailContent h3');
  check('lesson navigation advances', lesson1 !== lesson2, `${lesson1} -> ${lesson2}`);
  await page.click('[data-close="detailSheet"]');

  console.log('\n--- audio (hymn playback) ---');
  await page.click('[data-view="home"]');
  await page.waitForTimeout(200);
  await page.click('#hymnButton');
  await page.waitForTimeout(1200);
  const playing = await page.evaluate(() => document.getElementById('hymnButton').classList.contains('playing'));
  check('playback starts', playing, await page.textContent('#playStatus'));
  // Regression: the old build pushed every oscillator into an array that was
  // never drained, growing ~32 nodes every 8.3s. Sample it over a long play.
  const samples = [];
  for (let i = 0; i < 12; i++) {
    samples.push(await page.evaluate(() => window.__graceDebug.activeNotes()));
    await page.waitForTimeout(500);
  }
  const peak = Math.max(...samples);
  check('live oscillator count stays bounded over 6s+', peak <= 16, 'peak=' + peak + ' samples=[' + samples.join(',') + ']');
  check('node count does not grow monotonically', samples[samples.length - 1] <= peak, 'last=' + samples[samples.length - 1]);

  await page.click('#hymnButton');
  await page.waitForTimeout(400);
  check('playback stops', !(await page.evaluate(() => document.getElementById('hymnButton').classList.contains('playing'))));
  check('all nodes released on stop', (await page.evaluate(() => window.__graceDebug.activeNotes())) === 0);

  console.log('\n--- settings (date format moved here) ---');
  await page.click('#settingsButton');
  await page.waitForSelector('#settingsSheet:not([hidden])');
  check('date format lives in settings', await page.isVisible('#dateFormat'));
  check('notification settings present', await page.isVisible('#notifyTime'));
  check('youtube channel configurable', await page.isVisible('#videoChannel'));
  await page.selectOption('#dateFormat', 'iso');
  await page.click('#saveDateFormat');
  await page.waitForTimeout(200);
  const isoDate = await page.textContent('#date');
  check('date format applies', /^\d{4}-\d{2}-\d{2}$/.test(isoDate.trim()), isoDate);
  await page.click('[data-close="settingsSheet"]');

  console.log('\n--- language switch ---');
  await page.click('#languageButton');
  await page.waitForSelector('#languageSheet:not([hidden])');
  await page.click('[data-lang="en"]');
  await page.waitForTimeout(900);
  const enVerse = await page.textContent('#verse');
  const enAttr = await page.textContent('#verseAttribution');
  check('switches to English scripture', /^[A-Za-z"'(]/.test(enVerse.trim()), enVerse.slice(0, 46));
  check('English attribution correct', enAttr.includes('American Standard'), enAttr.slice(0, 40));
  await page.click('#languageButton');
  await page.click('[data-lang="ja"]');
  await page.waitForTimeout(900);
  check('switches to Japanese', /[ぁ-んァ-ヶ一-龠]/.test(await page.textContent('#verse')));

  console.log('\n--- errors ---');
  check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  check('no failed requests', failedReq.length === 0, failedReq.slice(0, 3).join(' | '));

  await browser.close();
  server.close();
  console.log(fail.length ? `\n${fail.length} FAILING: ${fail.join(', ')}` : '\nALL CHECKS PASSED');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
