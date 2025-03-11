// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input
  return input.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

// Paginate results
export const paginate = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const results = {
    data: items.slice(startIndex, endIndex),
    pagination: {
      total: items.length,
      page,
      limit,
      pages: Math.ceil(items.length / limit),
    },
  }

  if (startIndex > 0) {
    results.pagination.prev = page - 1
  }

  if (endIndex < items.length) {
    results.pagination.next = page + 1
  }

  return results
}

