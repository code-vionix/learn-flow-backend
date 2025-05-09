import { filterByCategory } from "../filters/filterByCategory.js";
import { filterByPopular } from "../filters/filterByPopular.js";
import { filterByPrice } from "../filters/filterByPrice.js";
import { filterByRating } from "../filters/filterByRating.js";
import { filterByRecent } from "../filters/filterByRecent.js";
import { filterBySearch } from "../filters/filterBySearch.js";
import { filterBySubCategory } from "../filters/filterBySubCategory.js";
import { filterByTools } from "../filters/filterByTools.js";
import { filterByTrending } from "../filters/filterByTrending.js";

export const buildCourseFilter = (query) => {
  let whereClause = { deletedAt: null };

  whereClause = { ...whereClause, ...filterByPrice(query) };
  whereClause = { ...whereClause, ...filterByCategory(query) };
  whereClause = { ...whereClause, ...filterBySubCategory(query) };
  whereClause = { ...whereClause, ...filterByRating(query) };
  whereClause = { ...whereClause, ...filterBySearch(query) };
  whereClause = { ...whereClause, ...filterByTools(query) };
  whereClause = { ...whereClause, ...filterByRecent(query) };
  whereClause = { ...whereClause, ...filterByTrending(query) };
  whereClause = { ...whereClause, ...filterByPopular(query) };

  return whereClause;
};
