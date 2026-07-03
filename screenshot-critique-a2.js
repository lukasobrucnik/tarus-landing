const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });

  // Scroll to NaseCesta section
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/tmp/crit-a-nasecesta.png' });

  // Scroll to FinalCTA
  await page.evaluate(() => window.scrollTo(0, 5500));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/tmp/crit-a-finalcta.png' });

  // Scroll to Footer
  await page.evaluate(() => window.scrollTo(0, 999999));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/tmp/crit-a-footer.png' });

  // Mobile mid scroll
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/tmp/crit-a-mobile2.png' });

  await b.close();
  console.log('done');
})();
