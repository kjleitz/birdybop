import JsonApi from "@/types/JsonApi";
import Source from "@/types/Source";

export interface SearxResultAttributes {
  title: string;
  url: string;
  engine: string;
  parsedUrl: string[]; // TODO: this is actually a tuple (protocol, domain, subpath, <something>, query string, <something>)
  engines: string[];
  positions: number[];
  content: string;
  isOnion: boolean;
  score: number;
  category: string;
  prettyUrl: string;
  sanitizedPath: string;
  pathSegments: string[];
  pathFamily: string[];
}

export type SearxResultRelationships = JsonApi.Relationships<{
  sources: JsonApi.CollectionRelationshipDetails;
}>;

export type SearxResultLinks = undefined;
export type SearxResultMeta = undefined;

type SearxResult = JsonApi.ResourceData<
  "searxResult",
  SearxResultAttributes,
  SearxResultRelationships,
  SearxResultLinks,
  SearxResultMeta
>;

export default SearxResult;

export type SearxResultItemResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.ItemResponse<
  SearxResult,
  Source[],
  undefined,
  M
>;

export type SearxResultCollectionResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.CollectionResponse<
  SearxResult[],
  Source[],
  undefined, // TODO: This should have pagination links
  M // TODO: This should have infoboxes and result count and stuff
>;
