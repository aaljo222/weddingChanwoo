const { getDb } = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readJson, send } = require("../_utils.js");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res) => {
  if (req.method !== "POST")
    return send(res, 405, { error: "Method Not Allowed" });
  if (!JWT_SECRET) return send(res, 500, { error: "JWT_SECRET not set" });

  try {
    const { email, password } = await readJson(req);
    if (!email || !password)
      return send(res, 400, { error: "email, password required" });

    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ email });
    if (!user) return send(res, 401, { error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return send(res, 401, { error: "Invalid credentials" });

    const token = jwt.sign({ email, sub: String(user._id) }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return send(res, 200, { token, email, name: user.name || "" });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "Internal Server Error" });
  }
};
