import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import '../styles/globals.css';
import { useNavigate } from 'react-router-dom';

export const SignUpPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const user = {
      name,
      username,
      email,
      role,
      storageUsed: 0,
      passwordHash: password
    };

    // ✅ Use HTTP for local/Examly dev backend
    axios.post("http://10.201.132.2:8080/user/add", user, {
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        console.log("User Created Successfully", response.data);
        alert("User Created Successfully! You can now login.");
        navigate('/login');
      })
      .catch((err) => {
        console.error("Error Creating User:", err);
        if (!err.response) {
          alert("Registration failed: Cannot connect to server. Make sure the Spring Boot backend is running on port 8080.");
        } else {
          alert("Registration failed: " + (err.response.data?.message || err.response.status));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='auth-container'>
      <div className="auth-wrapper">
        <div className="auth-card">
          <header className="auth-header">
            <div className="auth-logo">
              <h1 className="auth-title">Digital Locker</h1>
              <p className="auth-subtitle">Secure Document Storage</p>
            </div>
          </header>

          <main className="auth-main">
            <div className="auth-form-header">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Join us and secure your documents today</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Create a secure password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p className="auth-footer-text">
  Already have an account?
  <button
    className="auth-link"
    onClick={() => navigate('/login', { state: { email } })}
  >
    Sign in
  </button>
</p>

            </div>
          </main>
        </div>

        <div className="auth-background">
          <div className="background-pattern"></div>
        </div>
      </div>
    </div>
  );
};
