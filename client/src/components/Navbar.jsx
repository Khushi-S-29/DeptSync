import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiCalendar,
  FiBox,
  FiLayers,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!user) {
    return null;
  }

  if (!user) return null;

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="glass-navbar">
      <div className="nav-brand">
        <div className="brand-orb"></div>
        <span className="brand-text">Campus Sync</span>
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className="nav-item">
          <FiGrid /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/timetable" className="nav-item">
          <FiCalendar /> <span>Timetable</span>
        </NavLink>

        {user.role === "SUPER_ADMIN" && (
          <div className="admin-group">
            <div className="divider"></div>
            <NavLink to="/rooms" className="nav-item">
              <FiBox /> <span>Rooms</span>
            </NavLink>
            <NavLink to="/departments" className="nav-item">
              <FiLayers /> <span>Depts</span>
            </NavLink>
            <NavLink to="/users" className="nav-item">
              <FiUsers /> <span>Users</span>
            </NavLink>
          </div>
        )}
      </div>

      <button onClick={logout} className="nav-logout-btn">
        <FiLogOut /> <span>Log out</span>
      </button>
    </nav>
  );
};

export default Navbar;
