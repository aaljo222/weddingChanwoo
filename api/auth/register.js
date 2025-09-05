import { getDb } from "../db.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const body = await readJson(req);
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "password must be >= 6 chars" });
    }

    const db = await getDb();
    const hash = await bcrypt.hash(password, 10);

    const doc = {
      name,
      email: String(email).toLowerCase(),
      passwordHash: hash,
      createdAt: new Date(),
    };

    const r = await db.collection("users").insertOne(doc);
    return res.status(201).json({ ok: true, userId: r.insertedId });
  } catch (e) {
    // 유니크 충돌
    if (e?.code === 11000) {
      return res.status(409).json({ error: "email already registered" });
    }
    console.error(e);
    return res.status(500).json({ error: "server error" });
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export const config = { api: { bodyParser: false } };
