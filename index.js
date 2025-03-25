
import { MongoClient } from 'mongodb';

const uri = "mongodb://tanvir07:123456@localhost:27017/lms_backend?authSource=lms_backend";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);