import dotenv from "dotenv"

// Load environment variables
dotenv.config()

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // JWT
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  // API
  apiPrefix: "/api/v1",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
}

