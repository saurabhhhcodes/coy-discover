import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.join(process.cwd(), 'coy_screenshots');

async function interactCoy() {
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
  await page.goto('https://app.getcoy.com', { waitUntil: 'networkidle2' });

  // 1. Initial Screen
  await page.screenshot({ path: path.join(OUT_DIR, '01_story_step1.png') });

  // 2. Click "Next" on the story walk-through
  for (let i = 2; i <= 4; i++) {
    const nextBtn = await page.$('button.btn, button:has-text("Next")');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(OUT_DIR, `0${i}_story_step.png`) });
    }
  }

  // 3. Skip or get to Login
  const skipBtn = await page.$('button.skip-btn, button:has-text("Skip")');
  if (skipBtn) {
    await skipBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUT_DIR, '05_phone_login.png') });
  }

  await browser.close();
  console.log('Finished capturing app.getcoy.com interactive steps.');
}

interactCoy().catch(console.error);
