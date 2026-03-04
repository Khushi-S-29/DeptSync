const db = require("../config/db");

exports.createRoom = (room_name, callback) => {
  db.query(
    "INSERT INTO rooms (room_name) VALUES (?)",
    [room_name],
    callback
  );
};

exports.getAllRooms = (callback) => {
  db.query("SELECT * FROM rooms", callback);
};

exports.deleteRoom = (id, callback) => {
  const query = "DELETE FROM rooms WHERE id = ?";
  db.query(query, [id], callback);
};