import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

import API_BASE_URL from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Optional: Fetch user profile to verify token
            setLoading(false);
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
