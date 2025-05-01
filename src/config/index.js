import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // JWT
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // API
  apiPrefix: "/api/v1",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
