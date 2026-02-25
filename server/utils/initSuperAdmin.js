const bcrypt = require("bcryptjs");
const db = require("../config/db");

const initSuperAdmin = () => {
  db.query(
    "SELECT * FROM users WHERE role = 'SUPER_ADMIN'",
    async (err, results) => {
      if (err) {
        console.error("Error checking Super Admin:", err);
        return;
      }

      if (results.length === 0) {
        try {
          const email = process.env.SUPER_ADMIN_EMAIL;
          const password = process.env.SUPER_ADMIN_PASSWORD;

          if (!email || !password) {
            console.error("Super Admin credentials not set in .env");
            return;
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          db.query(
            `INSERT INTO users (email, password, dept_id, role)
             VALUES (?, ?, NULL, 'SUPER_ADMIN')`,
            [email, hashedPassword],
            (err) => {
              if (err) {
                console.error("Error creating Super Admin:", err);
                return;
              }

              console.log("super admin created successfully");
            }
          );
        } catch (error) {
          console.error("Error hashing password:", error);
        }
      } else {
        console.log("Super Admin already exists");
      }
    }
  );
};

module.exports = initSuperAdmin;