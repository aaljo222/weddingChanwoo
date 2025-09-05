import { getDb } from "../db.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method Not Allowed" });
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "no token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(payload.sub) },
        { projection: { passwordHash: 0 } }
      );
    if (!user) return res.status(404).json({ error: "not found" });

    return res.status(200).json({
      user: { id: String(user._id), name: user.name, email: user.email },
    });
  } catch (e) {
    return res.status(401).json({ error: "invalid token" });
  }
}
