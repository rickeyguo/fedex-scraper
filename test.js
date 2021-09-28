const fs = require('fs');

function test() {
    count = 0
    scheduledDump = [];
    let jsonData = JSON.parse(fs.readFileSync('tracking.json', 'utf-8'));
    scheduledDump.push(jsonData[count]);
    console.log("Browser is closed.");

    fs.writeFile('exceptions.txt', JSON.stringify(scheduledDump), err => {
        if (err) {
            console.error(err)
            return
        }
        console.log("Exceptions have been written to exceptions.txt");
    })
    console.log(`${count} rows have been processed.`);
    console.log("Program complete.");
}

function invalid() {
    count = 218;
    invalidDump = [];
    let jsonData = JSON.parse(fs.readFileSync('tracking.json', 'utf-8'));
    trackingNumber = jsonData[count]["Shipment Tracking Number"];

    if (trackingNumber.toString()[0] == '0') {
        console.log("INVALID TRACKING NUMBER DETECTED");
        invalidDump.push(jsonData[count]);
    }

    fs.writeFile('invalid.txt', JSON.stringify(invalidDump), err => {
        if (err) {
            console.error(err)
            return
        }
        console.log("Invalid tracking numbers have been written to invalid.txt");
    })

}

test();
invalid();