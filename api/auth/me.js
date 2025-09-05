const jwt = require("jsonwebtoken");
const { getDb } = require("../db.js");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    res.statusCode = 401;
    return res.json({ error: "No token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(payload.sub) });
    if (!user) {
      res.statusCode = 404;
      return res.json({ error: "User not found" });
    }

    return res.json({ email: user.email, name: user.name || "" });
  } catch (e) {
    console.error(e);
    res.statusCode = 401;
    return res.json({ error: "Invalid token" });
  }
};
