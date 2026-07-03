const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: 'C:/tmp/crit-a-top.png', fullPage: false });
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/tmp/crit-a-mid1.png' });
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/tmp/crit-a-mid2.png' });
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/tmp/crit-a-mid3.png' });
  await page.evaluate(() => window.scrollBy(0, 1200));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/tmp/crit-a-bottom.png' });
  // Mobile view
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: 'C:/tmp/crit-a-mobile.png' });
  await b.close();
  console.log('done');
})();
