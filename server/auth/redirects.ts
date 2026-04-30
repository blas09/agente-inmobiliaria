export function getSafeAppRedirectUrl(next: string | null, origin: string) {
  const fallbackPath = "/dashboard";
  const targetPath = next?.startsWith("/") ? next : fallbackPath;
  const targetUrl = new URL(targetPath, origin);

  if (targetUrl.origin !== origin) {
    return new URL(fallbackPath, origin);
  }

  return targetUrl;
}
