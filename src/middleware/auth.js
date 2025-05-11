import jwt from "jsonwebtoken"
import { config } from "../config/index.js"
import { AppError } from "./errorHandler.js"
import { prisma } from "../models/index.js"

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    // 1) Get token from authorization header
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return next(new AppError("You are not logged in. Please log in to get access.", 401))
    }

    // 2) Verify token
    const decoded = jwt.verify(token, config.jwtSecret)

    // 3) Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return next(new AppError("The user belonging to this token no longer exists.", 401))
    }

    // 4) Grant access to protected route
    req.user = user
    next()
  } catch (error) {
    next(new AppError("Not authorized, token failed", 401))
  }
}

// Restrict to certain roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403))
    }
    next()
  }
}

