import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Video, FileText, Bell, Activity, TrendingUp, Clock } from 'lucide-react';

const mockPatients = [
    { id: 'PT-001', name: 'Arun Selvam', age: 45, condition: 'Hypertension', priority: 'high', lastSeen: 'Today', avatar: 'AS' },
    { id: 'PT-002', name: 'Kavya Raj', age: 28, condition: 'Diabetes', priority: 'medium', lastSeen: 'Yesterday', avatar: 'KR' },
    { id: 'PT-003', name: 'Mohan Das', age: 62, condition: 'Cardiac', priority: 'high', lastSeen: '2 days ago', avatar: 'MD' },
    { id: 'PT-004', name: 'Priya Kumar', age: 34, condition: 'Fever', priority: 'low', lastSeen: 'Today', avatar: 'PK' },
];

export default function DoctorDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 className="page-title">Welcome, {user?.name} 🩺</h1>
                        <p className="page-subtitle">{user?.specialty || 'General Physician'} • Here's your daily overview</p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/doctor/video')}>
                        <Video size={16} /> Start Video Call
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                    {[
                        { val: '12', label: 'Patients Today', icon: '👥', color: '#0ea5e9', trend: '+2 from yesterday' },
                        { val: '3', label: 'Pending Video', icon: '📹', color: '#6366f1', trend: '2 available now' },
                        { val: '8', label: 'Prescriptions', icon: '📋', color: '#10b981', trend: 'Written today' },
                        { val: '98%', label: 'Patient Rating', icon: '⭐', color: '#f59e0b', trend: 'This month' },
                    ].map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-icon" style={{ background: `${s.color}15`, fontSize: 24 }}>{s.icon}</div>
                            <div className="stat-value" style={{ color: s.color }}>{s.val}</div>
                            <div className="stat-label">{s.label}</div>
                            <div className="stat-trend">{s.trend}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
                    {/* Patient Queue */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18 }}>👥 Today's Patient Queue</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/doctor/patients')}>View All →</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {mockPatients.map(p => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', transition: 'all 0.2s', cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                >
                                    <div className="avatar avatar-blue" style={{ width: 42, height: 42, fontSize: 15 }}>{p.avatar}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>• {p.age}y</span></div>
                                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.id} • {p.condition}</div>
                                    </div>
                                    <span className={`badge ${p.priority === 'high' ? 'badge-red' : p.priority === 'medium' ? 'badge-yellow' : 'badge-green'}`}>
                                        {p.priority}
                                    </span>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/doctor/video')}><Video size={13} /></button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/doctor/prescription')}><FileText size={13} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Schedule */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>📅 Today's Schedule</h3>
                            {[
                                { time: '9:00 AM', name: 'Arun Selvam', type: 'Video', color: '#6366f1' },
                                { time: '10:30 AM', name: 'Walk-in', type: 'In-person', color: '#10b981' },
                                { time: '2:00 PM', name: 'Kavya Raj', type: 'Video', color: '#6366f1' },
                                { time: '4:00 PM', name: 'Mohan Das', type: 'Video', color: '#6366f1' },
                            ].map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                    <div style={{ width: 70, fontSize: 12, color: 'var(--text-muted)', paddingTop: 4, flexShrink: 0 }}>{s.time}</div>
                                    <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: `${s.color}10`, borderLeft: `3px solid ${s.color}` }}>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>⚡ Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    { label: 'Start Video Room', icon: '📹', path: '/doctor/video', color: '#6366f1' },
                                    { label: 'Write Prescription', icon: '📋', path: '/doctor/prescription', color: '#10b981' },
                                    { label: 'View All Patients', icon: '👥', path: '/doctor/patients', color: '#0ea5e9' },
                                ].map(a => (
                                    <button key={a.label} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', gap: 8, color: a.color, border: `1px solid ${a.color}20` }} onClick={() => navigate(a.path)}>
                                        <span>{a.icon}</span> {a.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
