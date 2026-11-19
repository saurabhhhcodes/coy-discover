import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RECORDING_DIR = path.join(process.cwd(), 'recordings');
const FRAMES_DIR = path.join(RECORDING_DIR, 'frames_perfect');
const AUDIO_FILE = path.join(process.cwd(), 'audio', 'final_clean_voice.wav');

async function record() {
  if (fs.existsSync(FRAMES_DIR)) {
    fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  console.log('Launching browser with iPhone dimensions (393x852)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    protocolTimeout: 120000,
    defaultViewport: {
      width: 393,
      height: 852,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  let frameIndex = 0;

  async function capture(count = 6, delay = 140) {
    for (let i = 0; i < count; i++) {
      const filename = path.join(FRAMES_DIR, `frame_${String(frameIndex).padStart(5, '0')}.png`);
      await page.screenshot({ path: filename });
      frameIndex++;
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    }
  }

  async function clickText(text) {
    await page.evaluate((target) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((btn) => btn.innerText.includes(target));
      if (b) b.click();
    }, text);
  }

  // 1. Hard reset data store via POST
  console.log('1. Resetting test store cleanly...');
  await fetch('http://localhost:3000/api/reset', { method: 'POST' });

  // 2. Open App -> Watch Full Neo-Brutalist Splash Screen Animation
  console.log('2. Loading Coy app with animated Splash Screen...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  // Capture the splash screen with "100% Confidential", "coy." card and progress bar
  await capture(22, 120);

  // 3. Discover Tab Full Screen Deck Revealed (Photos instantly loaded from local /avatars/)
  console.log('3. Discover Tab Loaded - Showing crisp profile card...');
  await capture(10, 120);

  // 4. Test Viral Invite Modal (+3 Slots Loop)
  console.log('4. Opening Invite Modal (+3 Slots)...');
  await clickText('+3 Slots');
  await capture(10, 120);

  console.log('Copying invite link...');
  await clickText('Copy');
  await capture(8, 120);

  console.log('Simulating Friend Accepted (+3 bonus slots)...');
  await clickText('Simulate Friend Accepted');
  await capture(16, 120);

  // 5. Open and Test Filters with 18-60 Range & GPS
  console.log('5. Opening Filters modal...');
  await clickText('Filters');
  await capture(10, 120);

  console.log('Activating GPS Proximity...');
  await clickText('Use My GPS');
  await capture(8, 120);

  console.log('Applying Filters...');
  await clickText('Apply Filters');
  await capture(10, 120);

  // 6. Test Swipe Pass on card
  console.log('6. Swiping Pass on card...');
  const passBtn = await page.$('button[aria-label="Pass"]');
  if (passBtn) {
    await passBtn.click();
    await capture(12, 120);
  }

  // 7. Test Swipe Like -> Triggers MUTUAL MATCH!
  console.log('7. Secret Liking profile -> Mutual Crush Confirmed!');
  const likeBtn = await page.$('button[aria-label="Secret Crush Like"]');
  if (likeBtn) {
    await likeBtn.click();
    // Confetti and Mutual Match modal
    await capture(20, 120);
  }

  // 8. Open Matches view from Modal
  console.log('8. Opening Matches...');
  await clickText('Open Chat & Matches');
  await capture(10, 120);

  // 9. Open Real-Time Chat via "Say Hello"
  console.log('9. Clicking "Say Hello" to launch Chat...');
  await clickText('Say Hello');
  await capture(10, 120);

  // 10. Send Icebreaker in Chat
  console.log('10. Sending icebreaker prompt in chat...');
  await clickText('Hey! Guess what?');
  // Wait for automated response from Ananya
  await capture(24, 120);

  // 11. Type custom message in chat input
  console.log('11. Typing custom response...');
  const chatInput = await page.$('input[placeholder*="Say hello"]');
  if (chatInput) {
    await chatInput.type('Sounds like a plan! See you at the cafe :)', { delay: 35 });
    await capture(6, 90);
    const sendBtn = await page.$('button:has(svg.lucide-send)');
    if (sendBtn) {
      await sendBtn.click();
      await capture(12, 120);
    }
  }

  // 12. Go back to Matches list
  console.log('12. Going back to Matches list...');
  const backBtn = await page.$('button:has(svg.lucide-arrow-left)');
  if (backBtn) {
    await backBtn.click();
    await capture(8, 120);
  }

  // 13. Test Safety & Reporting Modal
  console.log('13. Testing Safety & Report modal...');
  await clickText('Report / Block');
  await capture(10, 120);

  console.log('Submitting report...');
  await clickText('Block & Report');
  await capture(14, 120);

  // 14. Return to Discover tab
  console.log('14. Returning to Discover...');
  const discoverTab = await page.$('button[aria-label="Discover"]');
  if (discoverTab) {
    await discoverTab.click();
    await capture(10, 120);
  }

  // 15. View Home Tab
  console.log('15. Checking Home Tab...');
  const homeTab = await page.$('button[aria-label="Home"]');
  if (homeTab) {
    await homeTab.click();
    await capture(12, 120);
  }

  await browser.close();
  console.log(`Captured total ${frameIndex} frames.`);
  console.log('Encoding high-fidelity MP4 video...');

  const outputFile = path.join(RECORDING_DIR, 'coy-demo-iphone.mp4');
  const desktopFile = '/Users/saurabhkumarbajpaiai/Desktop/Coy_Demo_iPhone.mp4';
  const artifactFile = '/Users/saurabhkumarbajpaiai/.gemini/antigravity/brain/046e7e7a-927d-455c-813b-71e84836275d/coy-demo-iphone.mp4';

  const fps = (frameIndex / 24.16).toFixed(2); // exactly match audio length
  console.log(`Matching framerate: ${fps} fps to clean audio duration 24.16s`);

  execSync(
    `ffmpeg -y -framerate ${fps} -i "${FRAMES_DIR}/frame_%05d.png" -i "${AUDIO_FILE}" -c:v libx264 -pix_fmt yuv420p -vf "scale=394:852" -c:a aac -b:a 192k -shortest -preset fast "${outputFile}"`
  );

  fs.copyFileSync(outputFile, desktopFile);
  fs.copyFileSync(outputFile, artifactFile);
  console.log(`✅ Success! Polished video updated at: ${desktopFile}`);
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
}

record().catch((err) => {
  console.error('Error during recording:', err);
  process.exit(1);
});
