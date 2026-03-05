CREATE DATABASE IF NOT EXISTS timetable;
USE timetable;

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
  CONSTRAINT fk_user_dept 
    FOREIGN KEY (dept_id) REFERENCES departments(id) 
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS timetable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  day ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  slot_number TINYINT NOT NULL,
  dept_id INT NOT NULL,
  subject VARCHAR(150) NULL, 
  CONSTRAINT fk_tt_room 
    FOREIGN KEY (room_id) REFERENCES rooms(id) 
    ON DELETE CASCADE,
  CONSTRAINT fk_tt_dept 
    FOREIGN KEY (dept_id) REFERENCES departments(id) 
    ON DELETE CASCADE,

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

  CONSTRAINT fk_audit_tt 
    FOREIGN KEY (timetable_id) REFERENCES timetable(id) 
    ON DELETE CASCADE,
  CONSTRAINT fk_audit_user 
    FOREIGN KEY (edited_by) REFERENCES users(id) 
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS slot_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    dept_id INT NOT NULL,
    day VARCHAR(20) NOT NULL,
    slot_number INT NOT NULL,
    subject VARCHAR(255),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);