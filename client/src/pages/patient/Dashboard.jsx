import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Video, QrCode, HeartPulse, Calendar, FileText, Bell, RefreshCw, AlertTriangle, Pill } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function PatientDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [vitals, setVitals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [aptRes, vitalsRes] = await Promise.all([
                api.get('/appointments'),
                api.get(`/vitals/${user?.patientId}`)
            ]);
            setAppointments(aptRes.data);
            setVitals(vitalsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to sync health data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    // Format vitals for display
    const latestVitals = vitals.length > 0 ? vitals[vitals.length - 1] : null;

    const vitalsConfig = [
        { label: 'Blood Pressure', value: latestVitals?.bp || '--/--', unit: 'mmHg', icon: '💗', status: 'normal', color: 'var(--primary)' },
        { label: 'Heart Rate', value: latestVitals?.pulse || '--', unit: 'bpm', icon: '❤️', status: 'normal', color: 'var(--secondary)' },
        { label: 'Temperature', value: latestVitals?.temp || '--', unit: '°F', icon: '🌡️', status: 'normal', color: 'var(--accent-warm)' },
        { label: 'SpO2', value: latestVitals?.spo2 || '--', unit: '%', icon: '🫁', status: 'normal', color: 'var(--accent)' },
    ];

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ background: 'var(--bg-base)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                        <p className="page-subtitle" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            Patient ID: <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{user?.patientId}</span> •
                            {loading ? ' Syncing health reports...' : ' Your health report is up to date'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-ghost btn-sm" onClick={fetchData} disabled={loading} title="Sync data">
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate('/patient/symptoms')} style={{ boxShadow: 'var(--shadow-md)' }}>
                            <HeartPulse size={18} /> Symptom Check
                        </button>
                    </div>
                </div>

                {/* Vitals */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
                    {vitalsConfig.map(v => (
                        <div key={v.label} className="card" style={{ textAlign: 'center', background: 'var(--bg-surface)' }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icon}</div>
                            <div style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: v.color }}>
                                {v.value}
                                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', marginLeft: 2 }}>{v.unit}</span>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{v.label}</div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                                <span className="badge badge-green" style={{ fontSize: 10, background: 'rgba(16,185,129,0.05)', color: 'var(--accent)', border: '1px solid rgba(16,185,129,0.1)' }}>
                                    ● {v.value === '--' || v.value === '--/--' ? 'no data' : 'normal'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
                    {[
                        { icon: '🤖', title: 'AI Symptom Check', desc: 'Interactive chat & diagnosis', path: '/patient/symptoms', color: 'var(--primary)', badge: 'FREE' },
                        { icon: '👩‍⚕️', title: 'AI Video Doctor', desc: 'Vocal consultation with ARIA', path: '/patient/ai-doctor', color: 'var(--color-doctor)', badge: 'LIVE' },
                        { icon: '📹', title: 'Video Consult', desc: 'Secure call with specialists', path: '/patient/video', color: 'var(--secondary)' },
                        { icon: '🏥', title: 'My Health QR', desc: 'Scan & share medical history', path: '/patient/qr', color: 'var(--accent-warm)' },
                    ].map(a => (
                        <div key={a.title} className="card" style={{ cursor: 'pointer', background: 'var(--bg-surface)', transition: 'all 0.3s' }} onClick={() => navigate(a.path)}>
                            {a.badge && (
                                <span style={{
                                    position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800,
                                    background: `${a.color}10`, color: a.color, borderRadius: 20, padding: '2px 8px',
                                    border: `1px solid ${a.color}20`
                                }}>
                                    {a.badge}
                                </span>
                            )}
                            <div style={{
                                width: 56, height: 56, borderRadius: 16, background: `${a.color}08`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16,
                                border: `1px solid ${a.color}15`
                            }}>
                                {a.icon}
                            </div>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{a.title}</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Appointments */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
                    <div className="card" style={{ background: 'var(--bg-surface)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div>
                                <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Upcoming Consultations</h2>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                    {appointments.length === 0 ? 'No scheduled visits' : `You have ${appointments.length} scheduled visits`}
                                </p>
                            </div>
                            <button className="btn btn-ghost btn-sm" style={{ fontWeight: 700 }} onClick={fetchData}>Refresh</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {appointments.length === 0 && !loading && (
                                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-base)', borderRadius: 14, border: '1px dashed var(--border)' }}>
                                    <Calendar size={40} color="var(--text-muted)" style={{ marginBottom: 12, opacity: 0.5 }} />
                                    <div style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 600 }}>No upcoming appointments</div>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Booked consultations will appear here.</p>
                                </div>
                            )}
                            {appointments.map(apt => (
                                <div key={apt.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    padding: '16px', borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-base)', border: '1px solid var(--border)',
                                    transition: 'all 0.2s'
                                }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14,
                                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0
                                    }}>
                                        🩺
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{apt.doctorName || 'General Practitioner'}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                            <Calendar size={12} /> {new Date(apt.date).toLocaleString()} • {apt.specialty || 'General'}
                                        </div>
                                    </div>
                                    <span className={`badge ${apt.status === 'upcoming' || apt.status === 'scheduled' ? 'badge-blue' : 'badge-green'}`}
                                        style={{ padding: '6px 12px', fontSize: 10 }}>
                                        {apt.status}
                                    </span>
                                    {(apt.status === 'upcoming' || apt.status === 'scheduled') && (
                                        <button className="btn btn-primary btn-sm" style={{ height: 36, borderRadius: 10 }} onClick={() => navigate('/patient/video')}>
                                            Join Now
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
