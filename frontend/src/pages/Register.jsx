import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/');
        } catch (error) {
            setErr(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '80px auto' }} className="card">
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Join the Community</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {err && <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>{err}</p>}
                <button type="submit" className="btn btn-primary"><UserPlus size={20} /> Register</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
            </p>
        </div>
    );
};

export default Register;
