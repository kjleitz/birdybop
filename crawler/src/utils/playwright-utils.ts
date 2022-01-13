import { Page } from "playwright";

export const urlsFromPageLinks = (page: Page): Promise<string[]> => {
  return page.locator("a").evaluateAll(links => links.map(a => a.href ?? ''));
};
