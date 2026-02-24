const db = require("../config/db");

exports.findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

exports.createUser = (userData, callback) => {
  db.query(
    `INSERT INTO users (email, password, dept_id, role)
     VALUES (?, ?, ?, ?)`,
    [
      userData.email,
      userData.password,
      userData.dept_id,
      userData.role
    ],
    callback
  );
};