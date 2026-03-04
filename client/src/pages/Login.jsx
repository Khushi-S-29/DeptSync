import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="pink-blur-orb orb-top"></div>
      <div className="pink-blur-orb orb-bottom"></div>

      <div className="login-card">
        <div
          className={`character-side ${showPassword ? "hiding" : "watching"}`}
        >
          <div className="character-emoji">{showPassword ? "🙈" : "🧐"}</div>
          <div className="character-bubble">
            {showPassword ? "I'm not looking!" : "Logging in?"}
          </div>
        </div>

        <h2 className="login-title">Campus Sync</h2>
        <p className="login-subtitle"></p>

        <div className="login-form">
          <div className="input-wrapper">
            <FiUser className="input-icon" />
            <input
              className="sleek-input"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              className="sleek-input"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button onClick={handleLogin} className="btn-login-main">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
