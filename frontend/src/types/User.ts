import JsonApi from "@/types/JsonApi";

export interface UserAttributes {
  username: string;
  bio: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// TODO: This actually goes outside the user data document, at the top level of
// the response body
export type UserMeta = undefined | {
  accessToken: string;
  csrfToken: string;
};

// type User = JsonApi.Document<"user", UserAttributes, undefined, UserMeta>;
type User = JsonApi.Document<"user", UserAttributes, undefined>;
export default User;
