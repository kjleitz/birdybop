import SourcePage from "@/SourcePage";
import { urlsFromPageLinks } from "@/utils/playwright-utils";
import axios from "axios";
import { Browser, chromium, Page } from "playwright";

export interface CrawlerOptions {
  baseUrl: string;
  searcherBaseUrl: string;
}

export default class Crawler {
  private baseUrl: string;
  private searcherBaseUrl: string;
  private crawledUrls: Set<string> = new Set();
  private uncrawledUrls: Set<string> = new Set();

  constructor(options: CrawlerOptions) {
    this.baseUrl = options.baseUrl;
    this.searcherBaseUrl = options.searcherBaseUrl;
    this.uncrawledUrls.add(this.baseUrl);
  }

  start(): Promise<void> {
    return chromium.launch().then((browser) => {
      return this.crawl(browser, this.baseUrl, (sourcePage) => {
        const solrDocument = SourcePage.solrFormat(sourcePage);
        console.log("adding", sourcePage.url);
        return axios.post(`${this.searcherBaseUrl}/source_pages`, solrDocument)
          .catch(reason => console.log(reason?.message || reason));
      }).then(() => browser.close());
    });
  }

  private loadPage(browser: Browser, url: string): Promise<[page: Page, finish: () => Promise<void>]> {
    return new Promise((resolve, reject) => {
      browser.newPage().then((page) => {
        const finish = () => page.close();
        page.on("domcontentloaded", loadedPage => resolve([loadedPage, finish]));
        return page.goto(url);
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
        const niceUrl = url.trim().replace(/[#?]$/, '');
        if (this.shouldCrawl(niceUrl)) this.uncrawledUrls.add(niceUrl);
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
