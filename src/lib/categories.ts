export const categories = {
  GRAPHIC_DESIGN: {
    label: "Graphic design",
    slug: "graphic-design",
    dot: "bg-bloom",
    fill: "bg-bloom text-ink",
    bar: "border-bloom",
  },
  WEB_DEVELOPMENT: {
    label: "Web development",
    slug: "web-development",
    dot: "bg-signal",
    fill: "bg-signal text-white",
    bar: "border-signal",
  },
} as const;

export type CategoryKey = keyof typeof categories;

export function categoryFromSlug(slug?: string): CategoryKey | undefined {
  return (Object.keys(categories) as CategoryKey[]).find((k) => categories[k].slug === slug);
}
