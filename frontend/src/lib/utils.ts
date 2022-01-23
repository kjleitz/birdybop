import { AxiosError } from "axios";
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
