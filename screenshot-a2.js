// screenshot-a2.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await p.screenshot({ path: 'C:/tmp/a2-top.png' });
  await p.evaluate(() => window.scrollBy(0, 900)); await p.waitForTimeout(500);
  await p.screenshot({ path: 'C:/tmp/a2-mid1.png' });
  await p.evaluate(() => window.scrollBy(0, 900)); await p.waitForTimeout(500);
  await p.screenshot({ path: 'C:/tmp/a2-mid2.png' });
  await p.evaluate(() => window.scrollBy(0, 1200)); await p.waitForTimeout(500);
  await p.screenshot({ path: 'C:/tmp/a2-bottom.png' });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await p.screenshot({ path: 'C:/tmp/a2-mobile.png' });
  await b.close();
  console.log('done');
})();
