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
  const user = req.user;
  getSlotsByRoom(roomId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(404).json({
        message: "no slots found for this room",
      });
    }
    const res = results.map((slot) => ({
      ...slot,
      allotment_status: slot.subject ? "Allotted" : "Not Allotted",
      is_editable:
        user.role === "SUPER_ADMIN" ||
        (user.role === "DEPT_ADMIN" && user.dept_id === slot.dept_id),
    }));
    res.json(res);
  });
};

exports.getDepartmentTimetable = (req, res) => {
  const { deptId } = req.params;
  getTimetableByDepartment(deptId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    const res = results.map((slot) => ({
      ...slot,
      allotment_status: slot.subject ? "Allotted" : "Not Allotted",
    }));
    res.json(res);
  });
};

exports.updateTimetable = (req, res) => {
  const { id, subject } = req.body;
  const user = req.user;
  getSlotById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      insertAuditLog(
        {
          timetable_id: id,
          edited_by: user.id,
          old_subject: null,
          new_subject: subject,
          status: "FAILED",
          reason: "slot not found",
        },
        () => {},
      );
      return res.status(404).json({ message: "slot not found" });
    }
    const slot = results[0];
    if (
      user.role !== "SUPER_ADMIN" &&
      !(user.role === "DEPT_ADMIN" && user.dept_id === slot.dept_id)
    ) {
      insertAuditLog(
        {
          timetable_id: id,
          edited_by: user.id,
          old_subject: slot.subject,
          new_subject: subject,
          status: "FAILED",
          reason: "unauthorized attempt",
        },
        () => {},
      );
      return res.status(403).json({
        message: "unauthorized: cannot edit this slot",
      });
    }

    const oldSubject = slot.subject;

    updateSubject(id, subject, (err) => {
      if (err) return res.status(500).json({ error: err });

      insertAuditLog(
        {
          timetable_id: id,
          edited_by: user.id,
          old_subject: oldSubject,
          new_subject: subject,
          status: "SUCCESS",
          reason: null,
        },
        (err) => {
          if (err) return res.status(500).json({ error: err });
          res.json({ message: "updated successfully" });
        },
      );
    });
  });
};

exports.createTimetableSlot = (req, res) => {
  const user = req.user;
  if (user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      message: "only super admin can create slots",
    });
  }
  const { room_id, day, slot_number, dept_id, subject } = req.body;
  createSlot({ room_id, day, slot_number, dept_id, subject }, (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "slot already exists for this room, day, and slot number",
        });
      }
      return res.status(500).json(err);
    }
    res.json({
      message: "slot created successfully",
    });
  });
};
