import { useState, useEffect } from "react";
import api from "../api/axios";
import { FiPlus, FiTrash2, FiBriefcase, FiLayers } from "react-icons/fi";
import "../styles/departments.css";

const Departments = () => {
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const deleteDept = async (id) => {
    if (
      window.confirm(
        "WARNING: This will delete ALL users and timetable slots associated with this department. Continue?",
      )
    ) {
      try {
        await api.delete(`/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete department");
      }
    }
  };

  const createDept = async () => {
    if (!name.trim()) return alert("Please enter a department name");
    try {
      await api.post("/departments/create", { name });
      setName("");
      fetchDepartments();
    } catch (err) {
      alert("Error creating department");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="dept-page">
      <div className="pink-orb orb-top-left"></div>
      <div className="pink-orb orb-bottom-right"></div>

      <div className="glass-canvas">
        <header className="glass-header">
          <div className="title-cluster">
            <FiLayers className="header-icon" />
            <h2 className="glass-title">Department Registry</h2>
          </div>
          <p className="glass-subtitle">
            Organize and manage academic divisions
          </p>
        </header>

        <div className="glass-form-row">
          <div className="input-group-sleek">
            <FiBriefcase className="field-icon" />
            <input
              className="sleek-input-field"
              placeholder="e.g. Computer Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className="btn-pink-action" onClick={createDept}>
            <FiPlus /> Add Dept
          </button>
        </div>

        <div className="table-viewport">
          <table className="sleek-glass-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Academic Division</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.id} className="sleek-row">
                  <td className="id-cell">ID-{d.id}</td>
                  <td className="dept-name-cell">{d.name}</td>
                  <td>
                    <button
                      className="btn-trash-sleek"
                      onClick={() => deleteDept(d.id)}
                      title="Delete Department"
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

export default Departments;
