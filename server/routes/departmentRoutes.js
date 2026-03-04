const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/superAdminOnly");
const {
  addDepartment,
  getDepartments,
  removeDepartment,
} = require("../controllers/deptController");

router.post("/create", verifyToken, superAdminOnly, addDepartment);
router.get("/", verifyToken, getDepartments);
router.delete("/:id", verifyToken, superAdminOnly, removeDepartment);
module.exports = router;
