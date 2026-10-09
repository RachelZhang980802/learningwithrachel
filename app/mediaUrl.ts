import verifiedKeys from "./r2VerifiedMediaKeys.json";

export const MEDIA_ASSET_BASE_URL = "https://assets.negentropylearning.com.cn";

const verifiedMediaKeys = new Set<string>(verifiedKeys);

/** Keep unverified and external URLs unchanged; preserve query strings and PDF fragments. */
export function toMediaUrl(path: string): string {
  if (!path.startsWith("/")) return path;
  const match = /^\/([^?#]+)(.*)$/.exec(path);
  if (!match || !verifiedMediaKeys.has(match[1])) return path;
  return `${MEDIA_ASSET_BASE_URL}/${match[1]}${match[2]}`;
}
