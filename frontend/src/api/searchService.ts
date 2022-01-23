import searcherApi from "@/api/searcherApi";
import SearchResult from "@/types/SearchResult";

export interface SourcePageCreateParams {
  url: string;
  html: string;
  title_t: string;
  text_t: string;
}

export function createSourcePage(params: SourcePageCreateParams): Promise<void> {
  return searcherApi.post("/source_pages", { user: params });
}

export function searchSourcePages(q: string): Promise<SearchResult[]> {
  return searcherApi.get<SearchResult[]>("/source_pages", { params: { q } });
}
