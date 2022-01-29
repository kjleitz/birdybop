import backendApi from "@/api/backendApi";
import SearxResults from "@/types/SearxResults";

export function search(q: string): Promise<SearxResults> {
  return backendApi.get<SearxResults>("/search", { params: { q } });
}
