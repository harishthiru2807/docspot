import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Video, QrCode, HeartPulse, Calendar, FileText, Bell } from 'lucide-react';

const mockAppointments = [
    { id: 1, doctor: 'Dr. Rajesh Kumar', specialty: 'General Physician', date: 'Today, 3:00 PM', status: 'upcoming', icon: '🩺' },
    { id: 2, doctor: 'Dr. Meena Krishnan', specialty: 'Cardiologist', date: 'Feb 24, 10:00 AM', status: 'scheduled', icon: '❤️' },
    { id: 3, doctor: 'Dr. Suresh Babu', specialty: 'Dermatologist', date: 'Feb 20, 2:00 PM', status: 'completed', icon: '🔬' },
];

const vitals = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: '💗', status: 'normal', color: '#10b981' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', icon: '❤️', status: 'normal', color: '#0ea5e9' },
    { label: 'Temperature', value: '98.6', unit: '°F', icon: '🌡️', status: 'normal', color: '#f59e0b' },
    { label: 'SpO2', value: '98', unit: '%', icon: '🫁', status: 'normal', color: '#6366f1' },
];

export default function PatientDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 className="page-title">Good Morning, {user?.name?.split(' ')[0]}! 👋</h1>
                        <p className="page-subtitle">Patient ID: <strong style={{ color: 'var(--primary-light)' }}>{user?.patientId}</strong> • Here's your health overview</p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/patient/symptoms')}>
                        <HeartPulse size={16} /> Check Symptoms
                    </button>
                </div>

                {/* Vitals */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 28 }}>
                    {vitals.map(v => (
                        <div key={v.label} className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>{v.icon}</div>
                            <div style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, color: v.color }}>{v.value}<span style={{ fontSize: 14 }}>{v.unit}</span></div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{v.label}</div>
                            <span className="badge badge-green" style={{ marginTop: 6, fontSize: 10 }}>● {v.status}</span>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 28 }}>
                    {[
                        { icon: '🤖', title: 'AI Symptom Check', desc: 'Chat with AI doctor in Tamil', path: '/patient/symptoms', color: '#0ea5e9' },
                        { icon: '👨‍⚕️', title: 'AI Video Doctor', desc: 'Speak with Dr. ARIA by voice', path: '/patient/ai-doctor', color: '#6366f1', badge: 'NEW' },
                        { icon: '📹', title: 'Video Consult', desc: 'Talk to a real doctor now', path: '/patient/video', color: '#10b981' },
                        { icon: '📱', title: 'My QR Record', desc: 'View & share health record', path: '/patient/qr', color: '#f59e0b' },
                    ].map(a => (
                        <div key={a.title} className="card" style={{ cursor: 'pointer', borderColor: `${a.color}30`, position: 'relative' }} onClick={() => navigate(a.path)}>
                            {a.badge && <span style={{ position: 'absolute', top: 10, right: 12, fontSize: 9, fontWeight: 800, background: `${a.color}20`, border: `1px solid ${a.color}50`, color: a.color, borderRadius: 20, padding: '2px 7px', letterSpacing: '0.05em' }}>{a.badge}</span>}
                            <div style={{ fontSize: 32, marginBottom: 10 }}>{a.icon}</div>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: a.color, marginBottom: 4 }}>{a.title}</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{a.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Appointments */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700 }}>📅 Appointments</h2>
                        <span className="badge badge-blue">{mockAppointments.filter(a => a.status !== 'completed').length} upcoming</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {mockAppointments.map(apt => (
                            <div key={apt.id} style={{
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '14px', borderRadius: 12,
                                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                            }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{apt.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 15 }}>{apt.doctor}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{apt.specialty} • {apt.date}</div>
                                </div>
                                <span className={`badge ${apt.status === 'upcoming' ? 'badge-blue' : apt.status === 'scheduled' ? 'badge-yellow' : 'badge-green'}`}>
                                    {apt.status}
                                </span>
                                {apt.status === 'upcoming' && (
                                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/patient/video')}>
                                        <Video size={14} /> Join
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
