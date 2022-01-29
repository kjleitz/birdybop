import SearxInfobox from "@/types/SearxInfobox";
import SearxResult from "@/types/SearxResult";

export default interface SearxResults {
  query: string;
  number_of_results: number;
  results: SearxResult[];
  answers: unknown[];
  corrections: unknown[];
  infoboxes: SearxInfobox[];
  suggestions: unknown[];
  unresponsive_engines: unknown[];
}
