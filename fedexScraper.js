const puppeteer = require('puppeteer');
const searchSelector = "#cubeTwoPar-tab > div > div > div > div.fxg-app__single-tracking > div.fxg-app__form-wrapper.fxg-tracking-app__state1.at-element-marker > form > div > input.fxg-field__input-text.fxg-field__input--required";
const trackSelector = "#btnSingleTrack";
const obtainSelector = "#container > ng-component > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section:nth-child(1) > div.text-align-center.mb-4 > trk-shared-pod-link > div > button";
const viewPDFSelector = "#container > ng-component > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section:nth-child(1) > trk-shared-in-line-modal:nth-child(13) > trk-shared-stylesheet-wrapper > div > section > trk-shared-pod-form > div > div.mt-8 > button";
const statusSelector = "#container > ng-component > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page > trk-shared-stylesheet-wrapper > div > div > trk-shared-detail-page-default > div > div > section:nth-child(1) > trk-shared-shipment-status-delivery-date > h1 > span:nth-child(1)";

const fs = require('fs');

// OBJECT 218 was last processed. 

let filename = 0

// reading excel spreadsheet that's already in json format
// converted using online excel to json converter
// removed sheet name Fedex Tracking Number that's adding an additional object wrapper around the whole thing
// so just make sure the json file is an array of objects
let jsonData = JSON.parse(fs.readFileSync('tracking.json', 'utf-8'));
let scheduledDump = [];
let invalidDump = [];

async function scraper() {

    const browser = await puppeteer.launch({
        // show chrome and set GUI size
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: false,
        // use dedicated fedex chrome user profile that downloads pdf from link instead of viewing
        // https://stackoverflow.com/questions/57623828/in-puppeteer-how-to-switch-to-chrome-window-from-default-profile-to-desired-prof/57662769#57662769
        args: [`--window-size=1920,1080`, `--user-data-dir=/Users/rickeyguo/Library/Application Support/Google/Chrome/Profile 1`],
        defaultViewport: {
            width: 1280,
            height: 1003,
        }
    });

    const homePage = await browser.newPage();
    inProgress = true;
    let count = 0;
    let trackingNumber = 0
    let trackNumKey = "Shipment Tracking Number";
    let month = 0
    trackingNumber = jsonData[count]["Shipment Tracking Number"];
    month = jsonData[count]["Invoice Month (yyyymm)"];

    while (inProgress) {

        await homePage.goto('https://www.fedex.com/en-us/home.html', {
            waitUntil: 'networkidle2',
        });
        let rowNum = count + 2;

        console.log(`Object ${count}: | ${month} | Row ${rowNum}`);
        console.log(jsonData[count]);

        if (trackingNumber.toString()[0] == '0') {
            console.log("INVALID TRACKING NUMBER DETECTED");
            invalidDump.push(jsonData[count]);
            count += 1;
            trackingNumber = jsonData[count]["Shipment Tracking Number"];
            month = jsonData[count]["Invoice Month (yyyymm)"];
            await homePage.goto('https://www.fedex.com/en-us/home.html', {
                waitUntil: 'networkidle2',
            });
        }

        await homePage.waitForSelector(searchSelector);
        await homePage.type(searchSelector, trackingNumber.toString());
        await homePage.waitForSelector(trackSelector);
        await homePage.click(trackSelector);
        await homePage.waitForNavigation({ waitUntil: "domcontentloaded" });
        // UnhandledPromiseRejectionWarning: TimeoutError: waiting for selector
        await homePage.waitForTimeout(3000);
        let statusElement = await homePage.waitForSelector(statusSelector);
        let statusValue = await statusElement.evaluate(el => el.textContent);
        let status = statusValue.toString().trim();
        if (status == "Delivered") {
            console.log(`Tracking number ${trackingNumber} is Delivered`);
            await homePage.waitForSelector(obtainSelector);
            await homePage.click(obtainSelector);
            await homePage.waitForTimeout(3000);
            await homePage.waitForSelector(viewPDFSelector);
            await homePage.waitForTimeout(3000);
            await homePage.click(viewPDFSelector);
            await homePage.waitForTimeout(3000);

            filename = `${month}/${trackingNumber}.pdf`;
            fs.rename('retrievePDF.pdf', filename, function(err) {
                if (err) console.log('ERROR: ' + err);
            });;

            // the logic for stopping downloads is to simply
            // download until the month of October, which doesn't yet exist in the input data
            // or specify row number to stop at
            if (rowNum == 202110) {
                inProgress = false;
            } else {
                count += 1;
                trackingNumber = jsonData[count]["Shipment Tracking Number"];
                month = jsonData[count]["Invoice Month (yyyymm)"];
            }
        } else {
            console.log(`Tracking number ${trackingNumber} is NOT Delivered`);
            scheduledDump.push(jsonData[count]);
            console.log("Exception recorded!");
            count += 1;
            trackingNumber = jsonData[count]["Shipment Tracking Number"];
            month = jsonData[count]["Invoice Month (yyyymm)"];
        }

    }

    browser.close();
    console.log("Browser is closed.");

    fs.writeFile('exceptions.txt', JSON.stringify(scheduledDump), err => {
        if (err) {
            console.error(err)
            return
        }
        console.log("Exceptions have been written to exceptions.txt");
    })
    fs.writeFile('invalid.txt', JSON.stringify(invalidDump), err => {
        if (err) {
            console.error(err)
            return
        }
        console.log("Invalid tracking numbers have been written to invalid.txt");
    })
    console.log(`${count} rows have been processed.`);
    console.log("Program complete.");
}
scraper();