const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        // show chrome and set GUI size
        headless: false,
        args: [`--window-size=1920,1080`],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    // fedex homepage
    const homePage = await browser.newPage();

    // loading the fedex website homepage
    await homePage.goto('https://www.fedex.com/en-us/home.html', {
        waitUntil: 'networkidle2',
    });

    // filling in tracking number into search field
    await homePage.type("#HomeTrackingApp > div > input.fxg-field__input-text.fxg-field__input--required", "782482243362");
    // clicking the orange TRACK button
    await homePage.click("#btnSingleTrack");
    // wait for "Obtain Proof of Delivery" button to load
    await homePage.waitForSelector("#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > div.text-align-center.mb-4 > trk-shared-pod-link > div > button")
    // click the button
    await homePage.click("#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > div.text-align-center.mb-4 > trk-shared-pod-link > div > button");
    // click on view pdf button
    await homePage.click("#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > trk-shared-in-line-modal:nth-child(11) > trk-shared-stylesheet-wrapper > div > section > trk-shared-pod-form > div > div.mt-8 > button");



})();