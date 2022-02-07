import backendApi from "@/api/backendApi";
import User, { UserItemResponse } from "@/types/User";

export interface SessionCreateParams {
  username: string;
  password: string;
}

export type SessionResponse = UserItemResponse<{ accessToken: string }>;

export function createSession(params: SessionCreateParams): Promise<User> {
  // return backendApi.postWithMeta<User, { accessToken: string }>(
  //   "/sessions",
  //   { user: params },
  // ).then(({ data: user, meta }) => {
  //   const accessToken = meta?.accessToken;
  //   if (accessToken) backendApi.useAccessToken(accessToken);
  //   return user;
  // });
  return backendApi.post<SessionResponse>(
    "/sessions",
    { user: params },
  ).then(({ data: user, meta }) => {
    const accessToken = meta.accessToken;
    if (accessToken) backendApi.useAccessToken(accessToken);
    return user;
  });
}

export function refreshSession(): Promise<User> {
  // return backendApi.getWithMeta<User, { accessToken: string }>(
  //   "/sessions/refresh",
  // ).then(({ data: user, meta }) => {
  //   const accessToken = meta?.accessToken;
  //   if (accessToken) backendApi.useAccessToken(accessToken);
  //   return user;
  // });
  return backendApi.get<SessionResponse>(
    "/sessions/refresh",
  ).then(({ data: user, meta }) => {
    const accessToken = meta.accessToken;
    if (accessToken) backendApi.useAccessToken(accessToken);
    return user;
  });
}

export function deleteSession(): Promise<void> {
  return backendApi.delete(`/sessions`).then(() => backendApi.clearAccessToken());
}
