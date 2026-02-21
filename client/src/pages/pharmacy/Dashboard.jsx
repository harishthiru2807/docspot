import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, TrendingUp, CheckCircle, Clock, Pill, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function PharmacyDashboard() {
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rxRes, stockRes] = await Promise.all([
                api.get('/prescriptions'),
                api.get('/pharmacy/stock')
            ]);
            setPrescriptions(rxRes.data);
            setMedications(stockRes.data);
        } catch (error) {
            console.error('Error fetching pharmacy data:', error);
            toast.error('Failed to sync pharmacy records.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const lowStockItems = medications.filter(m => m.stock < m.threshold);
    const pendingPrescriptions = prescriptions.filter(rx => rx.status === 'pending');

    const stats = [
        { val: prescriptions.length, label: 'E-Prescriptions Today', icon: '📋', color: 'var(--primary)', trend: `${pendingPrescriptions.length} in queue` },
        { val: lowStockItems.length, label: 'Low Stock Alerts', icon: '⚠️', color: 'var(--danger)', trend: 'Immediate action' },
        { val: medications.length, label: 'SKUs Tracked', icon: '📦', color: 'var(--accent)', trend: 'Inventory verified' },
        { val: '₹12.4K', label: 'Daily Dispense', icon: '💰', color: 'var(--accent-warm)', trend: 'Revenue goal reached' },
    ];

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ background: 'var(--bg-base)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 className="page-title">💊 Pharmacy Oversight</h1>
                        <p className="page-subtitle" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            Chennai Central Branch • {loading ? 'Syncing stock records...' : 'Automated Inventory Active'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-ghost btn-sm" onClick={fetchData} disabled={loading}>
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate('/pharmacy/stock')} style={{ boxShadow: 'var(--shadow-md)' }}>
                            <Pill size={18} /> Manage Stock
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
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>{s.trend}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
                    {/* Prescriptions Queue */}
                    <div className="card" style={{ background: 'var(--bg-surface)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div>
                                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>Prescription Fulfillment Queue</h2>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sorted by priority and arrival</p>
                            </div>
                            <button className="btn btn-ghost btn-sm">Full Screen</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {prescriptions.length === 0 && !loading && (
                                <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-base)', borderRadius: 20, border: '1px dashed var(--border)' }}>
                                    <Clock size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.5 }} />
                                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Queue Empty</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>All current prescriptions have been dispensed.</p>
                                </div>
                            )}
                            {prescriptions.map((rx, i) => (
                                <div key={i} style={{
                                    padding: 16, borderRadius: 14, background: 'var(--bg-base)', border: '1px solid var(--border)',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-light)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{rx.patientName || 'Anonymous Patient'}</div>
                                        <span className={`badge ${rx.status === 'pending' ? 'badge-yellow' : 'badge-green'}`} style={{ fontSize: 9 }}>
                                            {rx.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                        <Clock size={12} /> {new Date(rx.createdAt).toLocaleTimeString()} • Rx by {rx.doctorName || 'Medical System'}
                                    </div>
                                    <div style={{
                                        fontSize: 13, color: 'var(--text-primary)', background: 'var(--bg-surface)',
                                        padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', lineHeight: 1.5, fontWeight: 500
                                    }}>
                                        {Array.isArray(rx.meds) ? rx.meds.join(', ') : rx.meds || 'Medicine list unavailable'}
                                    </div>
                                    {rx.status === 'pending' && (
                                        <button className="btn btn-primary btn-sm w-full" style={{ marginTop: 12, borderRadius: 10 }}>
                                            <CheckCircle size={14} /> Complete & Dispense
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Low Stock Alerts */}
                        <div className="card" style={{ background: 'var(--bg-surface)', borderTop: '4px solid var(--danger)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                                <AlertTriangle size={18} color="var(--danger)" />
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-primary)', fontSize: 16 }}>Stock Replenishment</h3>
                            </div>
                            {lowStockItems.length === 0 && !loading && (
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>All items are in stock.</p>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {lowStockItems.map(s => (
                                    <div key={s.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</span>
                                            <span style={{ color: 'var(--danger)', fontWeight: 800 }}>{s.stock}/{s.threshold} {s.unit}</span>
                                        </div>
                                        <div style={{ width: '100%', height: 6, background: 'var(--bg-base)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ width: `${(s.stock / s.threshold) * 100}%`, height: '100%', background: 'var(--danger)', borderRadius: 3 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {lowStockItems.length > 0 && (
                                <button className="btn btn-danger w-full" style={{ marginTop: 20, borderRadius: 12, fontWeight: 700 }} onClick={() => navigate('/pharmacy/stock')}>
                                    <Package size={16} /> Order Supplies
                                </button>
                            )}
                        </div>

                        {/* Quick Insights */}
                        <div className="card" style={{ background: 'var(--bg-surface)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                                <TrendingUp size={18} color="var(--primary)" />
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>Fulfillment Insights</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {[
                                    { label: 'Total Dispensed', val: prescriptions.filter(r => r.status === 'dispensed').length, color: 'var(--accent)' },
                                    { label: 'Pending Queue', val: pendingPrescriptions.length, color: 'var(--accent-warm)' },
                                    { label: 'Stock Coverage', val: `${Math.round(((medications.length - lowStockItems.length) / (medications.length || 1)) * 100)}%`, color: 'var(--primary)' },
                                    { label: 'Low Stock SKU', val: lowStockItems.length, color: 'var(--danger)' },
                                ].map((iv, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                                        borderBottom: idx === 3 ? 'none' : '1px solid var(--border)', fontSize: 13
                                    }}>
                                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{iv.label}</span>
                                        <span style={{ fontWeight: 800, color: iv.color }}>{iv.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
