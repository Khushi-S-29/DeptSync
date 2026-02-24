const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { findUserByEmail, createUser } = require("../models/userModel");
const generatePassword = require("../utils/generatePassword");

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
    res.json({ token });
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
