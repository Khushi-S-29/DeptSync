import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  FiCheck,
  FiX,
  FiClock,
  FiLayers,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import "../styles/requests.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/timetable/requests/pending");
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, status) => {
    try {
      await api.put(`/timetable/requests/${id}`, { status });
      setRequests(requests.filter((r) => r.id !== id));
    } catch (err) {
      alert("Action failed.");
    }
  };

  return (
    <div className="requests-page">
      <div className="req-orb orb-left"></div>
      <div className="req-orb orb-right"></div>

      <div className="requests-container">
        <header className="requests-header">
          <div className="header-left">
            <h1>Pending Requests</h1>
            <p style={{ color: "#8b5e66", fontWeight: 600 }}>
              Review and authorize departmental slot allocations
            </p>
          </div>
          <div className="count-badge">{requests.length} Active</div>
        </header>

        <div className="glass-table-wrapper">
          <table className="req-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Details</th>
                <th>Subject</th>
                <th>Requested At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state-text">
                    No pending requests.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="dept-tag">
                        <FiLayers />
                        <span>{req.dept_name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="slot-info">
                        <span><FiMapPin /> {req.room_name}</span>
                        <small><FiCalendar /> {req.day} • P{req.slot_number}</small>
                      </div>
                    </td>
                    <td className="subject-cell">{req.subject}</td>
                    <td style={{ color: "#8b5e66", fontSize: "0.85rem" }}>
                        {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          className="btn-approve"
                          onClick={() => handleDecision(req.id, "APPROVED")}
                        >
                          <FiCheck />
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleDecision(req.id, "REJECTED")}
                        >
                          <FiX />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Requests;