import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.join(process.cwd(), 'coy_screenshots');

async function captureCoy() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log('Navigating to https://app.getcoy.com ...');
  try {
    await page.goto('https://app.getcoy.com', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(OUT_DIR, '01_landing_mobile.png'), fullPage: true });
    console.log('Saved 01_landing_mobile.png');

    // Desktop view as well
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.screenshot({ path: path.join(OUT_DIR, '01_landing_desktop.png') });
    console.log('Saved 01_landing_desktop.png');

    // Back to mobile
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

    // Look for links, buttons or forms
    const content = await page.content();
    fs.writeFileSync(path.join(OUT_DIR, 'page_source.html'), content);
    console.log('Saved page_source.html');

  } catch (err) {
    console.error('Error navigating:', err);
  } finally {
    await browser.close();
  }
}

captureCoy().catch(console.error);
