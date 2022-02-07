import backendApi from "@/api/backendApi";
import User, { UserCollectionResponse, UserItemResponse } from "@/types/User";

export interface UserCreateParams {
  username: string;
  password: string;
  bio?: string;
}

export type UserUpdateParams = Partial<User["attributes"]> & {
  password?: string;
  newPassword?: string;
};

export function createUser(params: UserCreateParams): Promise<User> {
  // return backendApi.postWithMeta<User, { accessToken: string }>(
  //   "/users",
  //   { user: params },
  // ).then(({ data: user, meta }) => {
  //   const accessToken = meta?.accessToken;
  //   if (accessToken) backendApi.useAccessToken(accessToken);
  //   return user;
  // });
  return backendApi
    .post<UserItemResponse<{ accessToken: string }>>("/users", { user: params })
    .then(({ data: user, meta }) => {
      const accessToken = meta?.accessToken;
      if (accessToken) backendApi.useAccessToken(accessToken);
      return user;
    });
}

export function fetchUsers(): Promise<User[]> {
  return backendApi
    .get<UserCollectionResponse>("/users")
    .then(({ data }) => data);
}

export function fetchUser(id: number | string): Promise<User> {
  return backendApi
    .get<UserItemResponse>(`/users/${id}`)
    .then(({ data }) => data);
}

export function updateUser(id: number | string, params: UserUpdateParams): Promise<User> {
  return backendApi
    .patch<UserItemResponse>(`/users/${id}`, { user: params })
    .then(({ data }) => data);
}

export function deleteUser(id: number | string): Promise<void> {
  return backendApi.delete(`/users/${id}`);
}
