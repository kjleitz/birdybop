import type SearxResults from "@/types/SearxResults";

export function createBlankSearxResults(attributes: Partial<SearxResults> = {}): SearxResults {
  return {
    query: "",
    number_of_results: 0,
    results: [],
    answers: [],
    corrections: [],
    infoboxes: [],
    suggestions: [],
    unresponsive_engines: [],
    ...attributes,
  };
}
