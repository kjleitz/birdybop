export function encodeUriComponentBase64(value: string): string {
  return btoa(encodeURIComponent(value));
}

export function decodeUriComponentBase64(value: string): string {
  return decodeURIComponent(atob(value));
}
