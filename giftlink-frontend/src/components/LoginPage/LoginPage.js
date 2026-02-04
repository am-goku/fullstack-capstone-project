import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
    // State variables for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle login
    const handleLogin = () => {
        console.log('Login button clicked');
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to your account</p>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button className="btn btn-primary login-btn" onClick={handleLogin}>
                    Login
                </button>

                <p className="register-link">
                    Don't have an account? <a href="/app/register">Register here</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
