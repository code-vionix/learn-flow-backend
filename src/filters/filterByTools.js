export const filterByTools = (query) => {
  const tools =
    (query.tools || query.Tools)?.split(",").map(decodeURIComponent) || [];
  return tools.length ? { tags: { hasSome: tools } } : {};
};
