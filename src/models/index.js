import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Handle Prisma Client connection events
prisma.$on("connect", () => {
  console.log("Connected to the database");
});

prisma.$on("error", (e) => {
  console.error("Database connection error:", e);
});

// Export models for convenience
export const models = {
  user: prisma.user,
  courseCategory: prisma.courseCategory,
};

// Helper function to handle Prisma errors
export const handlePrismaError = (error) => {
  console.error("Prisma error:", error);

  if (error.code === "P2002") {
    return {
      status: "error",
      statusCode: 409,
      message: `Unique constraint failed on the field: ${error.meta?.target}`,
    };
  }

  if (error.code === "P2025") {
    return {
      status: "error",
      statusCode: 404,
      message: "Record not found",
    };
  }

  return {
    status: "error",
    statusCode: 500,
    message: "Database error occurred",
  };
};
