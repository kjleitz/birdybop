export default interface SearxResult {
  title: string;
  url: string;
  engine: string;
  parsed_url: string[];
  engines: string[];
  positions: number[];
  content: string;
  is_onion: boolean;
  score: number;
  category: string;
  pretty_url: string;
}
