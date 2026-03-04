import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-bg">
      <div className="dashboard-content">
        <h1 className="title">Welcome</h1>

        <div className="role-container">
          <span className="role-tag">
            {user.role === "SUPER_ADMIN"
              ? "Super Admin"
              : `${user.department_name} Admin`}
          </span>
        </div>

        <p style={{ marginTop: "20px", color: "#64748b" }}>
          Campus Schedule Management System
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
