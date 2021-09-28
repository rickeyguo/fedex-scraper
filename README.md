# fedex-scraper

TODO:
- [x] proof of concept using puppeteer to control browser
- [x] resolve downloading pdf from Fedex's jsp file
- [x] refactor wait-for-selector logic to improve reliability
- [x] automated a reliable download for a single tracking #
- [x] automated reliable downloads for a sequence of hard-coded tracking #
- [x] imported all tracking # into program, as JSON objects
- [x] exception handling for the case of scheduled but not delivered
- [ ] include built-in excel to json converter
- [ ] better console logs for better logging on the command line
- [ ] documentation on development process and setup procedure

## puppeteer downloading a pdf file that loads as a jsp
Fedex's website can be navigated with relative ease, but downloading the actual pdf became a tricky problem. Fedex's server backend generates the pdf as a jsp file instead of a normal pdf file, therefore preventing puppeteer from thinking it is a normal html web page or a pdf document. My solution to this is to change Chrome's default setting for opening PDFs to downloading PDFs. In other words, the "view pdf" button on the Fedex website will never launch into a PDF viewer tab but rather trigger an immediate download of the PDF document to a pre-determinted location on the local computer.

However, this workaround comes with its own problem. Puppeteer by default launches its own chromium instance and destroys it. So I have to figure out how to configure Puppeteer to use the existing Google Chrome installation AND use a profile that I have created just for this purpose. 

Stack Overflow to the rescue: 
https://stackoverflow.com/questions/47122579/run-puppeteer-on-already-installed-chrome-on-macos

