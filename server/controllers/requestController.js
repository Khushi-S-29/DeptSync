const db = require("../config/db");

exports.createRequest = async (req, res) => {
  const { room_id, day, slot_number, subject, dept_id } = req.body;
  try {
    const [exists] = await db
      .promise()
      .query(
        "SELECT * FROM timetable WHERE room_id = ? AND day = ? AND slot_number = ?",
        [room_id, day, slot_number],
      );

    if (exists.length > 0)
      return res.status(400).json({ message: "Slot already occupied" });

    await db
      .promise()
      .query(
        "INSERT INTO slot_requests (room_id, dept_id, day, slot_number, subject) VALUES (?, ?, ?, ?, ?)",
        [room_id, dept_id, day, slot_number, subject],
      );
    res.status(201).json({ message: "Request sent to Super Admin" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    if (status === "APPROVED") {
      const [request] = await db
        .promise()
        .query("SELECT * FROM slot_requests WHERE id = ?", [id]);
      if (request.length === 0)
        return res.status(404).json({ message: "Request not found" });
      const r = request[0];
      await db
        .promise()
        .query(
          "INSERT INTO timetable (room_id, day, slot_number, dept_id, subject) VALUES (?, ?, ?, ?, ?)",
          [r.room_id, r.day, r.slot_number, r.dept_id, r.subject],
        );

      await db.promise().query(
        `UPDATE slot_requests 
         SET status = 'REJECTED' 
         WHERE room_id = ? AND day = ? AND slot_number = ? AND id != ? AND status = 'PENDING'`,
        [r.room_id, r.day, r.slot_number, id],
      );
    }

    await db
      .promise()
      .query("UPDATE slot_requests SET status = ? WHERE id = ?", [status, id]);

    res.json({ message: `Slot approved and competing requests cleared.` });
  } catch (err) {
    res.status(500).json(err);
  }
}; 
exports.getPendingRequests = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT sr.*, d.name as dept_name, r.room_name 
      FROM slot_requests sr
      JOIN departments d ON sr.dept_id = d.id
      JOIN rooms r ON sr.room_id = r.id
      WHERE sr.status = 'PENDING'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getRequestsByRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const [rows] = await db.promise().query(
      `
      SELECT sr.*, d.name as dept_name 
      FROM slot_requests sr 
      JOIN departments d ON sr.dept_id = d.id 
      WHERE sr.room_id = ? AND sr.status = 'PENDING'`,
      [roomId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};
