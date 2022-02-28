import backendApi from "@/api/backendApi";
import { catchHttpCode } from "@/lib/error-filters";
import type User from "@/types/User";
import type { UserItemResponse } from "@/types/User";

export const SESSION_REFRESH_PERIOD_MINUTES = 5;
export const SESSION_REFRESH_PERIOD_SECONDS = SESSION_REFRESH_PERIOD_MINUTES * 60;
export const SESSION_REFRESH_PERIOD_MILLISECONDS = SESSION_REFRESH_PERIOD_SECONDS * 1000;

export interface SessionCreateParams {
  username: string;
  password: string;
}

export type SessionResponse = UserItemResponse<{ accessToken: string }>;

export function createSession(params: SessionCreateParams): Promise<User> {
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

let keepSessionAliveTimeout = 0;

export function keepSessionAlive(eager = false): void {
  window.clearTimeout(keepSessionAliveTimeout);

  keepSessionAliveTimeout = window.setTimeout(() => {
    keepSessionAlive(true);
  }, SESSION_REFRESH_PERIOD_MILLISECONDS);

  if (!eager) return;

  refreshSession().catch(catchHttpCode(401, (_error) => {
    window.clearTimeout(keepSessionAliveTimeout);
  }));
}

export function letSessionDie(): void {
  window.clearTimeout(keepSessionAliveTimeout);
}
