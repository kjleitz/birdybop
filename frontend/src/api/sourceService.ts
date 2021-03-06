import backendApi from "@/api/backendApi";
import type Source from "@/types/Source";
import type { SourceCollectionResponse, SourceItemResponse } from "@/types/Source";

export interface SourceCreateParams {
  name: string;
  path: string;
  description: string;
}

export type SourceUpdateParams = Partial<Source["attributes"]>;

export function createSource(params: SourceCreateParams): Promise<Source> {
  return backendApi
    .post<SourceItemResponse>("/sources", { source: params })
    .then(({ data }) => data);
}

export function fetchSources(): Promise<Source[]> {
  return backendApi
    .get<SourceCollectionResponse>("/sources")
    .then(({ data }) => data);
}

export function fetchSource(encodedPath: string, encodedUrl?: string): Promise<Source> {
  const target = encodedUrl
    ? `/sources/${encodedPath}?source_url=${encodedUrl}`
    : `/sources/${encodedPath}`;

  return backendApi
    .get<SourceItemResponse>(target)
    .then(({ data }) => data);
}

export function updateSource(id: number | string, params: SourceUpdateParams): Promise<Source> {
  return backendApi
    .patch<SourceItemResponse>(`/sources/${id}`, { source: params })
    .then(({ data }) => data);
}

export function deleteSource(id: number | string): Promise<void> {
  return backendApi.delete(`/sources/${id}`);
}
