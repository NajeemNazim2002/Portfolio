// Adds Cloudinary auto-format/quality/width transforms. Images stored on this site (Netlify Blobs)
// are resized through Netlify Image CDN. Other URLs pass through unchanged.
export function cld(url: string, width: number) {
  if (url.startsWith("/api/images/")) return `/.netlify/images?url=${encodeURIComponent(url)}&w=${width}`;
  return url.includes("/upload/") ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`) : url;
}

export function srcSet(url: string, widths = [480, 800, 1200, 1600]) {
  return widths.map((w) => `${cld(url, w)} ${w}w`).join(", ");
}
