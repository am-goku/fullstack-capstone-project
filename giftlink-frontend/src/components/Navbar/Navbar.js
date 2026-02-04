import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = sessionStorage.getItem('auth-token');
        const name = sessionStorage.getItem('name');
        if (authToken) {
            setIsLoggedIn(true);
            setUserName(name);
        }
    }, [setIsLoggedIn, setUserName]);

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        setUserName('');
        navigate('/app');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ padding: '10px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Link className="navbar-brand" to="/" style={{ fontWeight: 'bold', color: '#667eea' }}>GiftLink</Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <span className="nav-link" style={{ color: 'black', cursor: 'default' }}>
                                    Hello, {userName}
                                </span>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={handleLogout} style={{ cursor: 'pointer', color: '#dc3545', fontWeight: '500' }}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/login" style={{ color: '#667eea', fontWeight: '500' }}>Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link btn btn-primary" to="/app/register" style={{ color: 'white', padding: '8px 20px', borderRadius: '20px', marginLeft: '10px', background: '#667eea', border: 'none' }}>Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
