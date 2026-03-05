const express = require("express");
const router = express.Router();
const requestCtrl = require("../controllers/requestController");
const { verifyToken } = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/superAdminOnly");

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
router.get(
  "/requests/pending",
  verifyToken,
  superAdminOnly,
  requestCtrl.getPendingRequests,
);
router.put(
  "/requests/:id",
  verifyToken,
  superAdminOnly,
  requestCtrl.updateRequestStatus,
);
router.get("/requests/room/:roomId", verifyToken, requestCtrl.getRequestsByRoom);
router.post("/requests", verifyToken, requestCtrl.createRequest);

module.exports = router;
