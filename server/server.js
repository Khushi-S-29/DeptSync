require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const ttRoutes = require("./routes/ttRoutes");
const roomRoutes = require("./routes/roomRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

const initSuperAdmin = require("./utils/initSuperAdmin");
const { ready } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/timetable", ttRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/departments", departmentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
  initSuperAdmin();
});
