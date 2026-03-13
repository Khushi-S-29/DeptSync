const jwt = require("jsonwebtoken");
const {
  getSlotsByRoom,
  getTimetableByDepartment,
  updateSubject,
  getSlotById,
  insertAuditLog,
  createSlot,
} = require("../models/ttModel");

exports.getRoomSlots = (req, res) => {
  const { roomId } = req.params;

  let user = null;
  const auth = req.headers.authorization;
  if (auth) {
    try {
      let token = auth;
      if (token.startsWith("Bearer ")) token = token.slice(7);
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {}
  }

  getSlotsByRoom(roomId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(404).json({
        message: "no slots found for this room",
      });
    }
    const slots = results.map((slot) => ({
      ...slot,
      allotment_status: slot.subject ? "Allotted" : "Not Allotted",
      is_editable: user
        ? user.role === "SUPER_ADMIN" ||
          (user.role === "DEPT_ADMIN" && user.dept_id === slot.dept_id)
        : false,
    }));
    res.json(slots);
  });
};

exports.getDepartmentTimetable = (req, res) => {
  const { deptId } = req.params;
  getTimetableByDepartment(deptId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    const slots = results.map((slot) => ({
      ...slot,
      allotment_status: slot.subject ? "Allotted" : "Not Allotted",
    }));
    res.json(slots);
  });
};

exports.updateTimetable = (req, res) => {
  const { id, subject, subject_code, branch, section, teacher } = req.body;
  const user = req.user;

  getSlotById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "slot not found" });

    const slot = results[0];

    const isSuper = user.role === "SUPER_ADMIN";
    const isOwner = user.role === "DEPT_ADMIN" && user.dept_id === slot.dept_id;

    if (!isSuper && !isOwner) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updateData = { subject, subject_code, branch, section, teacher };

    updateSubject(id, updateData, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Updated successfully" });
    });
  });
};

exports.createTimetableSlot = (req, res) => {
  const user = req.user;
  if (user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only super admin can create slots" });
  }

  const { room_id, day, slot_number, dept_id, subject, subject_code, branch, section, teacher } = req.body;

  createSlot({ room_id, day, slot_number, dept_id, subject, subject_code, branch, section, teacher }, (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Slot already occupied" });
      return res.status(500).json(err);
    }
    res.json({ message: "Slot created successfully" });
  });
};