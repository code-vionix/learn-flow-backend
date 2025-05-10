export const filterByPrice = (query) => {
  const priceFilter = {};
  const isFree = query.free === "true";
  const isPaid = query.paid === "true";
  const minPrice = parseFloat(query.minPrice);
  const maxPrice = parseFloat(query.maxPrice);

  if (isFree && !isPaid) priceFilter.price = 0;
  if (isPaid && !isFree) {
    if (!isNaN(minPrice))
      priceFilter.price = { ...priceFilter.price, gte: minPrice };
    if (!isNaN(maxPrice))
      priceFilter.price = { ...priceFilter.price, lte: maxPrice };
  }

  return priceFilter;
};
