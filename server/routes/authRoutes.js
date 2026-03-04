const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { registerUser } = require("../controllers/authController");
const { getAllUsers } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/superAdminOnly");

router.post("/login", login);
router.post("/create_user", verifyToken, superAdminOnly, registerUser);
router.get("/users", verifyToken, getAllUsers);
router.delete("/users/:id", verifyToken, superAdminOnly, (req, res) => {
  const { id } = req.params;
  const { deleteUser } = require("../models/userModel");
  deleteUser(id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted successfully" });
  });
});
module.exports = router;
