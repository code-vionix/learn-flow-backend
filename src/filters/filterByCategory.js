export const filterByCategory = (query) => {
  const categoryNames =
    query.category?.split(",").map(decodeURIComponent) || [];
  return categoryNames.length > 0
    ? { category: { is: { name: { in: categoryNames, mode: "insensitive" } } } }
    : {};
};
