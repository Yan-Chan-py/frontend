const puppeteer = require('puppeteer-core');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://127.0.0.1:8765/index.html';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: CHROME,
        headless: 'new',
        args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    const info = await page.evaluate(() => {
        const hero = document.querySelector('.hero');
        const wrap = document.querySelector('.hero-image-wrap');
        const img = document.querySelector('.hero-image');
        const container = document.querySelector('.hero-container');
        const title = document.querySelector('.hero-title');
        const text = document.querySelector('.hero-text');

        const get = el => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return {
                tag: el.tagName,
                class: el.className,
                left: Math.round(r.left), top: Math.round(r.top),
                width: Math.round(r.width), height: Math.round(r.height),
                position: cs.position,
                zIndex: cs.zIndex,
                display: cs.display,
                color: cs.color,
                visibility: cs.visibility,
                opacity: cs.opacity,
            };
        };

        return {
            hero: get(hero),
            wrap: get(wrap),
            img: get(img),
            container: get(container),
            title: get(title),
            titleText: title?.textContent?.trim().slice(0, 50),
            text: get(text),
            textText: text?.textContent?.trim().slice(0, 50),
        };
    });

    Object.entries(info).forEach(([k, v]) => console.log(k, ':', JSON.stringify(v)));

    await browser.close();
})();
