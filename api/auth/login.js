import { getDb } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Vercel 환경변수로 넣기

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });
  if (!JWT_SECRET) return res.status(500).json({ error: "JWT_SECRET not set" });

  try {
    const body = await readJson(req);
    const { email, password } = body;
    if (!email || !password)
      return res.status(400).json({ error: "email, password required" });

    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = jwt.sign(
      { sub: String(user._id), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email },
    });
  } catch (e) {
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
