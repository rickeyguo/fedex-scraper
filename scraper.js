const puppeteer = require('puppeteer');

const searchSelector = "#HomeTrackingApp > div > input.fxg-field__input-text.fxg-field__input--required";
const trackSelector = "#btnSingleTrack";
const obtainSelector = "#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > div.text-align-center.mb-4 > trk-shared-pod-link > div > button";
const viewPDFSelector = "#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > trk-shared-in-line-modal:nth-child(11) > trk-shared-stylesheet-wrapper > div > section > trk-shared-pod-form > div > div.mt-8 > button";

let trackingNumber = 782482243362;
let counter = 0;

async function restart() {
    browser.close();
    scraper();
}

// STEP 0: LOAD fedex homepage
async function scraper() {
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

    let searchClicked = false;
    let trackClicked = false;
    let obtainClicked = false;
    let viewClicked = false;

    const homePage = await browser.newPage();
    await homePage.goto('https://www.fedex.com/en-us/home.html', {
        waitUntil: 'networkidle2',
    }).then(console.log("Fedex website loaded"));

    await homePage.waitForSelector(searchSelector, { timeout: 100000 }).then(console.log("waiting for search"));
    await homePage.waitForSelector(trackSelector, { timeout: 100000 }).then(console.log("waiting for track"));

    await homePage.type(searchSelector, trackingNumber.toString()).then(searchClicked = true);
    await homePage.click(trackSelector).then(trackClicked = true).then(console.log("track clicked"));

    await homePage.waitForSelector(obtainSelector, { timeout: 100000 });
    await homePage.click(obtainSelector).then(obtainClicked = true).then(console.log("obtain clicked"));

    await homePage.waitForSelector(viewPDFSelector, { timeout: 100000 });
    await homePage.click(viewPDFSelector).then(viewClicked = true).then("view clicked");

    setTimeout(() => { console.log("Downloading PDF"); }, 100000000);
    console.log("Finished waiting");
    const fs = require('fs')

    const path = './retrievePDF.pdf'

    if (fs.existsSync(path)) {
        // path exists
        console.log("exists:", path);
        searchClicked = false;
        trackClicked = false;
        obtainClicked = false;
        viewClicked = false;
    } else {
        console.log("DOES NOT exist:", path);
        await homePage.click()
    }
}


// running the function
scraper();