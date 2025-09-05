// /api/db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Vercel에 환경변수로 설정
const dbName = process.env.MONGODB_DB; // 예: "wedding"

if (!uri) throw new Error("Missing MONGODB_URI");
if (!dbName) throw new Error("Missing MONGODB_DB");

// 연결 캐시 (서버리스 콜드스타트 최적화)
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
  return cached.db;
}
