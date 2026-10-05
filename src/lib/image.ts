// Adds Cloudinary auto-format/quality/width transforms. Other URLs pass through unchanged.
export function cld(url: string, width: number) {
  return url.includes("/upload/") ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`) : url;
}

export function srcSet(url: string, widths = [480, 800, 1200, 1600]) {
  return widths.map((w) => `${cld(url, w)} ${w}w`).join(", ");
}
