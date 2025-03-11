import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@example.com",
      password: userPassword,
      role: "user",
    },
  })

  // Create sample posts
  await prisma.post.createMany({
    data: [
      {
        title: "Getting Started with Prisma",
        content: "This is a guide to get started with Prisma ORM in your Express.js application.",
        published: true,
        authorId: admin.id,
      },
      {
        title: "Building REST APIs with Express",
        content: "Learn how to build robust REST APIs using Express.js and MongoDB.",
        published: true,
        authorId: admin.id,
      },
      {
        title: "My First Post",
        content: "Hello world! This is my first post using this amazing platform.",
        published: true,
        authorId: user.id,
      },
    ],
    skipDuplicates: true,
  })

  console.log("Seed data created successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

