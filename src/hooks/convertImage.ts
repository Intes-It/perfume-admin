import { BASE_URL } from '../utils/fetch';

export function stripBaseUrl(url: string): string {
  if (url.startsWith(BASE_URL)) {
    return url.substring(BASE_URL.length);
  }
  return url;
}
