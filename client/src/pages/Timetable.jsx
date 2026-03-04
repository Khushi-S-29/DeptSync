import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  FiCalendar,
  FiDownload,
  FiEdit3,
  FiMapPin,
  FiX,
  FiLayers,
  FiLock,
  FiBox,
} from "react-icons/fi";
import "../styles/timetable.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const PERIOD_DATA = [
  { num: 1, time: "09:00 - 10:00" },
  { num: 2, time: "10:00 - 11:00" },
  { num: 3, time: "11:00 - 12:00" },
  { num: 4, time: "12:00 - 01:00" },
  { num: 5, time: "01:00 - 02:00" },
  { num: 6, time: "02:00 - 03:00" },
  { num: 7, time: "03:00 - 04:00" },
  { num: 8, time: "04:00 - 05:00" },
];

const TimetableGrid = () => {
  const { user } = useContext(AuthContext);
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [gridData, setGridData] = useState({});
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ subject: "", dept_id: "" });

  const isSuper = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [rRes, dRes] = await Promise.all([
          api.get("/rooms"),
          isSuper ? api.get("/departments") : Promise.resolve({ data: [] }),
        ]);
        setRooms(rRes.data);
        if (isSuper) setDepartments(dRes.data);
      } catch (err) {
        console.error("Initialization Error:", err);
      }
    };
    loadInitialData();
  }, [isSuper]);

  const fetchGrid = async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/timetable/room/${id}`);
      const map = {};
      res.data.forEach((slot) => {
        map[`${slot.day}-${slot.slot_number}`] = slot;
      });
      setGridData(map);
    } catch {
      setGridData({});
    }
  };

  const handleCellClick = (day, period, slot) => {
    const canEdit = isSuper || (slot && slot.dept_id === user.dept_id);
    if (!canEdit) return;
    setEditing({ day, period });
    setForm({ subject: slot?.subject || "", dept_id: slot?.dept_id || "" });
  };

  const saveSlot = async () => {
    try {
      const existing = gridData[`${editing.day}-${editing.period}`];
      if (existing) {
        await api.put("/timetable/update", {
          id: existing.id,
          subject: form.subject || "",
        });
      } else if (isSuper) {
        if (!form.dept_id) return alert("Assign a department.");
        await api.post("/timetable/create_slot", {
          room_id: Number(roomId),
          day: editing.day,
          slot_number: Number(editing.period),
          dept_id: Number(form.dept_id),
          subject: form.subject || "",
        });
      }
      setEditing(null);
      fetchGrid(roomId);
    } catch (err) {
      alert("Error saving slot.");
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("timetable-master-capture");
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    pdf.setFontSize(16);
    pdf.text(`Academic Schedule: Room ${roomId}`, 15, 12);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 18, pdfWidth, pdfHeight);
    pdf.save(`Timetable_${roomId}.pdf`);
  };

  return (
    <div className="tt-page-canvas">
      <div className="pink-orb orb-1"></div>
      <div className="pink-orb orb-2"></div>

      <div className="tt-glass-wrapper">
        <header className="tt-glass-nav">
          <div className="tt-nav-left">
            <FiMapPin className="pink-icon" />
            <select
              className="room-select-sleek"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                fetchGrid(e.target.value);
              }}
            >
              <option value="">Locate Resource...</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.room_name}
                </option>
              ))}
            </select>
          </div>
          <div className="tt-nav-center">
            <FiCalendar /> <span>Schedule</span>
          </div>
          <div className="tt-nav-right">
            {roomId && (
              <button className="btn-glass-pdf" onClick={downloadPDF}>
                <FiDownload /> Export
              </button>
            )}
          </div>
        </header>

        {!roomId ? (
          <div className="tt-empty-state">
            <div className="floating-cube">
              <FiBox />
            </div>
            <p>Select a room to view slot allocation.</p>
          </div>
        ) : (
          <div id="timetable-master-capture" className="tt-grid-container">
            <div className="tt-grid">
              <div className="tt-row header-row">
                <div className="tt-cell origin-cell">Time / Day</div>
                {PERIOD_DATA.map((p) => (
                  <div key={p.num} className="tt-cell p-header">
                    <span className="p-badge">P{p.num}</span>
                    <span className="p-time">{p.time}</span>
                  </div>
                ))}
              </div>

              {DAYS.map((day) => (
                <div key={day} className="tt-row">
                  <div className="tt-cell day-side-label">{day}</div>
                  {PERIOD_DATA.map((p) => {
                    const slot = gridData[`${day}-${p.num}`];
                    const isEditing =
                      editing?.day === day && editing?.period === p.num;
                    const canEdit =
                      isSuper || (slot && slot.dept_id === user.dept_id);

                    return (
                      <div
                        key={p.num}
                        className={`tt-cell slot-cell ${slot ? "filled" : "vacant"} ${canEdit ? "active" : "locked"}`}
                        onClick={() =>
                          !isEditing && handleCellClick(day, p.num, slot)
                        }
                      >
                        {!canEdit && slot && (
                          <FiLock className="cell-lock-icon" />
                        )}

                        {isEditing ? (
                          <div
                            className="glass-cell-editor"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isSuper && !slot && (
                              <select
                                className="editor-sel"
                                value={form.dept_id}
                                onChange={(e) =>
                                  setForm({ ...form, dept_id: e.target.value })
                                }
                              >
                                <option value="">Dept</option>
                                {departments.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <input
                              className="editor-inp"
                              autoFocus
                              placeholder="Subject"
                              value={form.subject}
                              onChange={(e) =>
                                setForm({ ...form, subject: e.target.value })
                              }
                            />
                            <div className="editor-btns">
                              <button
                                className="btn-save-mini"
                                onClick={saveSlot}
                              >
                                Save
                              </button>
                              <button
                                className="btn-x-mini"
                                onClick={() => setEditing(null)}
                              >
                                <FiX />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="slot-inner">
                            {slot && (
                              <span className="dept-mini-tag">
                                <FiLayers /> {slot.department_name}
                              </span>
                            )}
                            <h4 className="subject-text">
                              {slot?.subject || (canEdit ? "—" : "")}
                            </h4>
                            {canEdit && <FiEdit3 className="cell-edit-hint" />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableGrid;
