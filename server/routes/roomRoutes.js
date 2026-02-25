const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { addRoom, getRooms } = require("../controllers/roomController");

router.post("/create", verifyToken, addRoom);
router.get("/", verifyToken, getRooms);

module.exports = router;