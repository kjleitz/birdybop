import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";

marked.setOptions({
  gfm: true,
  breaks: true,
  // highlight(code, lang, done) {
  //   console.log("highlighting...")
  //   return import("highlight.js").then(({ default: hljs }) => {
  //     console.log("imported, checking language...", lang);
  //     const language = hljs.getLanguage(lang) ? lang : "plaintext";
  //     console.log("language found...", language);
  //     return hljs.highlight(code, { language }).value;
  //     // const result = hljs.highlight(code, { language }).value;
  //     // done!(undefined, result);
  //   });
  // },
  highlight(code, lang) {
    console.log("imported, checking language...", lang);
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    console.log("language found...", language);
    return hljs.highlight(code, { language }).value;
  },
});

export default function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown);
  // const html = marked(markdown);
  return DOMPurify.sanitize(html);
}
