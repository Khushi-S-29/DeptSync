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

module.exports = router;
