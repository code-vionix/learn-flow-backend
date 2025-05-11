export const filterBySubCategory = (query) => {
  const subCategoryNames =
    (query.subcategory || query.subCategory)
      ?.split(",")
      .map(decodeURIComponent) || [];
  return subCategoryNames.length > 0
    ? {
        subCategory: {
          is: { name: { in: subCategoryNames, mode: "insensitive" } },
        },
      }
    : {};
};
