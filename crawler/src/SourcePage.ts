export default class SourcePage {
  public url: string;
  public title: string;
  public html: string;
  public text: string;

  constructor(url: string, title: string, html: string, text: string) {
    this.url = url;
    this.title = title;
    this.html = html;
    this.text = text;
  }

  static debugFormat(sourcePage: SourcePage): Record<string, string> {
    return {
      url: sourcePage.url,
      title: sourcePage.title,
      html: sourcePage.html.slice(0, 100) + "...",
      text: sourcePage.text.slice(0, 250) + "...",
    };
  }

  static solrFormat(sourcePage: SourcePage): Record<string, string> {
    return {
      url: sourcePage.url,
      html: sourcePage.html,
      title_t: sourcePage.title,
      text_t: sourcePage.text,
    };
  }
}
