import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PenSquare, Home } from 'lucide-react';

const Navbar = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{ padding: '30px 0', borderBottom: '1px solid var(--border)', marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.03em', fontFamily: 'Playfair Display, serif' }}>
                    Blog
                </Link>
                
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <Link to="/" style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Home</Link>
                    {token ? (
                        <>
                            <Link to="/create" className="btn btn-primary" style={{ padding: '8px 20px' }}><PenSquare size={16} /> Write</Link>
                            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px' }}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
