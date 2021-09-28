# fedex-scraper

TODO:
- [x] core mechanism complete
- [ ] include built-in excel to json converter
- [ ] documentation on development process and setup procedure

## puppeteer
Fedex's website can be navigated with relative ease, but downloading the actual pdf became a tricky problem. Fedex's server backend generates the pdf as a jsp file instead of a normal pdf file, therefore preventing puppeteer from thinking it is a normal html web page or a pdf document. My solution to this is to change Chrome's default setting for opening PDFs to downloading PDFs. In other words, the "view pdf" button on the Fedex website will never launch into a PDF viewer tab but rather trigger an immediate download of the PDF document to a pre-determinted location on the local computer.

However, this workaround comes with its own problem. Puppeteer by default launches its own chromium instance and destroys it. So I have to figure out how to configure Puppeteer to use the existing Google Chrome installation AND use a profile that I have created just for this purpose. 

Stack Overflow to the rescue: 
https://stackoverflow.com/questions/47122579/run-puppeteer-on-already-installed-chrome-on-macos

