const db = require("../config/db");

exports.getSlotsByRoom = (roomId, callback) => {
  db.query(
    `SELECT t.id, t.day, t.slot_number, t.subject, t.dept_id, d.name AS department_name, r.room_name
    FROM timetable t
    JOIN departments d ON t.dept_id = d.id
    JOIN rooms r ON t.room_id = r.id
    WHERE t.room_id = ?
    ORDER BY 
      FIELD(t.day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
      t.slot_number
    `,
    [roomId],
    callback,
  );
};

exports.getTimetableByDepartment = (deptId, callback) => {
  db.query(
    `SELECT t.id, t.day, t.slot_number, t.subject, t.dept_id, d.name AS department_name, r.room_name
    FROM timetable t
    JOIN departments d ON t.dept_id = d.id
    JOIN rooms r ON t.room_id = r.id
    WHERE t.dept_id = ?
    ORDER BY 
      FIELD(t.day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
      t.slot_number
    `,
    [deptId],
    callback,
  );
};

exports.getSlotById = (id, callback) => {
  db.query("SELECT * FROM timetable WHERE id = ?", [id], callback);
};

exports.updateSubject = (id, subject, callback) => {
  db.query(
    "UPDATE timetable SET subject = ? WHERE id = ?",
    [subject, id],
    callback,
  );
};

exports.insertAuditLog = (auditData, callback) => {
  db.query(
    `INSERT INTO timetable_audit (timetable_id, edited_by, old_subject, new_subject)VALUES (?, ?, ?, ?)`,
    [
      auditData.timetable_id,
      auditData.edited_by,
      auditData.old_subject,
      auditData.new_subject,
    ],
    callback,
  );
};

exports.createSlot = (slotData, callback) => {
  db.query(
    `INSERT INTO timetable (room_id, day, slot_number, dept_id, subject) VALUES (?, ?, ?, ?, ?)`,
    [
      slotData.room_id,
      slotData.day,
      slotData.slot_number,
      slotData.dept_id,
      slotData.subject || null,
    ],
    callback,
  );
};
