export const filterByRecent = (query) => {
  if (query.sort === "recent") {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 30); // last 30 days
    return { createdAt: { gte: recentDate } };
  }
  return {};
};
