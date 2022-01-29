export default interface SearxInfobox {
  infobox: string;
  id: string;
  content: string;
  img_src: string | null;
  urls: { title: string; url: string; official?: boolean }[];
  engine: string;
  engines: string[];
  attributes?: { label: string; value: string; entity: string }[];
}
