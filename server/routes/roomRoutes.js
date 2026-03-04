const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const {superAdminOnly} = require("../middleware/superAdminOnly")
const { addRoom, getRooms,removeRoom } = require("../controllers/roomController");

router.post("/create", verifyToken, addRoom);
router.get("/", verifyToken, getRooms);
router.delete("/:id", verifyToken,superAdminOnly, removeRoom);

module.exports = router;