import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  FiGrid,
  FiCalendar,
  FiBox,
  FiLayers,
  FiClock,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const [requestCount, setRequestCount] = useState(0);
  const navigate = useNavigate();

  const isSuper = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (isSuper && user) {
      const fetchCount = async () => {
        try {
          const res = await api.get("/timetable/requests/pending");
          setRequestCount(res.data.length);
        } catch (err) {
          console.error("Badge Fetch Error:", err);
        }
      };

      fetchCount();
      const interval = setInterval(fetchCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isSuper, user]);

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
          <div className="icon-wrapper">
            <FiGrid />
            {isSuper && requestCount > 0 && (
              <span className="nav-badge">{requestCount}</span>
            )}
          </div>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/timetable" className="nav-item">
          <FiCalendar /> <span>Timetable</span>
        </NavLink>

        {isSuper && (
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
            <NavLink to="/requests" className="nav-item">
              <div className="icon-wrapper">
                <FiClock />
                {requestCount > 0 && (
                  <span className="nav-badge">{requestCount}</span>
                )}
              </div>
              <span>Requests</span>
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
