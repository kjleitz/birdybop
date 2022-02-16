import type JsonApi from "@/types/JsonApi";

export interface SourceAttributes {
  submitterId: number;
  name: string;
  description: string;
  path: string;
  karma: number;
  commentsCount: number;
  lastCrawledAt: string;
  createdAt: string;
  updatedAt: string;
}

// type Source = JsonApi.Document<"source", SourceAttributes>;

export type SourceRelationships = undefined;
export type SourceLinks = undefined;
export type SourceMeta = undefined;

type Source = JsonApi.ResourceData<
  "source",
  SourceAttributes,
  SourceRelationships,
  SourceLinks,
  SourceMeta
>;

export default Source;

export type SourceItemResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.ItemResponse<
  Source,
  undefined,
  undefined,
  M
>;

export type SourceCollectionResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.CollectionResponse<
  Source[],
  undefined,
  undefined, // TODO: This should have pagination links
  M
>;
