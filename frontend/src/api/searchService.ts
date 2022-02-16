import backendApi from "@/api/backendApi";
import type { SearxResultCollectionResponse } from "@/types/SearxResult";
// import type SearxResults from "@/types/SearxResults";

// export function search(q: string): Promise<SearxResults> {
//   return backendApi.get<SearxResults>("/search", { params: { q } });
// }

export function search(q: string) {
  return backendApi.get<SearxResultCollectionResponse>("/search", { params: { q } });
}
