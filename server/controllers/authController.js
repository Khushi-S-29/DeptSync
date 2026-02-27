const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { findUserByEmail, createUser } = require("../models/userModel");
const generatePassword = require("../utils/generatePassword");
const db = require("../config/db");

exports.login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0)
      return res.status(400).json({ message: "user not found" });

    const user = results[0];

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "invalid credentials" });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        dept_id: user.dept_id,
      },
    });
  });
};
exports.registerUser = async (req, res) => {
  const { email, dept_id } = req.body;
  try {
    const pass = generatePassword();
    const hashed = await bcrypt.hash(pass, 10);
    createUser(
      { email, password: hashed, dept_id, role: "DEPT_ADMIN" },
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json(err);
        }
        return res.json({
          message: "user created",
          generatedPassword: pass,
        });
      },
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
exports.getAllUsers = (req, res) => {
  const user = req.user;

  if (user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  db.query(`SELECT id, email, role, dept_id FROM users`, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
