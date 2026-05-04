const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] || 'http://127.0.0.1:8765/index.html';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: CHROME,
        headless: 'new',
        args: ['--no-sandbox', '--disable-gpu'],
    });

    const sizes = [
        { name: 'desktop', w: 1440, h: 900 },
        { name: 'tablet', w: 768, h: 1000 },
        { name: 'mobile', w: 375, h: 800 },
    ];

    for (const s of sizes) {
        const page = await browser.newPage();
        await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 });
        await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

        // Force all reveal animations to "visible" so screenshot captures everything
        await page.evaluate(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
            // Also explicitly set visibility on lazy-loaded images
            document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
        });

        // Scroll through the page to nudge any viewport-based loading
        await page.evaluate(async () => {
            await new Promise(resolve => {
                let total = 0;
                const step = window.innerHeight;
                const timer = setInterval(() => {
                    window.scrollBy(0, step);
                    total += step;
                    if (total >= document.body.scrollHeight) {
                        clearInterval(timer);
                        window.scrollTo(0, 0);
                        resolve();
                    }
                }, 80);
            });
        });

        // Wait for fonts and images to settle
        await page.evaluate(() => document.fonts.ready);
        await new Promise(r => setTimeout(r, 1500));

        const out = path.join(process.cwd(), `zz-render-${s.name}.png`);
        await page.screenshot({ path: out, fullPage: true });
        console.log(`Saved ${out} (viewport ${s.w}x${s.h})`);
        await page.close();
    }

    await browser.close();
})();
