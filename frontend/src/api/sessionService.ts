import backendApi from "@/api/backendApi";
import User from "@/types/User";

export interface SessionCreateParams {
  username: string;
  password: string;
}

export function createSession(params: SessionCreateParams): Promise<User> {
  return backendApi.postWithMeta<User, { accessToken: string }>(
    "/sessions",
    { user: params },
  ).then(({ data: user, meta }) => {
    const accessToken = meta?.accessToken;
    if (accessToken) backendApi.useAccessToken(accessToken);
    return user;
  });
}

export function refreshSession(): Promise<User> {
  return backendApi.getWithMeta<User, { accessToken: string }>(
    "/sessions/refresh",
  ).then(({ data: user, meta }) => {
    const accessToken = meta?.accessToken;
    if (accessToken) backendApi.useAccessToken(accessToken);
    return user;
  });
}

export function deleteSession(): Promise<void> {
  return backendApi.delete(`/sessions`).then(() => backendApi.clearAccessToken());
}
