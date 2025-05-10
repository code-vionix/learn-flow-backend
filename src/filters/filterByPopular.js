export const filterByPopular = (query) => {
  if (query.popular === "true") {
    console.log(query);
    // Sorting will happen in the main query, not here
    return {}; // Just a flag for later
  }
  return {};
};
