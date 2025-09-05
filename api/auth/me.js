const jwt = require("jsonwebtoken");
const { getDb } = require("../db.js");

module.exports = async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new (require("mongodb").ObjectId)(payload.sub) });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ email: user.email, name: user.name || "" });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Invalid token" });
  }
};
