const {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
} = require("../models/departmentModel");
const db = require("../config/db");
exports.addDepartment = (req, res) => {
  const user = req.user;

  if (user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      message: "only super admin can create departments",
    });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "department name is required",
    });
  }

  createDepartment(name, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "department already exists",
        });
      }

      return res.status(500).json(err);
    }
    res.json({
      message: "department created successfully",
      department_id: result.insertId,
    });
  });
};

exports.getDepartments = (req, res) => {
  getAllDepartments((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
exports.removeDepartment = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM timetable WHERE dept_id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);

    db.query("DELETE FROM users WHERE dept_id = ?", [id], (err) => {
      if (err) return res.status(500).json(err);

      db.query("DELETE FROM departments WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Department and all associated data deleted." });
      });
    });
  });
};
