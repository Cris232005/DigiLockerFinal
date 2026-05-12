import React, { useState } from 'react';
import { userAPI } from '../api';
import '../styles/LoginRegister.css';

const LoginRegister = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', username: '', email: '', passwordHash: '', confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.login(loginForm);
      if (response.data.success) {
        onLogin(response.data);
      } else {
        alert(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      if (!error.response) {
        alert('Cannot connect to server. Make sure you are on the same WiFi as the host PC.');
      } else {
        alert('Login failed: ' + (error.response?.data?.message || error.response.status));
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.passwordHash !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await userAPI.register({
        name: registerForm.name,
        username: registerForm.username,
        email: registerForm.email,
        passwordHash: registerForm.passwordHash
      });
      console.log('Registration response:', response);
      alert('Registration successful! Please login.');
      setIsLogin(true);
      setRegisterForm({ name: '', username: '', email: '', passwordHash: '', confirmPassword: '' });
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon">🔐</div>
          <h1>Digital Locker</h1>
          <p>Secure Document Management System</p>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Username or Email"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required
              />
              <i className="icon-user"></i>
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
              <i className="icon-lock"></i>
            </div>
            <button type="submit" className="auth-btn">
              <span>Login</span>
            </button>
            <div className="auth-footer">
              <p>New to Digital Locker? <span onClick={() => setIsLogin(false)} className="link-text">Create an account</span></p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
              <input
                placeholder="Full Name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                required
              />
              <i className="icon-user"></i>
            </div>
            <div className="input-group">
              <input
                placeholder="Username"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                required
              />
              <i className="icon-at"></i>
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                required
              />
              <i className="icon-mail"></i>
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={registerForm.passwordHash}
                onChange={(e) => setRegisterForm({...registerForm, passwordHash: e.target.value})}
                required
              />
              <i className="icon-lock"></i>
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                required
              />
              <i className="icon-check"></i>
            </div>
            <button type="submit" className="auth-btn">
              <span>Create Account</span>
            </button>
            <div className="auth-footer">
              <p>Already have an account? <span onClick={() => setIsLogin(true)} className="link-text">Sign in</span></p>
            </div>
          </form>
        )}
      </div>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
};

export default LoginRegister;