const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // loading the fedex website homepage
    await page.goto('https://www.fedex.com/en-us/home.html', {
        waitUntil: 'networkidle2',
    });

    // filling in tracking number into search field
    await page.type("#HomeTrackingApp > div > input.fxg-field__input-text.fxg-field__input--required", "782482243362");
    // clicking the orange TRACK button
    await page.click("#btnSingleTrack");


})();