const db = require("../config/db");

exports.createDepartment = (name, callback) => {
  db.query(
    "INSERT INTO departments (name) VALUES (?)",
    [name],
    callback
  );
};

exports.getAllDepartments = (callback) => {
  db.query("SELECT * FROM departments", callback);
};