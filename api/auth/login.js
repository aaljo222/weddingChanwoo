const { getDb } = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// 요청 body 읽기
function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.json({ error: "Method Not Allowed" });
  }
  if (!JWT_SECRET) {
    res.statusCode = 500;
    return res.json({ error: "JWT_SECRET not set" });
  }

  try {
    const { email, password } = await readJson(req);
    if (!email || !password) {
      res.statusCode = 400;
      return res.json({ error: "email, password required" });
    }

    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ email });
    if (!user) {
      res.statusCode = 401;
      return res.json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.statusCode = 401;
      return res.json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email, sub: String(user._id) }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token, email, name: user.name || "" });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    return res.json({ error: "Internal Server Error" });
  }
};
