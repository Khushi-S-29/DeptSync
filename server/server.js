require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const ttRoutes = require("./routes/ttRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/timetable", ttRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});