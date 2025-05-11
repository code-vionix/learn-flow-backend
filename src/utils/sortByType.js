export const sortByType = (query) => {
  const sort = query.sort;

  if (sort === "popular") {
    return { enrollments: { _count: "desc" } };
  }
  if (sort === "recent") {
    return { createdAt: "desc" };
  }
  if (sort === "trending") {
    return { reviews: { _count: "desc" } };
  }

  return { createdAt: "desc" }; // default fallback
};
