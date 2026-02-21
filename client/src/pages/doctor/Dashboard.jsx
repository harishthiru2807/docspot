import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Video, FileText, Bell, Activity, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [aptRes, patientRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/patients')
            ]);
            setAppointments(aptRes.data);
            setPatients(patientRes.data);
        } catch (error) {
            console.error('Error fetching doctor dashboard data:', error);
            toast.error('Failed to sync clinical schedule.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    // Calculate stats based on real data
    const scheduledToday = appointments.filter(a => {
        const d = new Date(a.date);
        const today = new Date();
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
    });

    const stats = [
        { val: patients.length, label: 'Registered Patients', icon: '🫂', color: 'var(--primary)', trend: 'Active database' },
        { val: scheduledToday.length, label: 'Consults Today', icon: '📹', color: 'var(--color-doctor)', trend: `${appointments.length} total scheduled` },
        { val: appointments.filter(a => a.status === 'pending').length, label: 'Pending Reviews', icon: '📋', color: 'var(--accent)', trend: 'Awaiting verification' },
        { val: '98%', label: 'Clinical Rating', icon: '⭐', color: 'var(--accent-warm)', trend: 'High trust index' },
    ];

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ background: 'var(--bg-base)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 className="page-title">Welcome, Dr. {user?.name?.split(' ').pop()} 🩺</h1>
                        <p className="page-subtitle" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            {user?.specialty || 'General Physician'} • {loading ? 'Syncing clinical data...' : 'Live Dashboard Overlook'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-ghost btn-sm" onClick={fetchData} disabled={loading}>
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate('/doctor/video')} style={{ boxShadow: 'var(--shadow-md)' }}>
                            <Video size={18} /> Start Video Consult
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid" style={{ marginBottom: 32 }}>
                    {stats.map(s => (
                        <div key={s.label} className="card" style={{ background: 'var(--bg-surface)' }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12, background: `${s.color}08`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16,
                                border: `1px solid ${s.color}15`
                            }}>{s.icon}</div>
                            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{s.val}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{s.trend}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
                    {/* Patient Queue */}
                    <div className="card" style={{ background: 'var(--bg-surface)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div>
                                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>Live Patient Queue</h2>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                    {patients.length === 0 ? 'No patients registered yet' : `Displaying ${patients.length} active patients`}
                                </p>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/doctor/patients')}>Manage Database</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {patients.length === 0 && !loading && (
                                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-base)', borderRadius: 14, border: '1px dashed var(--border)' }}>
                                    <Users size={40} color="var(--text-muted)" style={{ marginBottom: 12, opacity: 0.5 }} />
                                    <div style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 600 }}>No patients found</div>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Patients will appear here once they register.</p>
                                </div>
                            )}
                            {patients.map(p => (
                                <div key={p.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px', borderRadius: 14,
                                    background: 'var(--bg-base)', border: '1px solid var(--border)', transition: 'all 0.2s', cursor: 'pointer'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-light)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                >
                                    <div style={{
                                        width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white'
                                    }}>{p.name?.[0]?.toUpperCase() || 'P'}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{p.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{p.patientId} • {p.email}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="btn btn-primary" style={{ width: 32, height: 32, padding: 0, borderRadius: 8 }} onClick={(e) => { e.stopPropagation(); navigate('/doctor/video'); }}><Video size={14} /></button>
                                        <button className="btn btn-ghost" style={{ width: 32, height: 32, padding: 0, borderRadius: 8, border: '1px solid var(--border)' }} onClick={(e) => { e.stopPropagation(); navigate('/doctor/prescription'); }}><FileText size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Schedule */}
                        <div className="card" style={{ background: 'var(--bg-surface)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                                <Clock size={18} color="var(--primary)" />
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>Consultation Schedule</h3>
                            </div>
                            {appointments.length === 0 && !loading && (
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No consultations scheduled</p>
                            )}
                            {appointments.map((apt, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                    <div style={{ width: 70, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', paddingTop: 5, flexShrink: 0 }}>
                                        {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'var(--bg-base)', border: '1px solid var(--border)', borderLeft: '4px solid var(--primary)' }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{apt.patientName || 'Inbound Consult'}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{apt.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="card" style={{ background: 'var(--bg-surface)' }}>
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginBottom: 16 }}>Clinical Shortcuts</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { label: 'Video Consultation', icon: <Video size={16} />, path: '/doctor/video', color: 'var(--color-doctor)' },
                                    { label: 'Prescription Portal', icon: <FileText size={16} />, path: '/doctor/prescription', color: 'var(--accent)' },
                                    { label: 'Patient Database', icon: <Users size={16} />, path: '/doctor/patients', color: 'var(--primary)' },
                                ].map(a => (
                                    <button key={a.label} className="btn btn-ghost" style={{
                                        justifyContent: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: 12,
                                        background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)',
                                        fontSize: 13, fontWeight: 600
                                    }} onClick={() => navigate(a.path)}>
                                        <span style={{ color: a.color }}>{a.icon}</span> {a.label}
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
