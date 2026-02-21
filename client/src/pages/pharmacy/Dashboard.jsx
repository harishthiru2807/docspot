import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

const recentPrescriptions = [
    { patient: 'Arun Selvam', doctor: 'Dr. Rajesh Kumar', meds: 'Amlodipine 5mg, Metformin 500mg', time: '10:30 AM', status: 'pending' },
    { patient: 'Kavya Raj', doctor: 'Dr. Rajesh Kumar', meds: 'Metformin 500mg, Omeprazole 20mg', time: '11:00 AM', status: 'dispensed' },
    { patient: 'Priya Kumar', doctor: 'Dr. Meena', meds: 'Paracetamol 500mg, Cetirizine 10mg', time: '12:15 PM', status: 'pending' },
];

const lowStock = [
    { name: 'Amoxicillin 500mg', current: 12, threshold: 50, unit: 'strips' },
    { name: 'Paracetamol 500mg', current: 30, threshold: 100, unit: 'tabs' },
    { name: 'Insulin (Novolin)', current: 5, threshold: 20, unit: 'vials' },
];

export default function PharmacyDashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 className="page-title">💊 Pharmacy Dashboard</h1>
                        <p className="page-subtitle">MedPlus Pharmacy — Chennai Central Branch</p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/pharmacy/stock')}>
                        <Package size={16} /> Manage Stock
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                    {[
                        { val: '24', label: 'Prescriptions Today', icon: '📋', color: '#0ea5e9' },
                        { val: '3', label: 'Low Stock Alerts', icon: '⚠️', color: '#ef4444' },
                        { val: '847', label: 'Total Medicines', icon: '💊', color: '#10b981' },
                        { val: '₹12.4K', label: 'Today Revenue', icon: '💰', color: '#f59e0b' },
                    ].map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-icon" style={{ background: `${s.color}15`, fontSize: 24 }}>{s.icon}</div>
                            <div className="stat-value" style={{ color: s.color }}>{s.val}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
                    {/* Prescriptions Queue */}
                    <div className="card">
                        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>📋 Prescription Queue</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {recentPrescriptions.map((rx, i) => (
                                <div key={i} style={{ padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{rx.patient}</div>
                                        <span className={`badge ${rx.status === 'pending' ? 'badge-yellow' : 'badge-green'}`}>{rx.status}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>By {rx.doctor} • {rx.time}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-primary)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6 }}>{rx.meds}</div>
                                    {rx.status === 'pending' && (
                                        <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}><CheckCircle size={13} /> Mark Dispensed</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Low Stock Alerts */}
                        <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                <AlertTriangle size={18} color="#f87171" />
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f87171' }}>Low Stock Alerts</h3>
                            </div>
                            {lowStock.map(s => (
                                <div key={s.name} style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                                        <span style={{ color: '#f87171', fontWeight: 700 }}>{s.current}/{s.threshold} {s.unit}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-bar-fill" style={{ width: `${(s.current / s.threshold) * 100}%`, background: 'var(--danger)' }} />
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-danger btn-sm w-full" style={{ marginTop: 8 }} onClick={() => navigate('/pharmacy/stock')}>
                                📦 Reorder Now
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>📈 Today's Summary</h3>
                            {[
                                { label: 'Dispensed', val: '21 Rx', color: '#34d399' },
                                { label: 'Pending', val: '3 Rx', color: '#fbbf24' },
                                { label: 'Refills', val: '8', color: '#60a5fa' },
                                { label: 'Out of Stock', val: '3 items', color: '#f87171' },
                            ].map(s => (
                                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                                    <span style={{ fontWeight: 700, color: s.color }}>{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
