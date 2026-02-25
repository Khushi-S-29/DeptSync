CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  dept_id INT NULL,
  role ENUM('SUPER_ADMIN','DEPT_ADMIN') NOT NULL,
  FOREIGN KEY (dept_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS timetable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  day ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  slot_number TINYINT NOT NULL,
  dept_id INT NOT NULL,
  subject VARCHAR(150) NULL,

  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (dept_id) REFERENCES departments(id),

  CONSTRAINT unique_room_day_slot UNIQUE (room_id, day, slot_number),
  CONSTRAINT check_slot_range CHECK (slot_number BETWEEN 1 AND 8)
);

CREATE TABLE IF NOT EXISTS timetable_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timetable_id INT,
  edited_by INT,
  old_subject VARCHAR(150),
  new_subject VARCHAR(150),
  status ENUM('SUCCESS','FAILED') DEFAULT 'SUCCESS',
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (timetable_id) REFERENCES timetable(id),
  FOREIGN KEY (edited_by) REFERENCES users(id)
);