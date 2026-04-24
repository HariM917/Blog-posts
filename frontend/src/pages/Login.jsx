import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            setErr(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '80px auto' }} className="card">
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Welcome Back</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {err && <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>{err}</p>}
                <button type="submit" className="btn btn-primary"><LogIn size={20} /> Login</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
            </p>
        </div>
    );
};

export default Login;
