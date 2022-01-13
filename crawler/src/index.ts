import Crawler from "@/Crawler";

// import { chromium } from "playwright";

const crawler = new Crawler("http://localhost:8080");
// crawler.testo();
crawler.start();


// chromium.launch().then((browser) => {
//   browser.newPage().then((page) => {
//     page.goto("http://localhost:8080").then(() => {
//       page.innerHTML("body").then((doc) => {
//         console.log(doc);
//         page.close().then(() => {
//           console.log("closing");
//           browser.close();
//         });
//       });
//     });
//   });
// });
