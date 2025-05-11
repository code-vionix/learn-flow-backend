export const filterBySearch = (query) => {
  console.log(query);
  if (query.query) {
    const search = decodeURIComponent(query.query.trim());
    return { title: { contains: search, mode: "insensitive" } };
  }
  return {};
};
