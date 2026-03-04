import { useState } from "react";
import api from "../api/axios";

const Slots = () => {
  const [data, setData] = useState({
    room_id: "",
    day: "",
    slot_number: "",
    dept_id: "",
  });

  const createSlot = async () => {
    if (!data.room_id || !data.day || !data.slot_number || !data.dept_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/timetable/create_slot", {
        room_id: Number(data.room_id),
        day: data.day,
        slot_number: Number(data.slot_number),
        dept_id: Number(data.dept_id),
      });

      alert("Slot created successfully");

      setData({
        room_id: "",
        day: "",
        slot_number: "",
        dept_id: "",
      });
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data) {
        alert(
          `Error: ${error.response.data.message || "Something went wrong"}`,
        );
      } else {
        alert("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="page">
      <h2 className="title">Create Slot</h2>

      <input
        placeholder="Room ID"
        className="form-input"
        value={data.room_id}
        onChange={(e) => setData({ ...data, room_id: e.target.value })}
      />

      <select
        className="form-input"
        value={data.day}
        onChange={(e) => setData({ ...data, day: e.target.value })}
      >
        <option className="form-input" value="">
          Select Day
        </option>
        <option className="form-input" value="Monday">
          Monday
        </option>
        <option className="form-input" value="Tuesday">
          Tuesday
        </option>
        <option className="form-input" value="Wednesday">
          Wednesday
        </option>
        <option className="form-input" value="Thursday">
          Thursday
        </option>
        <option className="form-input" value="Friday">
          Friday
        </option>
        <option className="form-input" value="Saturday">
          Saturday
        </option>
      </select>

      <input
        placeholder="Slot Number (1-8)"
        type="number"
        min="1"
        max="8"
        className="form-input"
        value={data.slot_number}
        onChange={(e) => setData({ ...data, slot_number: e.target.value })}
      />

      <input
        placeholder="Dept ID"
        className="form-input"
        value={data.dept_id}
        onChange={(e) => setData({ ...data, dept_id: e.target.value })}
      />

      <button onClick={createSlot} className="form-button btn-success">
        Create Slot
      </button>
    </div>
  );
};

export default Slots;
