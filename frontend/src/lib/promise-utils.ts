const debouncedPromises: Record<string, Promise<any>> = {};

export function debouncePromise<T>(key: string, promiser: () => Promise<T>): Promise<T> {
  const existingPromise = debouncedPromises[key] as Promise<T>;
  if (existingPromise) return existingPromise;

  const promise = promiser();
  debouncedPromises[key] = promise.finally(() => { delete debouncedPromises[key] });
  return promise;
}

let promiseDebouncerKeyInt = 0;

export function promiseDebouncer<A extends any[], R>(
  promiser: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  promiseDebouncerKeyInt += 1;
  const key = `birdybop::promise-utils.ts#promiseDebouncer:${promiseDebouncerKeyInt}`;
  return (...args) => debouncePromise(key, () => promiser(...args));
}
