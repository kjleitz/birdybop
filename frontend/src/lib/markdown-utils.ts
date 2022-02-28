import { marked } from "marked";
import DOMPurify from "dompurify";
// import hljs from "highlight.js";

marked.setOptions({
  gfm: true,
  breaks: true,
  //// TODO: HighlightJS is crazy big... gotta find a way to externalize it.
  // highlight(code, lang) {
  //   const language = hljs.getLanguage(lang) ? lang : "plaintext";
  //   return hljs.highlight(code, { language }).value;
  // },
});

export default function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown);
  return DOMPurify.sanitize(html);
}
