import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock demo users for offline-first demo
const DEMO_USERS = [
    { id: 1, name: 'Dr. Rajesh Kumar', email: 'doctor@docspot.com', password: 'demo123', role: 'doctor', avatar: 'RK', specialty: 'General Physician' },
    { id: 2, name: 'Nurse Priya Devi', email: 'nurse@docspot.com', password: 'demo123', role: 'nurse', avatar: 'PD', ward: 'ICU Ward A' },
    { id: 3, name: 'MedPlus Pharmacy', email: 'pharmacy@docspot.com', password: 'demo123', role: 'pharmacy', avatar: 'MP', location: 'Chennai Central' },
    { id: 4, name: 'Arun Selvam', email: 'patient@docspot.com', password: 'demo123', role: 'patient', avatar: 'AS', patientId: 'PT-2024-0042' },
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('docspot_user');
        if (saved) setUser(JSON.parse(saved));
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const found = DEMO_USERS.find(u => u.email === email && u.password === password);
        if (found) {
            const { password: _, ...safeUser } = found;
            setUser(safeUser);
            localStorage.setItem('docspot_user', JSON.stringify(safeUser));
            return { success: true, user: safeUser };
        }
        return { success: false, error: 'Invalid credentials' };
    };

    const register = (userData) => {
        const newUser = {
            id: Date.now(),
            ...userData,
            patientId: `PT-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            avatar: userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        };
        setUser(newUser);
        localStorage.setItem('docspot_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('docspot_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, DEMO_USERS }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
