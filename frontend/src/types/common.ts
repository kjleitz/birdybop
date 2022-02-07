export type RequireAll<T> = { [P in keyof T]-?: T[P] };

export type Require<T, P extends keyof T> = Pick<T, Exclude<keyof T, P>> & RequireAll<Pick<T, P>>;
