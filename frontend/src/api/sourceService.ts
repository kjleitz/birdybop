import backendApi from "@/api/backendApi";
import Source from "@/types/Source";

export interface SourceCreateParams {
  name: string;
  path: string;
  description: string;
}

export type SourceUpdateParams = Partial<Source["attributes"]>;

export function createSource(params: SourceCreateParams): Promise<Source> {
  return backendApi.post<Source>("/sources", { source: params });
}

export function fetchSources(): Promise<Source[]> {
  return backendApi.get<Source[]>("/sources");
}

export function fetchSource(id: number | string): Promise<Source> {
  return backendApi.get<Source>(`/sources/${id}`);
}

export function updateSource(id: number | string, params: SourceUpdateParams): Promise<Source> {
  return backendApi.patch<Source>(`/sources/${id}`, { source: params });
}

export function deleteSource(id: number | string): Promise<void> {
  return backendApi.delete(`/sources/${id}`);
}
