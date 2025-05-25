import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import styles from "../styles/Login.module.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login(username); // Replace with real auth logic
    navigate("/");
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <img src={logo} alt="Logo" className={styles.logo} />

        <h2 className={styles.title}>Welcome Back</h2>

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <div className={styles.divider}>or login with</div>

        <div className={styles.socialLogin}>
          <button className={`${styles.socialButton} ${styles.google}`}>
            Google
          </button>
          <button className={`${styles.socialButton} ${styles.facebook}`}>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
