import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Clock, Users, Activity, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const patients = [
    { id: 'PT-001', name: 'Arun Selvam', ward: 'ICU A', bed: 'B-04', bp: '140/90', temp: '99.1', pulse: '88', status: 'critical', avatar: 'AS' },
    { id: 'PT-002', name: 'Kavya Raj', ward: 'General', bed: 'G-12', bp: '118/76', temp: '98.6', pulse: '72', status: 'stable', avatar: 'KR' },
    { id: 'PT-003', name: 'Mohan Das', ward: 'ICU A', bed: 'B-07', bp: '160/95', temp: '100.2', pulse: '95', status: 'monitor', avatar: 'MD' },
    { id: 'PT-004', name: 'Priya Kumar', ward: 'General', bed: 'G-08', bp: '120/80', temp: '101.0', pulse: '80', status: 'monitor', avatar: 'PK' },
];

export default function NurseDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 className="page-title">Welcome, {user?.name} 💉</h1>
                        <p className="page-subtitle">{user?.ward || 'ICU Ward A'} • Shift: 08:00 AM – 08:00 PM</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <span className="badge badge-green" style={{ padding: '8px 16px', fontSize: 13 }}>● On Shift</span>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/nurse/vitals')}><Activity size={16} /> Record Vitals</button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                    {[
                        { val: '8', label: 'Assigned Patients', icon: '👥', color: '#10b981' },
                        { val: '2', label: 'Critical Alerts', icon: '🚨', color: '#ef4444' },
                        { val: '6', label: 'Vitals Due', icon: '🩺', color: '#f59e0b' },
                        { val: '12h', label: 'Shift Duration', icon: '⏰', color: '#6366f1' },
                    ].map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-icon" style={{ background: `${s.color}15`, fontSize: 24 }}>{s.icon}</div>
                            <div className="stat-value" style={{ color: s.color }}>{s.val}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Patient Cards */}
                <div>
                    <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, marginBottom: 14 }}>🛏 Ward Patients</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
                        {patients.map(p => (
                            <div key={p.id} className="card" style={{
                                borderColor: p.status === 'critical' ? 'rgba(239,68,68,0.4)' : p.status === 'monitor' ? 'rgba(245,158,11,0.3)' : 'var(--border)',
                                background: p.status === 'critical' ? 'rgba(239,68,68,0.04)' : p.status === 'monitor' ? 'rgba(245,158,11,0.03)' : 'var(--bg-card)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        <div className="avatar avatar-green" style={{ width: 38, height: 38, fontSize: 13 }}>{p.avatar}</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.ward} • Bed {p.bed}</div>
                                        </div>
                                    </div>
                                    <span className={`badge ${p.status === 'critical' ? 'badge-red' : p.status === 'monitor' ? 'badge-yellow' : 'badge-green'}`}>{p.status}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                    {[
                                        { label: 'BP', value: p.bp, icon: '💗' },
                                        { label: 'Temp', value: p.temp + '°F', icon: '🌡️' },
                                        { label: 'Pulse', value: p.pulse, icon: '❤️' },
                                    ].map(v => (
                                        <div key={v.label} style={{ textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                                            <div style={{ fontSize: 16 }}>{v.icon}</div>
                                            <div style={{ fontWeight: 700, fontSize: 13 }}>{v.value}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-outline btn-sm w-full" style={{ marginTop: 12 }} onClick={() => navigate('/nurse/vitals')}>
                                    📊 Update Vitals
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
