import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import '../styles/globals.css';
import { useNavigate } from 'react-router-dom';

export const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [storage_used, setStorage] = useState(0);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const user = {
      name,
      email,
      role,
      storage_used,
      password
    };

    // ✅ Use HTTP for local/Examly dev backend
    axios.post("http://localhost:8080/user/add", user, {
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        console.log("User Created Successfully", response.data);
        alert("User Created Successfully! You can now login.");
        navigate('/login');
      })
      .catch((err) => {
        console.error("Error Creating User:", err);
        alert("Error Creating User! Check backend or CORS settings.");
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
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">Role</label>
                <input
                  id="role"
                  className="form-input"
                  onChange={(e) => setRole(e.target.value)}
                  type="text"
                  placeholder="Enter your role (e.g., User, Admin)"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="storage">Storage Limit (GB)</label>
                <input
                  id="storage"
                  className="form-input"
                  onChange={(e) => setStorage(Number(e.target.value))}
                  type="number"
                  placeholder="Enter storage limit"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  className="form-input"
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
