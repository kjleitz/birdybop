import SourcePage from "@/SourcePage";
import { urlsFromPageLinks } from "@/utils/playwright-utils";
import axios from "axios";
import { Browser, chromium, Page } from "playwright";

export default class Crawler {
  private baseUrl: string;
  private crawledUrls: Set<string> = new Set();
  private uncrawledUrls: Set<string> = new Set();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.uncrawledUrls.add(this.baseUrl);
  }

  start(): Promise<void> {
    return chromium.launch().then((browser) => {
      return this.crawl(browser, this.baseUrl, (sourcePage) => {
        const solrDocument = SourcePage.solrFormat(sourcePage);
        console.log("adding", sourcePage.url);
        return axios.post("http://localhost:8000/source_pages", solrDocument)
          .catch(reason => console.log(reason?.message || reason));
      }).then(() => browser.close());
    });
  }

  private loadPage(browser: Browser, url: string): Promise<[page: Page, finish: () => Promise<void>]> {
    return new Promise((resolve, reject) => {
      browser.newPage().then((page) => {
        const finish = () => page.close();
        page.on("domcontentloaded", loadedPage => resolve([loadedPage, finish]));
        page.goto(url);
      }).catch(reject);
    });
  }

  private scrapePage(browser: Browser, url: string): Promise<SourcePage> {
    return this.loadPage(browser, url).then(([page, finish]) => {
      return Promise.all([
        page.title(),
        page.content(),
        page.innerText("body"),
      ]).then(([title, document, text]) => {
        const sourcePage = new SourcePage(url, title, document, text);
        return this.addUncrawledUrlsFrom(page).then(() => finish()).then(() => sourcePage);
      });
    });
  }

  private crawl(browser: Browser, rootUrl: string, cb?: (sourcePage: SourcePage) => void | Promise<any>): Promise<void> {
    return this.scrapePage(browser, rootUrl).then((sourcePage) => {
      this.crawledUrls.add(rootUrl);
      this.uncrawledUrls.delete(rootUrl);
      const cbResult = cb && cb(sourcePage);
      return Promise.resolve(cbResult).then(() => {
        const nextUrl = this.uncrawledUrls.values().next().value;
        if (nextUrl) return this.crawl(browser, nextUrl, cb);
      });
    });
  }

  private addUncrawledUrlsFrom(page: Page): Promise<void> {
    return urlsFromPageLinks(page).then((urls) => {
      urls.forEach((url) => {
        if (this.shouldCrawl(url)) this.uncrawledUrls.add(url);
      });
    });
  }

  private hasCrawled(url: string): boolean {
    return this.crawledUrls.has(url);
  }

  private shouldCrawl(url: string): boolean {
    return !!url && url.startsWith(this.baseUrl) && !this.hasCrawled(url);
  }
}

// import SourcePage from "@/SourcePage";
// import { urlsFromPageLinks } from "@/utils/playwright-utils";
// import { Browser, chromium, Page } from "playwright";
// import * as solr from "solr-client";

// export default class Crawler {
//   private baseUrl: string;
//   private crawledPages: Record<string, SourcePage> = {};
//   private uncrawledUrls: Set<string> = new Set();
//   private db: solr.Client;

//   constructor(baseUrl: string) {
//     this.baseUrl = baseUrl;
//     this.uncrawledUrls.add(this.baseUrl);
//     this.db = solr.createClient({ core: "source_pages" });
//   }

//   // testo(): void {
//   //   Promise.all([
//   //     "Hi",
//   //     "Hi man",
//   //     "this is high level",
//   //     "hello there",
//   //     "hello",
//   //     "what's up",
//   //     "good bye",
//   //     "see ya",
//   //     "sorry",
//   //     "what was that",
//   //     "I don't know",
//   //     "hello? are you there?",
//   //     "oh well",
//   //     "bye again",
//   //   ].map((phrase, i) => {
//   //     return this.db.add({ id: 12 + i, title_t: phrase }).then((resp) => {
//   //       console.log("Solr response:", resp);
//   //     }).catch((error) => {
//   //       console.error(error);
//   //     });
//   //   })).then(() => {
//   //     console.log("added all phrases");
//   //     this.db.commit().then((resp) => {
//   //       console.log("Commit response:", resp);
//   //     });
//   //   });
//   // }

//   start(): Promise<void> {
//     return chromium.launch().then((browser) => {
//       return this.crawl(browser, this.baseUrl, (sourcePage) => {
//         const solrDocument = SourcePage.solrFormat(sourcePage);
//         return this.db.add(solrDocument).then(() => { this.db.commit() });
//       }).then(() => {
//         const debugInfo = Object.keys(this.crawledPages).map((url) => SourcePage.debugFormat(this.crawledPages[url]));
//         console.log(`done!`, debugInfo);
//         return browser.close();
//       });
//     });
//   }

//   private loadPage(browser: Browser, url: string): Promise<[page: Page, finish: () => Promise<void>]> {
//     return new Promise((resolve, reject) => {
//       browser.newPage().then((page) => {
//         const finish = () => page.close();
//         page.on("domcontentloaded", loadedPage => resolve([loadedPage, finish]));
//         page.goto(url);
//       }).catch(reject);
//     });
//   }

//   private scrapePage(browser: Browser, url: string): Promise<void> {
//     return this.loadPage(browser, url).then(([page, finish]) => {
//       return Promise.all([
//         page.title(),
//         page.content(),
//         page.innerText("body"),
//       ]).then(([title, document, text]) => {
//         this.crawledPages[url] = new SourcePage(url, title, document, text);
//         return this.addUncrawledUrlsFrom(page).then(() => finish());
//       });
//     });
//   }

//   private crawl(browser: Browser, rootUrl: string, cb?: (sourcePage: SourcePage) => void | Promise<void>): Promise<void> {
//     return this.scrapePage(browser, rootUrl).then(() => {
//       this.uncrawledUrls.delete(rootUrl);
//       const sourcePage = this.crawledPages[rootUrl];
//       // if (typeof cb === "function") cb(sourcePage);
//       const cbResult = cb && cb(sourcePage);
//       return Promise.resolve(cbResult).then(() => {
//         const nextUrl = this.uncrawledUrls.values().next().value;
//         if (nextUrl) return this.crawl(browser, nextUrl, cb);
//       });
//     });
//   }

//   private addUncrawledUrlsFrom(page: Page): Promise<void> {
//     return urlsFromPageLinks(page).then((urls) => {
//       urls.forEach((url) => {
//         if (this.shouldCrawl(url)) this.uncrawledUrls.add(url);
//       });
//     });
//   }

//   private hasCrawled(url: string): boolean {
//     return !!this.crawledPages[url];
//   }

//   private shouldCrawl(url: string): boolean {
//     return !!url && url.startsWith(this.baseUrl) && !this.hasCrawled(url);
//   }
// }
