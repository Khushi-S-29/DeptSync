const db = require("../config/db");

exports.getSlotsByRoom = (roomId, callback) => {
  db.query(
    `SELECT t.id, t.day, t.slot_number, t.subject, t.subject_code, t.branch, t.section, t.teacher, t.dept_id, d.name AS department_name, r.room_name
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
    `SELECT t.id, t.day, t.slot_number, t.subject, t.subject_code, t.branch, t.section, t.teacher, t.dept_id, d.name AS department_name, r.room_name
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

exports.updateSubject = (id, data, callback) => {
  db.query(
    `UPDATE timetable 
     SET subject = ?, subject_code = ?, branch = ?, section = ?, teacher = ? 
     WHERE id = ?`,
    [data.subject, data.subject_code, data.branch, data.section, data.teacher, id],
    callback
  );
};
exports.createSlot = (data, callback) => {
  db.query(
    `INSERT INTO timetable (room_id, day, slot_number, dept_id, subject, subject_code, branch, section, teacher) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.room_id, data.day, data.slot_number, data.dept_id, data.subject, data.subject_code, data.branch, data.section, data.teacher],
    callback
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
