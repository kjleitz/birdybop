import type { AxiosError } from "axios";
import uniq from "lodash/uniq";

export function punctuate(phrase: string): string {
  const trimmed = phrase.trim();
  return !trimmed || trimmed.match(/[,.;!?]$/) ? trimmed : `${trimmed}.`;
}

export function toSentence(phrases: string[]): string {
  return phrases.map(phrase => punctuate(phrase)).filter(phrase => !!phrase).join(" ");
}

export function stringifyError(error: any, defaultMessage = "Something went wrong", depth = 10): string {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data;
    const message = data && (data.errors || data.error || data.messages || data.message);
    if (message) return stringifyError(message, defaultMessage, depth - 1);
  }

  if (!error || depth <= 0) return defaultMessage;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error.trim() || defaultMessage;
  if (typeof error === "number") return `Error: ${error}`;
  if (typeof error !== "object") return defaultMessage;
  if (Array.isArray(error)) return toSentence(uniq(error.map(e => stringifyError(e, defaultMessage, depth - 1))));

  const message = error.errors || error.error || error.messages || error.message;
  if (message) return stringifyError(message, defaultMessage, depth - 1);

  const errorData = error.data || error.response;
  if (errorData) return stringifyError(errorData, defaultMessage, depth - 1);

  return defaultMessage;
}

export function uniqInPlace<T>(list: T[], toKey = (item: T): any => item, reverse = false): void {
  const seen = {} as Record<string, boolean>;
  let i;

  if (reverse) {
    i = list.length - 1;

    while (i >= 0) {
      const key = toKey(list[i]);

      if (seen[key]) {
        list.splice(i, 1);
      } else {
        seen[key] = true;
      }

      i -= 1;
    }
  } else {
    i = 0;

    while (i < list.length) {
      const key = toKey(list[i]);

      if (seen[key]) {
        list.splice(i, 1);
      } else {
        seen[key] = true;
        i += 1;
      }
    }
  }
}

export function bound(value: number, min: number, max: number): number {
  let realMin = min;
  let realMax = max;

  if (min > max) {
    realMin = max;
    realMax = min;
  }

  return Math.max(Math.min(value, realMax), realMin);
}

export function classChecker<T>(klass: { new(...args: any[]): T } | { (...args: any[]): T }): (value: any) => boolean {
  const targetString = `[object ${klass.name}]`;
  const objectString = `[object Object]`;

  return (value) => {
    const asString = Object.prototype.toString.call(value);
    return asString === targetString || (asString === objectString && value instanceof klass);
  };
}

export const isArray = classChecker(Array);
export const isBoolean = classChecker(Boolean);
export const isDate = classChecker(Date);
export const isError = classChecker(Error);
export const isFunction = classChecker(Function);
export const isNumber = classChecker(Number);
export const isObject = classChecker(Object);
export const isRegExp = classChecker(RegExp);
export const isString = classChecker(String);
export const isSymbol = classChecker(Symbol);

let prevId = 0;
export function sequentialId(prefix = "tmp"): string {
  prevId += 1;
  return `${prefix}${prevId}`;
}
