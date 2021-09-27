const puppeteer = require('puppeteer');

const searchSelector = "#cubeTwoPar-tab > div > div > div > div.fxg-app__single-tracking > div.fxg-app__form-wrapper.fxg-tracking-app__state1.at-element-marker > form > div > input.fxg-field__input-text.fxg-field__input--required";
const trackSelector = "#btnSingleTrack"
const obtainSelector = "#container > ng-component > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section:nth-child(1) > div.text-align-center.mb-4 > trk-shared-pod-link > div > button"
const viewPDFSelector = "#container > ng-component > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section:nth-child(1) > trk-shared-in-line-modal:nth-child(13) > trk-shared-stylesheet-wrapper > div > section > trk-shared-pod-form > div > div.mt-8 > button"
const trackAnotherSelector = "#container > ng-component > div.track-another-shipment-wrapper > app-track-another-shipment > div > div > button"
const trackingIDSelector = "#track-another-shipment-single-input";
const topTrackSelector = "#track-another-shipment-form > div:nth-child(1) > button"

async function scraper() {
    let trackingNumber = 782482243362;

    const browser = await puppeteer.launch({
        // show chrome and set GUI size

        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: false,
        // use dedicated fedex chrome user profile that downloads pdf from link instead of viewing
        // https://stackoverflow.com/questions/57623828/in-puppeteer-how-to-switch-to-chrome-window-from-default-profile-to-desired-prof/57662769#57662769
        args: [`--window-size=1920,1080`, `--user-data-dir=/Users/rickeyguo/Library/Application Support/Google/Chrome/Profile 1`],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    const homePage = await browser.newPage();
    await homePage.goto('https://www.fedex.com/en-us/home.html', {
        waitUntil: 'networkidle2',
    });


    await homePage.waitForSelector(searchSelector);
    await homePage.type(searchSelector, trackingNumber.toString());
    await homePage.waitForSelector(trackSelector);
    await homePage.click(trackSelector);
    await homePage.waitForNavigation({ waitUntil: "domcontentloaded" });
    // UnhandledPromiseRejectionWarning: TimeoutError: waiting for selector
    await homePage.waitForTimeout(3000);
    await homePage.waitForSelector(obtainSelector);
    await homePage.click(obtainSelector);

    await homePage.waitForSelector(viewPDFSelector);
    await homePage.waitForTimeout(3000);
    await homePage.click(viewPDFSelector);
    await homePage.waitForTimeout(3000);

    // track another shipment
    trackingNumber = 796036993822;

    inProgress = true;
    while (inProgress) {
        await homePage.waitForSelector(trackAnotherSelector);
        await homePage.click(trackAnotherSelector);
        await homePage.waitForSelector(trackingIDSelector);
        await homePage.type(trackingIDSelector, trackingNumber.toString());
        await homePage.waitForSelector(topTrackSelector);
        await homePage.click(topTrackSelector);

        await homePage.waitForNavigation({ waitUntil: "domcontentloaded" });
        // UnhandledPromiseRejectionWarning: TimeoutError: waiting for selector
        await homePage.waitForTimeout(3000);
        await homePage.waitForSelector(obtainSelector);
        await homePage.click(obtainSelector);

        await homePage.waitForSelector(viewPDFSelector);
        await homePage.waitForTimeout(3000);
        await homePage.click(viewPDFSelector);
        await homePage.waitForTimeout(3000);

        inProgress = false;
    }

    console.log("all working!");



}

scraper();