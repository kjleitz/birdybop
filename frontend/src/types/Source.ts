import JsonApi from "@/types/JsonApi";

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

type Source = JsonApi.Document<"source", SourceAttributes>;
export default Source;
