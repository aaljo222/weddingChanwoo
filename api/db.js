import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error("Missing MONGODB_URI");
if (!dbName) throw new Error("Missing MONGODB_DB");

let cached = global._mongo;
if (!cached) cached = global._mongo = { client: null, db: null };

export async function getDb() {
  if (cached.db) return cached.db;
  const client = cached.client ?? new MongoClient(uri);
  if (!cached.client) {
    await client.connect();
    cached.client = client;
  }
  cached.db = client.db(dbName);

  // users.email 유니크 인덱스(중복가입 방지)
  try {
    await cached.db
      .collection("users")
      .createIndex({ email: 1 }, { unique: true });
  } catch (_) {}
  return cached.db;
}
