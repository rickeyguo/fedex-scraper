const puppeteer = require('puppeteer');

const searchSelector = "#HomeTrackingApp > div > input.fxg-field__input-text.fxg-field__input--required";
const trackSelector = "#btnSingleTrack";
const obtainSelector = "#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > div.text-align-center.mb-4 > trk-shared-pod-link > div > button";
const viewPDFSelector = "#trk-module-div > app-tracking-homepage-root > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section > trk-shared-in-line-modal:nth-child(11) > trk-shared-stylesheet-wrapper > div > section > trk-shared-pod-form > div > div.mt-8 > button";

console.log("Selectors created");

let trackingNumber = 782482243362;

async function restartOutside() {
    homePage();
}

// STEP 0: LOAD fedex homepage
async function homePage() {
    let steps = [true, homePageCheck(), homePageClick(), obtainCheck(), obtainClick(), pdfCheck(), pdfClick()];
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
        console.log("STEP 0 complete. Moving onto STEP 1");
        steps[1]();
    } catch (er) {
        console.log("------------------FedEx website is NOT loading");
        console.log("Attempting AGAIN");
        browser.close();
        restartOutside();
    }

    // STEP 1: checking for selectors on homepage
    async function homePageCheck() {
        try {
            console.log("Waiting for Search Selector");
            await homePage.waitForSelector(searchSelector, { timeout: 10000 });
            console.log("Search Selector FOUND");
            console.log("Waiting for Track Selector");
            await homePage.waitForSelector(trackSelector, { timeout: 10000 });
            console.log("Track Selector FOUND");
            console.log("STEP 1 complete. Moving onto STEP 2");
            steps[2]();

        } catch (er) {
            console.log("------------------Search OR Track Selectors are NOT found");
            console.log("Going back to STEP 0");
            browser.close();
            restartOutside()
        }
    }

    // STEP 2: clicking on selectors on homepage
    async function homePageClick() {
        try {
            await homePage.type(searchSelector, trackingNumber.toString());
            console.log("Current tracking number entered");
            await homePage.click(trackButtonSelector);
            console.log("TRACK button clicked");
        } catch (er) {
            console.log("------------------homePageClick error");
            browser.close();
            restartOutside();
        }
    }

    // STEP 3: check obtain selector
    async function obtainCheck() {
        try {
            console.log("Waiting for Obtain Selector");
            await homePage.waitForSelector(obtainSelector, { timeout: 10000 });
            console.log("Obtain Selector FOUND");
        } catch (er) {
            console.log("------------------obtain selector is NOT found.");
            browser.close();
            restartOutside();
        }
    }

    // STEP 4: click obtain selector
    async function obtainClick() {
        try {
            await homePage.click(obtainSelector);
            console.log("Obtain Selector clicked");

        } catch (er) {
            console.log("------------------view obtain selector is NOT found.");
            browser.close();
            restartOutside();
        }

    }

    // STEP 5: check view pdf button
    async function pdfCheck() {
        try {

            console.log("Waiting for View PDF Selector");
            await homePage.waitForSelector(viewPDFSelector, { timeout: 10000 });
            console.log("View PDF selector FOUND");
        } catch (er) {
            console.log("------------------View PDF selector NOT FOUND");
            browser.close();
            restartOutside();
        }
    }

    // STEP 6: click view pdf button
    async function pdfClick() {
        try {
            await homePage.click(viewPDFSelector);
            console.log("clicking viewPDF");
            setTimeout(() => { console.log("Downloading PDF"); }, 10000);
        } catch (er) {
            console.log("------------------pdfClick error");
            browser.close();
            restartOutside();
        }
    }

}
homePage();