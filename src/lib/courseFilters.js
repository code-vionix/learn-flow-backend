export const buildCourseFilter = (query) => {
  const whereClause = {
    deletedAt: null,
  };

  const hasFilters = Object.keys(query).length > 0;
  if (!hasFilters) return whereClause;

  // ----------- Free/Paid Logic -----------
  const isFree = query.free === "true";
  const isPaid = query.paid === "true";
  const minPrice = parseFloat(query.minPrice);
  const maxPrice = parseFloat(query.maxPrice);

  if (isFree && !isPaid) {
    whereClause.price = 0;
  } else if (isPaid && !isFree) {
    if (!minPrice && !maxPrice) {
      whereClause.price = { gt: 0 };
    } else {
      whereClause.price = {};
      if (!isNaN(minPrice)) whereClause.price.gte = minPrice;
      if (!isNaN(maxPrice)) whereClause.price.lte = maxPrice;
    }
  }

  // ----------- Category -----------
  if (query.category) {
    const categories = query.category
      .split(",")
      .map((c) => decodeURIComponent(c.trim()));
    if (categories.length) whereClause.category = { in: categories };
  }

  // ----------- SubCategory -----------
  if (query.subcategory || query.subCategory) {
    const subs = (query.subcategory || query.subCategory)
      .split(",")
      .map((s) => decodeURIComponent(s.trim()));
    if (subs.length) whereClause.subCategory = { in: subs };
  }

  // ----------- Tools -----------
  if (query.tools || query.Tools) {
    const tools = (query.tools || query.Tools)
      .split(",")
      .map((t) => decodeURIComponent(t.trim()));
    if (tools.length) whereClause.tags = { hasSome: tools };
  }

  // ----------- Level -----------
  if (query.level || query.CourseLevel) {
    const levels = (query.level || query.CourseLevel)
      .split(",")
      .map((l) => decodeURIComponent(l.trim()));
    if (levels.length) whereClause.level = { in: levels };
  }

  // ----------- Duration -----------
  if (query.Duration) {
    const durations = query.Duration.split(",").map((d) =>
      decodeURIComponent(d.trim())
    );
    if (durations.length) whereClause.duration = { in: durations };
  }

  // ----------- Search by Title -----------
  if (query.query) {
    const search = decodeURIComponent(query.query.trim());
    whereClause.title = { contains: search, mode: "insensitive" };
  }

  return whereClause;
};
