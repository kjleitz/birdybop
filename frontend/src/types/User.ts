import type JsonApi from "@/types/JsonApi";

export interface UserAttributes {
  username: string;
  bio: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// TODO: This actually goes outside the user data document, at the top level of
// the response body
// export type UserMeta = undefined | {
//   accessToken: string;
//   csrfToken: string;
// };

// type User = JsonApi.Document<"user", UserAttributes, undefined, UserMeta>;
// type User = JsonApi.Document<"user", UserAttributes, undefined>;

export type UserRelationships = undefined;
export type UserLinks = undefined;
export type UserMeta = undefined;

type User = JsonApi.ResourceData<
  "user",
  UserAttributes,
  UserRelationships,
  UserLinks,
  UserMeta
>;

export default User;

export type UserItemResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.ItemResponse<
  User,
  undefined,
  undefined,
  M
>;

export type UserCollectionResponse<
  M extends JsonApi.Meta | undefined = undefined,
> = JsonApi.CollectionResponse<
  User[],
  undefined,
  undefined, // TODO: This should have pagination links
  M
>;
