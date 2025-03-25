// import { MongoClient } from 'mongodb';

// const uri = "mongodb://tanvir07:123456@localhost:27017/lms_backend?authSource=lms_backend";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function run() {
//   try {
//     await client.connect();
//     console.log("Connected successfully");
//   } finally {
//     await client.close();
//   }
// }

// run().catch(console.dir);

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Inserts data into a specified Prisma model dynamically.
 *
 * @param {string} modelName - The name of the Prisma model (e.g., "course", "user").
 * @param {Object} data - The JSON object containing data to insert.
 */
const insertData = async (modelName, data) => {
  try {
    if (!prisma[modelName]) {
      throw new Error(`Model '${modelName}' does not exist in Prisma schema.`);
    }

    const result = await prisma[modelName].create({
      data,
    });

    console.log(`${modelName} created:`, result);
    return result;
  } catch (error) {
    console.error(`Error inserting data into ${modelName}:`, error);
  } finally {
    await prisma.$disconnect();
  }
};

// Example usage
insertData("user", {
  firstName: "Akash",
  lastName: "Mahmud",
  email: "test8@gmail.com",
  password: "Pass@1234",
});
