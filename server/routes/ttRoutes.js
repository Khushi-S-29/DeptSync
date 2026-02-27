const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
  getRoomSlots,
  updateTimetable,
  getDepartmentTimetable,
  createTimetableSlot,
} = require("../controllers/ttController");

router.get("/room/:roomId", getRoomSlots);
router.get("/department/:deptId", getDepartmentTimetable);
router.put("/update", verifyToken, updateTimetable);
router.post("/create_slot", verifyToken, createTimetableSlot);
module.exports = router;
