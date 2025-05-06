import { filterByCategory } from "../filters/filterByCategory.js";
import { filterByPrice } from "../filters/filterByPrice.js";
import { filterByRating } from "../filters/filterByRating.js";
import { filterBySearch } from "../filters/filterBySearch.js";
import { filterBySubCategory } from "../filters/filterBySubCategory.js";
import { filterByTools } from "../filters/filterByTools.js";

export const buildCourseFilter = (query) => {
  let whereClause = { deletedAt: null };

  whereClause = { ...whereClause, ...filterByPrice(query) };
  whereClause = { ...whereClause, ...filterByCategory(query) };
  whereClause = { ...whereClause, ...filterBySubCategory(query) };
  whereClause = { ...whereClause, ...filterByRating(query) };
  whereClause = { ...whereClause, ...filterBySearch(query) };
  whereClause = { ...whereClause, ...filterByTools(query) };

  return whereClause;
};
