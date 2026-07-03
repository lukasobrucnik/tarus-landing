const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });

  // Wait for animations to settle, scroll precisely to NaseCesta
  await page.evaluate(() => {
    const el = document.getElementById('nase-cesta');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/tmp/crit-a-nasecesta2.png' });

  // Also capture the OFirme / Brands gap
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/tmp/crit-a-ofirme.png' });

  await b.close();
  console.log('done');
})();
