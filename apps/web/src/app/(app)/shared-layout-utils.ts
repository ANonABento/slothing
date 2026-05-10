const detailGridClasses = {
  withDetail: "grid gap-8 transition-all duration-300 ease-out lg:grid-cols-2",
  single: "grid gap-8 transition-all duration-300 ease-out lg:grid-cols-[minmax(0,42rem)]",
  singleComfortable:
    "grid gap-8 transition-all duration-300 ease-out lg:grid-cols-[minmax(0,56rem)]",
} as const;

export function getResponsiveDetailGridClass(
  hasDetailPanel: boolean,
  singleWidth: "default" | "comfortable" = "default",
): string {
  return hasDetailPanel
    ? detailGridClasses.withDetail
    : detailGridClasses[singleWidth === "comfortable" ? "singleComfortable" : "single"];
}
