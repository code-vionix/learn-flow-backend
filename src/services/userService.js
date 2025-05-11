import bcrypt from "bcryptjs"
import { prisma } from "../models/index.js"
import { AppError } from "../middleware/errorHandler.js"

export const userService = {
  // Get all users
  getAllUsers: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
  },

  // Get user by ID service
  // getUserById: async (id) => {
  //   return await prisma.user.findUnique({
  //     where: { id },
  //     select: {
  //       id: true,
  //       firstName: true,
  //       lastName: true,
  //       email: true,
  //       role: true,
  //       createdAt: true,
  //       Course: {
  //         select: {
  //           id: true,
  //           title: true,
  //           createdAt: true,
  //         },
  //       },
  //     },
  //   })
  // },

  getUserById: async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      createdCourses: true,
      enrolledCourses: true,
      submissions: true,
      grades: true,
      Note: true,
      reviews: true,
      Comment: true,
      Reply: true,
      sentMessages: true,
      receivedMessages: true,
      PaymentCard: true,
      Notification: true,
      Cart: true,
      Wishlist: true,
      SocialProfile: true,
      userSettings: true,
      NotificationSettings: true,
      PlayerSettings: true,
      IPList: true,
      lessonProgress: true,
      CourseProgress: true,
      payment: true,
      file: true,
      SubscribedToNewsletter: true,
      Instructor: true,
      Rating: true,
      NotificationList: true,
    },
  });
},

  // Create a new user
  createUser: async (userData) => {
    const { name, email, password, role } = userData

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    })

    if (userExists) {
      throw new AppError("User already exists", 400)
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return user
  },

  // Update a user
  updateUser: async (id, userData) => {
    const { name, email, password, role } = userData

    // Build update data
    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(password, salt)
    }

    // Update user
    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
  },

  // Delete a user
  deleteUser: async (id) => {
    await prisma.user.delete({
      where: { id },
    })

    return true
  },
}

