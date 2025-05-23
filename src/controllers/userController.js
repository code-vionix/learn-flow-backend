import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";
import { userService } from "../services/userService.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
};

// @desc    Regenerate access token
// @route   POST /api/v1/users/access-token
// @access  Private
export const regenerateAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    console.log(refreshToken)

    if (!refreshToken) {
      return next(new AppError("Refresh token is required", 400));
    }

    jwt.verify(refreshToken, config.jwtRefreshSecret, async (err, decoded) => {
      if (err) {
        return next(new AppError("Invalid refresh token", 401));
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      res.status(200).json({
        accessToken: generateToken(user.id, user.role),
      });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return next(new AppError("User already exists", 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        role: user.role,
        accessToken: generateToken(user.id, user.role),
        refreshToken: generateRefreshToken(user.id),
      });
    } else {
      return next(new AppError("Invalid user data", 400));
    }
  } catch (error) {
    next(error);
  }
};

export const oauthLoginUser = async (req, res) => {
  console.log("🔥 oauthLoginUser hit");
  console.log("📨 Request Body:", req.body);
  const { email, name, image } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const [firstName, ...rest] = name?.split(" ") || [];
      const lastName = rest.join(" ") || "";

      user = await prisma.user.create({
        data: {
          email,
          firstName: firstName || "Google",
          lastName: lastName || "User",
          imageUrl: image,
          emailVerified: true,
          role: "STUDENT",
        },
      });
    }

    // ✅ Generate access token (valid for 1 hour)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Optional: Generate refresh token (valid for 7 days)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "OAuth login failed",
      error: error.message,
    });
  }
};
// @desc    Auth user & get token
// @route   POST /api/v1/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        image: user.imageUrl,
        bio: user.bio,
        accessToken: generateToken(user.id, user.role),
        refreshToken: generateRefreshToken(user.id),
      });
    } else {
      return next(new AppError("Invalid email or password", 401));
    }
  } catch (error) {
    next(error);
  }
};


// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      return next(new AppError("User not found", 404));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  console.log('.......', req.params.id);
  try {
    const user = await userService.getUserById(req.params.id);

    if (user) {
      res.json(user);
    } else {
      return next(new AppError("User not found", 404));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a user
// @route   POST /api/v1/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await userService.createUser({
      name,
      email,
      password,
      role: role || "user",
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

const userId = req.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};


// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const success = await userService.deleteUser(req.params.id);

    if (success) {
      res.json({ message: "User removed" });
    } else {
      return next(new AppError("User not found", 404));
    }
  } catch (error) {
    next(error);
  }
};
