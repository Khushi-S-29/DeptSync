const db = require("../config/db");

exports.findUserByEmail = (email, callback) => {
  db.query(
    `
    SELECT 
      u.id,
      u.email,
      u.password,
      u.role,
      u.dept_id,
      d.name AS department_name
    FROM users u
    LEFT JOIN departments d ON u.dept_id = d.id
    WHERE u.email = ?
    `,
    [email],
    callback,
  );
};

exports.createUser = (userData, callback) => {
  db.query(
    `INSERT INTO users (email, password, dept_id, role)
     VALUES (?, ?, ?, ?)`,
    [userData.email, userData.password, userData.dept_id, userData.role],
    callback,
  );
};

exports.deleteUser = (id, callback) => {
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], callback);
};