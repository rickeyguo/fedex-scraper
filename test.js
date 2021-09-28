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

test();