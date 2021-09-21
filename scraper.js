const puppeteer = require('puppeteer');

const searchSelector = "#HomeTrackingApp > div > input.fxg-field__input-text.fxg-field__input--required";
const trackButtonSelector = "#btnSingleTrack";
const obtainSelector = "#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > div.text-align-center.mb-4 > trk-shared-pod-link > div > button";
const viewPDFSelector = "#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > trk-shared-in-line-modal:nth-child(11) > trk-shared-stylesheet-wrapper > div > section > trk-shared-pod-form > div > div.mt-8 > button";

console.log("Selectors created");
let output = false;


let trackingNumber = 782482243362;
console.log(`Current tracking number: ${trackingNumber}`);

async function mainBrowser() {
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
    console.log("Headless browser launching...");

    const homePage = await browser.newPage();
    console.log("homePage created");

    // loading the fedex website homepage
    console.log("Loading FedEx website...");

    try {
        await homePage.goto('https://www.fedex.com/en-us/home.html', {
            waitUntil: 'networkidle2',
        });
        console.log("FedEx website LOADED");
    } catch (er) {
        console.log("FedEx website is NOT loading.");
        return false;
    }

    try {
        console.log("Waiting for Search Selector");
        await homePage.waitForSelector(searchSelector, { timeout: 3000 });
    } catch (er) {
        console.log("Search selector NOT found.");
        return false;
    }

    try {
        await homePage.waitForSelector(trackButtonSelector, { timeout: 3000 });
    } catch (er) {
        console.log("TRACK button NOT found.");
        return false;
    }

    try {
        await homePage.waitForSelector(obtainSelector, { timeout: 3000 });
    } catch (er) {
        console.log("obtain selector is NOT found.");
        return false;
    }

    try {
        await homePage.waitForSelector(viewPDFSelector, { timeout: 3000 });
    } catch (er) {
        console.log("view PDF button is NOT found.");
        return false;
    }

    buttonClicker();
    output = true;
}


async function buttonClicker() {
    await homePage.type(searchSelector, trackingNumber.toString());
    console.log("Current tracking number entered");

    await homePage.click(trackButtonSelector);
    console.log("TRACK button clicked");


    await homePage.click(obtainSelector);
    console.log("Obtain Proof of Delivery button clicked!");

    await homePage.click(viewPDFSelector);
    console.log("View PDF button clicked!");


    console.log("about to switch pages");
    let pages = await browser.pages();
    // let blankTab = pages[0];
    let fedexTab = pages[1];
    let pdfTab = pages[2];
    console.log(pages.length);
    console.log("before printing");
    console.log(typeof(pdfTab));
    console.log(typeof(fedexTab));
    console.log(typeof(homePage));
    // await fedexTab.screenshot({ path: 'real.png' });
    console.log("Success!");
    setTimeout(() => { console.log("Downloading PDF"); }, 5000);
    console.log("changing file name");
    const directory = './';
    const fs = require('fs');

    fs.readdir(directory, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
    });
    // await browser.close();
}

output = mainBrowser();
while (output == false) {
    mainBrowser();
}