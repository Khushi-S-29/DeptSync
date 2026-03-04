import { useState, useEffect } from "react";
import api from "../api/axios";
import { FiPlus, FiTrash2, FiMapPin, FiHome } from "react-icons/fi";
import "../styles/rooms.css";

const Rooms = () => {
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const deleteRoom = async (id) => {
    if (
      window.confirm(
        "WARNING: Deleting this room will permanently clear all its scheduled timetable slots. Proceed?",
      )
    ) {
      try {
        await api.delete(`/rooms/${id}`);
        fetchRooms();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete room");
      }
    }
  };

  const createRoom = async () => {
    if (!room.trim()) return alert("Enter a valid room name");
    try {
      await api.post("/rooms/create", { room_name: room });
      setRoom("");
      fetchRooms();
    } catch (err) {
      alert("Error creating room");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="rooms-page">
      <div className="glow-orb orb-top-right"></div>
      <div className="glow-orb orb-bottom-left"></div>

      <div className="glass-canvas">
        <header className="glass-header">
          <div className="title-cluster">
            <FiHome className="header-icon" />
            <h2 className="glass-title">Classrooms</h2>
          </div>
          <p className="glass-subtitle">
            Manage lecture halls and laboratory spaces
          </p>
        </header>

        <div className="glass-form-row">
          <div className="input-group-sleek">
            <FiMapPin className="field-icon" />
            <input
              className="sleek-input-field"
              placeholder="Room Name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button className="btn-pink-action" onClick={createRoom}>
            <FiPlus /> Add Room
          </button>
        </div>

        <div className="table-viewport">
          <table className="sleek-glass-table">
            <thead>
              <tr>
                <th>Identity</th>
                <th>Physical Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} className="sleek-row">
                  <td className="id-cell">#{r.id}</td>
                  <td className="room-name-cell">{r.room_name}</td>
                  <td>
                    <button
                      className="btn-trash-sleek"
                      onClick={() => deleteRoom(r.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
