const { getDb } = require("../db.js");
const bcrypt = require("bcryptjs");

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

  try {
    const { email, password, name } = await readJson(req);
    if (!email || !password) {
      res.statusCode = 400;
      return res.json({ error: "email, password required" });
    }

    const db = await getDb();
    const users = db.collection("users");

    const exists = await users.findOne({ email });
    if (exists) {
      res.statusCode = 409;
      return res.json({ error: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = {
      email,
      password: hash,
      name: name || "",
      createdAt: new Date(),
    };
    await users.insertOne(user);

    res.statusCode = 201;
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    return res.json({ error: "Internal Server Error" });
  }
};
