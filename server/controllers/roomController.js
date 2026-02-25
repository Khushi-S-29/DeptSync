const { createRoom, getAllRooms } = require("../models/roomModel");

exports.addRoom = (req, res) => {
  const user = req.user;

  if (user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      message: "only super sdmin can create rooms",
    });
  }

  const { room_name } = req.body;

  if (!room_name) {
    return res.status(400).json({
      message: "room name is required",
    });
  }

  createRoom(room_name, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "room already exists",
        });
      }

      return res.status(500).json(err);
    }

    res.json({
      message: "room created successfully",
      room_id: result.insertId,
    });
  });
};

exports.getRooms = (req, res) => {
  getAllRooms((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};