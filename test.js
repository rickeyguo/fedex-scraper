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
    const searchSelector = "#HomeTrackingApp > div > input.fxg-field__input-text.fxg-field__input--required";
    const trackButtonSelector = "#btnSingleTrack";
    const obtainSelector = "#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > div.text-align-center.mb-4 > trk-shared-pod-link > div > button";
    const viewPDFSelector = "#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > trk-shared-in-line-modal:nth-child(11) > trk-shared-stylesheet-wrapper > div > section > trk-shared-pod-form > div > div.mt-8 > button";
    let trackingNumber = 782482243362;
    // loading the fedex website homepage
    await homePage.goto('https://www.fedex.com/en-us/home.html', {
        waitUntil: 'networkidle2',
    });

    // filling in tracking number into search field
    //await homePage.waitForNavigation({ waitUntil: 'networkidle0', });
    await homePage.waitForSelector(searchSelector)
    await homePage.type(searchSelector, trackingNumber.toString());
    // click the orange TRACK button
    //await homePage.waitForNavigation({ waitUntil: 'networkidle0', });
    await homePage.waitForSelector(trackButtonSelector)
    await homePage.click(trackButtonSelector);
    // click "Obtain Proof of Delivery" button
    //await homePage.waitForNavigation({ waitUntil: 'networkidle0', });
    await homePage.waitForSelector(obtainSelector);
    await homePage.click(obtainSelector);
    // click on "view pdf" button
    //await homePage.waitForNavigation({ waitUntil: 'networkidle0', });
    await homePage.waitForSelector(viewPDFSelector);
    await homePage.click(viewPDFSelector);


    let tabs = await browser.pages();


})();