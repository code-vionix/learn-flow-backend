export const filterByRating = (query) => {
  const ratingQuery = query.rating || query.Rating;
  const filterRatings = ratingQuery
    ? ratingQuery
        .split(",")
        .map((r) => parseFloat(r))
        .filter((r) => !isNaN(r))
    : [];
  return filterRatings.length
    ? { reviews: { some: { rating: { in: filterRatings } } } }
    : {};
};
