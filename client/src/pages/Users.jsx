import { useState, useEffect } from "react";
import api from "../api/axios";
import { FiUserPlus, FiTrash2, FiShield, FiBriefcase } from "react-icons/fi";
import "../styles/users.css";

const Users = () => {
  const [email, setEmail] = useState("");
  const [deptId, setDeptId] = useState("");
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Permanently delete this user?")) {
      try {
        await api.delete(`/auth/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const createUser = async () => {
    if (!email || !deptId) {
      alert("Please provide both email and department");
      return;
    }
    try {
      const res = await api.post("/auth/create_user", {
        email,
        dept_id: deptId,
      });
      alert("Generated Password: " + res.data.generatedPassword);
      fetchUsers();
      setEmail("");
      setDeptId("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  return (
    <div className="users-canvas">
      <div className="aesthetic-orb orb-primary"></div>
      <div className="aesthetic-orb orb-secondary"></div>

      <div className="glass-panel">
        <header className="glass-panel-header">
          <div className="panel-title-group">
            <h2 className="panel-title">Users</h2>
          </div>
          <p className="panel-subtitle"></p>
        </header>

        <div className="glass-action-bar">
          <div className="input-cluster">
            <input
              className="glass-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="select-wrapper">
              <select
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
                className="glass-field glass-select-field"
              >
                <option value="">Assign Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn-pink-gradient" onClick={createUser}>
            <FiUserPlus /> Create User
          </button>
        </div>

        <div className="table-container-sleek">
          <table className="glass-data-table">
            <thead>
              <tr>
                <th>Identity</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="glass-data-row">
                  <td className="identity-cell">
                    <span className="id-tag">#{u.id}</span>
                    <span className="email-text">{u.email}</span>
                  </td>
                  <td>
                    <span className={`badge-role ${u.role}`}>
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="dept-cell">
                    {u.role === "SUPER_ADMIN"
                      ? "Global Access"
                      : u.department_name || `ID: ${u.dept_id}`}
                  </td>
                  <td>
                    {u.role !== "SUPER_ADMIN" && (
                      <button
                        className="btn-icon-delete"
                        onClick={() => deleteUser(u.id)}
                        title="Revoke Access"
                      >
                        <FiTrash2 />
                      </button>
                    )}
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

export default Users;
