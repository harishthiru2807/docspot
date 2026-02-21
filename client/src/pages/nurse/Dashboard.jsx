import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Clock, Users, Activity, Bell, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function NurseDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [vitalsMap, setVitalsMap] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const patientRes = await api.get('/patients');
            const patientList = patientRes.data;
            setPatients(patientList);

            // Fetch latest vitals for each patient
            const vitalsPromises = patientList.map(p => api.get(`/vitals/${p.patientId}`));
            const vitalsResponses = await Promise.all(vitalsPromises);

            const newVitalsMap = {};
            vitalsResponses.forEach((res, index) => {
                const patientId = patientList[index].patientId;
                const patientVitals = res.data;
                if (patientVitals.length > 0) {
                    newVitalsMap[patientId] = patientVitals[patientVitals.length - 1]; // latest
                }
            });
            setVitalsMap(newVitalsMap);
        } catch (error) {
            console.error('Error fetching nurse dashboard data:', error);
            toast.error('Failed to sync ward data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const stats = [
        { val: patients.length, label: 'Ward Patients', icon: '🫂', color: 'var(--color-nurse)' },
        { val: Object.values(vitalsMap).filter(v => v.temp > 100 || v.pulse > 100).length, label: 'Critical Alerts', icon: '🚨', color: 'var(--danger)' },
        { val: patients.length - Object.keys(vitalsMap).length, label: 'Vitals Due', icon: '🩺', color: 'var(--accent-warm)' },
        { val: '12h', label: 'Shift Duration', icon: '⏰', color: 'var(--primary)' },
    ];

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ background: 'var(--bg-base)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 className="page-title">Welcome, Nurse {user?.name?.split(' ').pop()} 💉</h1>
                        <p className="page-subtitle" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            {user?.ward || 'ICU Ward A'} • {loading ? 'Syncing ward records...' : 'Clinical Duty Active'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-ghost btn-sm" onClick={fetchData} disabled={loading}>
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate('/nurse/vitals')} style={{ boxShadow: 'var(--shadow-md)' }}>
                            <Activity size={18} /> Record Vitals
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid" style={{ marginBottom: 32 }}>
                    {stats.map(s => (
                        <div key={s.label} className="card" style={{ background: 'var(--bg-surface)' }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12, background: `${s.color}08`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16,
                                border: `1px solid ${s.color}15`
                            }}>{s.icon}</div>
                            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{s.val}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Patient Cards */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                        <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>🛏 Ward Oversight</h2>
                        <button className="btn btn-ghost btn-sm" style={{ fontWeight: 700 }}>Filter: All Beds</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16 }}>
                        {patients.length === 0 && !loading && (
                            <div style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: 20, border: '1px dashed var(--border)' }}>
                                <Users size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.5 }} />
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>No Patients Assigned</h3>
                                <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>The current ward roster is empty.</p>
                            </div>
                        )}
                        {patients.map(p => {
                            const v = vitalsMap[p.patientId] || {};
                            const isCritical = v.temp > 101 || v.pulse > 105;
                            const isMonitor = v.temp > 99 || v.pulse > 90;

                            return (
                                <div key={p.id} className="card" style={{
                                    background: 'var(--bg-surface)',
                                    borderTop: `4px solid ${isCritical ? 'var(--danger)' : isMonitor ? 'var(--accent-warm)' : 'var(--accent)'}`,
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <div style={{
                                                width: 42, height: 42, borderRadius: '50%', background: 'var(--primary-light)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 14, fontWeight: 700, color: 'white'
                                            }}>{p.name?.[0].toUpperCase()}</div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{p.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Bed {p.bed || 'TBD'} • {p.patientId}</div>
                                            </div>
                                        </div>
                                        <span className={`badge ${isCritical ? 'badge-red' : isMonitor ? 'badge-yellow' : 'badge-green'}`} style={{ fontSize: 10 }}>
                                            {isCritical ? 'Critical' : isMonitor ? 'Monitor' : 'Stable'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                                        {[
                                            { label: 'BP', value: v.bp || '--/--', icon: '💗', color: 'var(--primary)' },
                                            { label: 'Temp', value: (v.temp || '--') + '°F', icon: '🌡️', color: 'var(--accent-warm)' },
                                            { label: 'Pulse', value: v.pulse || '--', icon: '❤️', color: 'var(--danger)' },
                                        ].map(stat => (
                                            <div key={stat.label} style={{ textAlign: 'center', padding: '10px 4px', background: 'var(--bg-base)', borderRadius: 12, border: '1px solid var(--border)' }}>
                                                <div style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</div>
                                                <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>{stat.value}</div>
                                                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="btn btn-outline btn-sm w-full" style={{ borderRadius: 12, border: '1.5px solid var(--primary)', color: 'var(--primary)', fontWeight: 700 }} onClick={() => navigate('/nurse/vitals', { state: { patientId: p.patientId } })}>
                                        Update Clinical Records
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
