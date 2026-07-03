const { chromium } = require('playwright');
const path = require('path');
const os = require('os');

(async () => {
  const tmpDir = os.tmpdir();
  const desktopPath = path.join(tmpDir, 'crit-b-desktop.png');
  const mobilePath = path.join(tmpDir, 'crit-b-mobile.png');

  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: desktopPath, fullPage: true });
  console.log('Desktop saved:', desktopPath);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log('Mobile saved:', mobilePath);

  await b.close();
  console.log('done');
})();
