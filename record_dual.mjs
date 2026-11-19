import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RECORDING_DIR = path.join(process.cwd(), 'recordings');
const AUDIO_FILE = path.join(process.cwd(), 'audio', 'master_voiceover.wav');
const SUBTITLES_FILE = path.join(RECORDING_DIR, 'subtitles.srt');

const DEVICES = [
  {
    name: 'iphone',
    displayName: 'Apple iPhone (iOS)',
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    rawVideo: path.join(RECORDING_DIR, 'coy-demo-iphone-raw.mp4'),
    finalVideo: path.join(RECORDING_DIR, 'coy-demo-iphone.mp4'),
    framesDir: path.join(RECORDING_DIR, 'frames_iphone')
  },
  {
    name: 'android',
    displayName: 'Google Pixel / Android',
    width: 412,
    height: 915,
    deviceScaleFactor: 2,
    rawVideo: path.join(RECORDING_DIR, 'coy-demo-android-raw.mp4'),
    finalVideo: path.join(RECORDING_DIR, 'coy-demo-android.mp4'),
    framesDir: path.join(RECORDING_DIR, 'frames_android')
  }
];

async function runSession(device) {
  console.log(`\n==================================================`);
  console.log(`▶ Starting walkthrough for ${device.displayName} (${device.width}x${device.height})`);
  console.log(`==================================================`);

  if (fs.existsSync(device.framesDir)) {
    fs.rmSync(device.framesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(device.framesDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    protocolTimeout: 120000,
    defaultViewport: {
      width: device.width,
      height: device.height,
      deviceScaleFactor: device.deviceScaleFactor,
      isMobile: true,
      hasTouch: true
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  let frameIndex = 0;

  async function captureFrames(count = 5, delayMs = 100) {
    for (let i = 0; i < count; i++) {
      const filename = path.join(device.framesDir, `frame_${String(frameIndex).padStart(5, '0')}.png`);
      await page.screenshot({ path: filename });
      frameIndex++;
      if (delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  async function clickButtonWithText(text) {
    try {
      await page.evaluate((targetText) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find((b) => b.innerText.includes(targetText));
        if (btn) btn.click();
      }, text);
    } catch (e) {
      console.warn(`Click warning for text "${text}":`, e.message);
    }
  }

  // 1. Reset database store first
  console.log('1. Resetting test store...');
  await page.goto('http://localhost:3000/api/reset', { waitUntil: 'networkidle0' });

  // 2. Open App -> Brand New Neo-Brutalist Splash Screen Animation
  console.log('2. Loading Coy app with new Neo-brutalist Splash Screen...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await captureFrames(24, 100);

  // 3. Discover tab loaded with full screen card deck
  console.log('3. Discover tab loaded');
  await captureFrames(10, 100);

  // 4. Test New Styled Invite Modal (+3 Slots Loop)
  console.log('4. Testing newly redesigned Coy neo-brutalist Invite Modal...');
  await clickButtonWithText('+3 Slots');
  await captureFrames(12, 100);

  // Copy link action inside invite modal
  console.log('Testing Copy Link in Invite Modal...');
  await clickButtonWithText('Copy');
  await captureFrames(8, 100);

  // Simulate friend acceptance
  console.log('Simulating Friend Accepted (+3 bonus slots)...');
  await clickButtonWithText('Simulate Friend Accepted');
  await captureFrames(16, 100);

  // 5. Open and Test Filters with 18-60 Age Slider & GPS Proximity
  console.log('5. Opening Filters modal with Age Range up to 60...');
  await clickButtonWithText('Filters');
  await captureFrames(10, 100);

  console.log('Activating GPS Proximity...');
  await clickButtonWithText('Use My GPS');
  await captureFrames(8, 100);

  console.log('Applying Filters...');
  await clickButtonWithText('Apply Filters');
  await captureFrames(10, 100);

  // 6. Test Swipe Pass on card with Animated Reaction
  console.log('6. Swiping Pass on first profile...');
  const passBtn = await page.$('button[aria-label="Pass"]');
  if (passBtn) {
    await passBtn.click();
    await captureFrames(14, 100);
  }

  // 7. Test Swipe Like on card -> Triggers MUTUAL MATCH!
  console.log('7. Secret Liking profile (Ananya Sharma - Mutual Crush)...');
  const likeBtn = await page.$('button[aria-label="Secret Crush Like"]');
  if (likeBtn) {
    await likeBtn.click();
    await captureFrames(20, 100);
  }

  // 8. Open Matches view from Modal
  console.log('8. Opening Matches from Celebration Modal...');
  await clickButtonWithText('Open Chat & Matches');
  await captureFrames(10, 100);

  // 9. Open Real-Time Chat via "Say Hello"
  console.log('9. Clicking "Say Hello" to launch Chat...');
  await clickButtonWithText('Say Hello');
  await captureFrames(10, 100);

  // 10. Send Icebreaker in Chat
  console.log('10. Sending icebreaker prompt in chat...');
  await clickButtonWithText('Hey! Guess what?');
  await captureFrames(24, 100);

  // 11. Type a custom message in chat input
  console.log('11. Typing custom response...');
  const chatInput = await page.$('input[placeholder*="Say hello"]');
  if (chatInput) {
    await chatInput.type('Sounds like a plan! See you at the cafe :)', { delay: 30 });
    await captureFrames(6, 80);
    const sendBtn = await page.$('button:has(svg.lucide-send)');
    if (sendBtn) {
      await sendBtn.click();
      await captureFrames(12, 100);
    }
  }

  // 12. Go back to Matches list
  console.log('12. Going back to Matches list...');
  const backBtn = await page.$('button:has(svg.lucide-arrow-left)');
  if (backBtn) {
    await backBtn.click();
    await captureFrames(8, 100);
  }

  // 13. Test Reporting & Blocking Profile
  console.log('13. Testing Safety & Report Profile modal...');
  await clickButtonWithText('Report / Block');
  await captureFrames(10, 100);

  console.log('Submitting report...');
  await clickButtonWithText('Block & Report');
  await captureFrames(14, 100);

  // 14. Switch to Discover tab and Like another crush
  console.log('14. Returning to Discover...');
  const discoverTab = await page.$('button[aria-label="Discover"]');
  if (discoverTab) {
    await discoverTab.click();
    await captureFrames(10, 100);
  }

  // 15. View Home Tab
  console.log('15. Checking Home Tab...');
  const homeTab = await page.$('button[aria-label="Home"]');
  if (homeTab) {
    await homeTab.click();
    await captureFrames(12, 100);
  }

  await browser.close();
  console.log(`Captured total ${frameIndex} frames for ${device.displayName}.`);
  console.log(`Compiling raw video with subtitles and background music via ffmpeg...`);

  const scaleW = device.width % 2 === 0 ? device.width : device.width + 1;
  const scaleH = device.height % 2 === 0 ? device.height : device.height + 1;

  // Compile video with subtitles burnt in and natural voiceover + background music audio
  const srtPathEscaped = SUBTITLES_FILE.replace(/:/g, '\\:');
  const ffmpegCmd = `ffmpeg -y -framerate 10 -i "${device.framesDir}/frame_%05d.png" -i "${AUDIO_FILE}" -c:v libx264 -pix_fmt yuv420p -vf "scale=${scaleW}:${scaleH},subtitles='${srtPathEscaped}':force_style='FontName=Arial,FontSize=12,PrimaryColour=&H00FFFFFF,OutlineColour=&H0015121D,BorderStyle=3,Outline=2,Shadow=1,MarginV=30'" -c:a aac -b:a 192k -shortest -preset fast "${device.finalVideo}"`;

  execSync(ffmpegCmd);

  console.log(`✅ Saved polished ${device.displayName} MP4 with voice, music, & subtitles: ${device.finalVideo}`);
  fs.rmSync(device.framesDir, { recursive: true, force: true });
}

async function main() {
  for (const device of DEVICES) {
    await runSession(device);
  }
  console.log('\n🎉 Both iPhone and Android videos compiled successfully!');
}

main().catch((err) => {
  console.error('Recording error:', err);
  process.exit(1);
});
