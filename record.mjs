import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RECORDING_DIR = path.join(process.cwd(), 'recordings');
const FRAMES_DIR = path.join(RECORDING_DIR, 'frames');

async function record() {
  if (fs.existsSync(FRAMES_DIR)) {
    fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  console.log('Launching Chrome in iPhone 15 Pro Max viewport...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: {
      width: 430,
      height: 932,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  let frameIndex = 0;

  async function captureFrames(count = 5, delayMs = 100) {
    for (let i = 0; i < count; i++) {
      const filename = path.join(FRAMES_DIR, `frame_${String(frameIndex).padStart(5, '0')}.png`);
      await page.screenshot({ path: filename });
      frameIndex++;
      if (delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  async function clickButtonWithText(text) {
    await page.evaluate((targetText) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.innerText.includes(targetText));
      if (btn) btn.click();
    }, text);
  }

  // 1. Reset database store first
  console.log('1. Resetting test store...');
  await page.goto('http://localhost:3000/api/reset');

  // 2. Open App -> Splash Screen Animation
  console.log('2. Loading Coy app with animated Splash Screen...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  // Capture Splash screen with official coy wordmark
  await captureFrames(24, 120);

  // Wait for Discover tab to fully reveal
  console.log('3. Discover tab loaded with full screen card deck');
  await captureFrames(12, 120);

  // 4. Open and Test Filters & GPS Proximity
  console.log('4. Opening Filters modal...');
  await clickButtonWithText('Filters');
  await captureFrames(10, 120);

  console.log('Activating GPS Proximity...');
  await clickButtonWithText('Use My GPS');
  await captureFrames(8, 120);

  console.log('Selecting Delhi Campus Circle...');
  await clickButtonWithText('Delhi / NCR');
  await captureFrames(6, 120);

  console.log('Applying Filters...');
  await clickButtonWithText('Apply Filters');
  await captureFrames(10, 120);

  // 5. Test Invite Friends & Unlock +3 Slots Loop
  console.log('5. Testing Viral Invite Modal...');
  await clickButtonWithText('+3 Slots');
  await captureFrames(10, 120);

  console.log('Simulating Friend Accepted (+3 bonus slots)...');
  await clickButtonWithText('Simulate Friend Accepted');
  await captureFrames(14, 120);

  // 6. Test Swipe Pass on card with Animated Splash Reaction
  console.log('6. Swiping Pass on first profile...');
  const passBtn = await page.$('button[aria-label="Pass"]');
  if (passBtn) {
    await passBtn.click();
    await captureFrames(14, 120);
  }

  // 7. Test Swipe Like on card -> Triggers MUTUAL MATCH!
  console.log('7. Secret Liking profile (Ananya Sharma - Mutual Crush)...');
  const likeBtn = await page.$('button[aria-label="Secret Crush Like"]');
  if (likeBtn) {
    await likeBtn.click();
    // Capture confetti burst and "Mutual Crush Confirmed!" modal
    await captureFrames(20, 120);
  }

  // 8. Open Matches view from Modal
  console.log('8. Opening Matches from Celebration Modal...');
  await clickButtonWithText('Open Chat & Matches');
  await captureFrames(10, 120);

  // 9. Open Real-Time Chat via "Say Hello"
  console.log('9. Clicking "Say Hello" to launch Chat...');
  await clickButtonWithText('Say Hello');
  await captureFrames(10, 120);

  // 10. Send Icebreaker in Chat
  console.log('10. Sending icebreaker prompt in chat...');
  await clickButtonWithText('Hey! Guess what?');
  // Capture sent message + typing + automated incoming response
  await captureFrames(25, 120);

  // 11. Type a custom message in chat input
  console.log('11. Typing custom response...');
  const chatInput = await page.$('input[placeholder*="Say hello"]');
  if (chatInput) {
    await chatInput.type('Sounds like a plan! See you at the cafe :)', { delay: 40 });
    await captureFrames(8, 100);
    const sendBtn = await page.$('button:has(svg.lucide-send)');
    if (sendBtn) {
      await sendBtn.click();
      await captureFrames(12, 120);
    }
  }

  // 12. Go back to Matches list
  console.log('12. Going back to Matches list...');
  const backBtn = await page.$('button:has(svg.lucide-arrow-left)');
  if (backBtn) {
    await backBtn.click();
    await captureFrames(8, 120);
  }

  // 13. Test Reporting & Blocking Profile
  console.log('13. Testing Safety & Report Profile modal...');
  await clickButtonWithText('Report / Block');
  await captureFrames(10, 120);

  console.log('Submitting report...');
  await clickButtonWithText('Block & Report');
  await captureFrames(16, 120);

  // 14. Switch to Discover tab and Like another crush
  console.log('14. Returning to Discover...');
  const discoverTab = await page.$('button[aria-label="Discover"]');
  if (discoverTab) {
    await discoverTab.click();
    await captureFrames(10, 120);
  }

  // Clear filters to show more profiles
  console.log('Clearing filters...');
  await clickButtonWithText('Filters');
  await captureFrames(6, 100);
  await clickButtonWithText('Reset');
  await captureFrames(6, 100);
  await clickButtonWithText('Apply Filters');
  await captureFrames(10, 120);

  // Like Tara Deshmukh (Another mutual match!)
  console.log('Liking next crush...');
  const likeBtn2 = await page.$('button[aria-label="Secret Crush Like"]');
  if (likeBtn2) {
    await likeBtn2.click();
    await captureFrames(16, 120);
  }

  // Dismiss modal via "Keep Swiping Discover"
  console.log('Dismissing match modal...');
  await clickButtonWithText('Keep Swiping Discover');
  await captureFrames(10, 120);

  // 15. View Home Tab
  console.log('15. Checking Home Tab...');
  const homeTab = await page.$('button[aria-label="Home"]');
  if (homeTab) {
    await homeTab.click();
    await captureFrames(12, 120);
  }

  await browser.close();
  console.log(`Captured total ${frameIndex} high-resolution frames.`);
  console.log('Compiling comprehensive Master Demo video via ffmpeg...');

  const outputFile = path.join(RECORDING_DIR, 'coy-discover-demo.mp4');
  execSync(
    `ffmpeg -y -framerate 10 -i "${FRAMES_DIR}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -vf "scale=430:932" -preset fast "${outputFile}"`
  );

  console.log(`Successfully generated master demo video: ${outputFile}`);
}

record().catch((err) => {
  console.error('Recording error:', err);
  process.exit(1);
});
