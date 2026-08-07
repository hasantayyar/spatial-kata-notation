/** Prefix a site path with Astro `base` (needed for GitHub Pages project sites). */
export function withBase(path = "/"): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (path === "/" || path === "") return base || "/";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
