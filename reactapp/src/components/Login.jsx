import React, { useState } from 'react';
import '../styles/Auth.css';
import '../styles/globals.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toHome = () => {
        setLoading(true);
        axios.get(
            `http://8080-ffbaeebdacbaeabecfcdcbcbcbccaa.premiumproject.examly.io/user/get/email/${encodeURIComponent(email)}/${encodeURIComponent(password)}`
        )
        .then((response) => {
            if (response.data) {
                // ✅ Save user data to localStorage
                localStorage.setItem("userId", response.data.id);
                localStorage.setItem("userEmail", response.data.email);

                // ✅ Navigate to documents page
                navigate('/documents');
            } else {
                alert("Invalid credentials");
            }
        })
        .catch((err) => {
            console.log(err.message);
            alert("Login failed. Please try again.");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
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
                            <h2 className="form-title">Welcome Back</h2>
                            <p className="form-subtitle">Sign in to access your digital locker</p>
                        </div>

                        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email Address</label>
                                <input 
                                    id="email"
                                    className="form-input" 
                                    onChange={handleEmail} 
                                    type='email'
                                    value={email} 
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input 
                                    id="password"
                                    value={password}
                                    className="form-input" 
                                    onChange={handlePassword} 
                                    type='password' 
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <button 
                                onClick={toHome}
                                className="btn btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p className="auth-footer-text">
                                Don't have an account? 
                                <button 
                                    className="auth-link" 
                                    onClick={() => navigate('/sign')}
                                >
                                    Sign up
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
