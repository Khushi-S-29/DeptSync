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
  FiClock,
} from "react-icons/fi";
import "../styles/timetable.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

const Timetable = () => {
  const { user } = useContext(AuthContext);
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [gridData, setGridData] = useState({});
  const [pendingRequests, setPendingRequests] = useState({});
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    subject_code: "",
    branch: "",
    section: "",
    teacher: "",
    dept_id: "",
  });

  const isSuper = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [rRes, dRes] = await Promise.all([
          api.get("/rooms"),
          api.get("/departments"), 
        ]);
        setRooms(rRes.data);
        setDepartments(dRes.data);
      } catch (err) {
        console.error("Initial load failed", err);
      }
    };
    if (user) loadInitialData();
  }, [user]);

  const fetchGrid = async (id) => {
    if (!id) return;
    try {
      const [gridRes, reqRes] = await Promise.all([
        api.get(`/timetable/room/${id}`),
        api.get(`/timetable/requests/room/${id}`),
      ]);

      const gridMap = {};
      gridRes.data.forEach((s) => (gridMap[`${s.day}-${s.slot_number}`] = s));
      setGridData(gridMap);

      const reqMap = {};
      reqRes.data.forEach((r) => {
        if (isSuper || r.dept_id === user.dept_id) {
          reqMap[`${r.day}-${r.slot_number}`] = r;
        }
      });
      setPendingRequests(reqMap);
    } catch {
      setGridData({});
      setPendingRequests({});
    }
  };

  const handleCellClick = (day, period, slot, isPending) => {
    const isOwner = slot && slot.dept_id === user?.dept_id;
    const isVacant = !slot && !isPending;

    if (!isSuper && !isOwner && !isVacant) return;

    setEditing({ day, period, slot });
    setForm({
      subject: slot?.subject || "",
      subject_code: slot?.subject_code || "",
      branch: slot?.branch || "",
      section: slot?.section || "",
      teacher: slot?.teacher || "",
      dept_id: slot?.dept_id || user.dept_id || "", 
    });
  };

  const saveAction = async () => {
    try {
      const existing = editing.slot;
      const payload = {
        ...form,
        room_id: Number(roomId),
        day: editing.day,
        slot_number: Number(editing.period),
      };

      if (isSuper || (existing && existing.dept_id === user.dept_id)) {
        if (existing) {
          await api.put("/timetable/update", { id: existing.id, ...payload });
        } else {
          await api.post("/timetable/create_slot", payload);
        }
      } else if (!existing && !isSuper) {
        await api.post("/timetable/requests", payload);
        alert("Request submitted!");
      }

      setEditing(null);
      fetchGrid(roomId);
    } catch (err) {
      alert("Action failed.");
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("timetable-master-capture");
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 20, 280, 150);
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
                <option key={r.id} value={r.id}>{r.room_name}</option>
              ))}
            </select>
          </div>
          <div className="tt-nav-center"><FiCalendar /> <span>Schedule</span></div>
          <div className="tt-nav-right">
            {roomId && <button className="btn-glass-pdf" onClick={downloadPDF}><FiDownload /> Export</button>}
          </div>
        </header>

        {!roomId ? (
          <div className="tt-empty-state">
            <div className="floating-cube"><FiBox /></div>
            <p>Select a room to view schedule.</p>
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
                    const pending = !slot ? pendingRequests[`${day}-${p.num}`] : null;
                    const isOwner = slot && slot.dept_id === user?.dept_id;
                    const canEdit = isSuper || isOwner || (!slot && !isSuper);

                    return (
                      <div
                        key={p.num}
                        className={`tt-cell slot-cell ${slot ? "filled" : pending ? "pending" : "vacant"} ${canEdit && !pending ? "active" : "locked"}`}
                        onClick={() => handleCellClick(day, p.num, slot, !!pending)}
                      >
                        {pending && <div className="pending-tag"><FiClock /> Pending</div>}
                        {!canEdit && slot && !pending && <FiLock className="cell-lock-icon" />}
                        <div className="slot-inner">
                          {(slot || pending) && (
                            <span className="dept-mini-tag">
                              <FiLayers /> {slot?.department_name || pending?.dept_name}
                            </span>
                          )}
                          <h4 className="subject-text">{slot?.subject || pending?.subject || (canEdit ? "—" : "")}</h4>
                          {slot?.teacher && <span className="teacher-name">{slot.teacher}</span>}
                          {canEdit && !pending && <FiEdit3 className="cell-edit-hint" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {editing && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Edit Timetable Cell</h3>
              <button className="close-btn" onClick={() => setEditing(null)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="modal-grid">
                <div className="form-group">
                  <label>Room *</label>
                  <input value={rooms.find((r) => r.id == roomId)?.room_name || ""} disabled />
                </div>
                <div className="form-group">
                  <label>Day *</label>
                  <input value={editing.day} disabled />
                </div>
                <div className="form-group">
                  <label>Time Slot *</label>
                  <input value={PERIOD_DATA.find((p) => p.num === editing.period)?.time || ""} disabled />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  {isSuper ? (
                    <select value={form.dept_id} onChange={(e) => setForm({ ...form, dept_id: e.target.value })}>
                      <option value="" disabled>Select Department</option>
                      {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={departments.find((d) => d.id === Number(form.dept_id))?.name || "My Department"}
                      disabled
                      className="uneditable-input"
                    />
                  )}
                </div>
                <div className="form-group">
                  <label>Subject Code</label>
                  <input value={form.subject_code} onChange={(e) => setForm({ ...form, subject_code: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Subject Name</label>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
                </div>
                <div className="form-group full-width">
                  <label>Teacher</label>
                  <input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-save-primary" onClick={saveAction}>
                {isSuper || editing.slot ? "Save" : "Request Approval"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;