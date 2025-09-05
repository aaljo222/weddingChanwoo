const { getDb } = require("../db.js");
const bcrypt = require("bcryptjs");
const { readJson, send } = require("../_utils.js");

module.exports = async (req, res) => {
  if (req.method !== "POST")
    return send(res, 405, { error: "Method Not Allowed" });

  try {
    const { email, password, name } = await readJson(req);
    if (!email || !password)
      return send(res, 400, { error: "email, password required" });

    const db = await getDb();
    const users = db.collection("users");

    const exists = await users.findOne({ email });
    if (exists) return send(res, 409, { error: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = {
      email,
      password: hash,
      name: name || "",
      createdAt: new Date(),
    };
    await users.insertOne(user);

    return send(res, 201, { ok: true });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "Internal Server Error" });
  }
};
