const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await p.screenshot({ path: 'C:/tmp/b2-desktop.png', fullPage: true });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await p.screenshot({ path: 'C:/tmp/b2-mobile.png', fullPage: true });
  // Scroll on mobile to see bottom
  await p.evaluate(() => window.scrollBy(0, 2000));
  await p.waitForTimeout(400);
  await p.screenshot({ path: 'C:/tmp/b2-mobile-bottom.png' });
  await b.close();
  console.log('done');
})();
