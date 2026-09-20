/** Prefijo de GitHub Pages (`/lectoraventura/`) o `/` en local. */
export function assetUrl(path) {
  if (!path) return "";
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${String(path).replace(/^\//, "")}`;
}
