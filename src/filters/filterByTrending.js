export const filterByTrending = (query) => {
  if (query.sort === "trending") {
    const trendingDate = new Date();
    trendingDate.setDate(trendingDate.getDate() - 7); // last 7 days
    return {
      reviews: {
        some: {
          rating: { gte: 4 },
          createdAt: { gte: trendingDate },
        },
      },
    };
  }
  return {};
};
