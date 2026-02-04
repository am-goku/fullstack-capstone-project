import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    useEffect(() => {
        const authToken = sessionStorage.getItem('auth-token');
        if (authToken) {
            navigate('/app');
        }
    }, [navigate]);

    // State variables for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [error, setError] = useState(''); // Removed unused error state for now to match user request style or keep it simple? 
    // The user request "Send appropriate message if user not found" implies validation, but for frontend consumption we need to show it.
    // I will add error state back as it's good practice.
    const [error, setError] = useState('');

    // Handle login
    const handleLogin = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error) {
                    setError(data.error);
                } else {
                    setError("Login failed");
                }
                setPassword(''); // Clear password field on error
                return;
            }

            // Store auth token and user info in session storage
            sessionStorage.setItem('auth-token', data.authtoken);
            sessionStorage.setItem('name', data.userName);
            sessionStorage.setItem('email', data.email);

            // Update the global state
            setIsLoggedIn(true);

            // Navigate to the main app page
            navigate('/app');

        } catch (err) {
            console.error(err);
            setError("An error occurred during login");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to your account</p>

                {error && <p className="text-danger text-center">{error}</p>}

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
