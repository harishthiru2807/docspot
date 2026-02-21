import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Package, Plus, Search, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const initialMeds = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', stock: 30, threshold: 100, unit: 'tablets', price: 2.5, expiry: '2025-06' },
    { id: 2, name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 12, threshold: 50, unit: 'capsules', price: 8.0, expiry: '2025-03' },
    { id: 3, name: 'Metformin 500mg', category: 'Antidiabetic', stock: 200, threshold: 80, unit: 'tablets', price: 3.5, expiry: '2025-12' },
    { id: 4, name: 'Amlodipine 5mg', category: 'Antihypertensive', stock: 150, threshold: 60, unit: 'tablets', price: 5.0, expiry: '2026-01' },
    { id: 5, name: 'Atorvastatin 10mg', category: 'Statin', stock: 90, threshold: 40, unit: 'tablets', price: 12.0, expiry: '2025-09' },
    { id: 6, name: 'Omeprazole 20mg', category: 'PPI', stock: 75, threshold: 50, unit: 'capsules', price: 4.5, expiry: '2025-07' },
    { id: 7, name: 'Insulin Novolin', category: 'Hormone', stock: 5, threshold: 20, unit: 'vials', price: 450, expiry: '2024-08' },
    { id: 8, name: 'Cetirizine 10mg', category: 'Antihistamine', stock: 180, threshold: 60, unit: 'tablets', price: 2.0, expiry: '2026-03' },
    { id: 9, name: 'Azithromycin 500mg', category: 'Antibiotic', stock: 25, threshold: 30, unit: 'tablets', price: 22, expiry: '2025-05' },
    { id: 10, name: 'Ibuprofen 400mg', category: 'NSAID', stock: 110, threshold: 70, unit: 'tablets', price: 3.0, expiry: '2025-11' },
];

export default function PharmacyStock() {
    const [meds, setMeds] = useState(initialMeds);
    const [q, setQ] = useState('');
    const [filter, setFilter] = useState('all');
    const [showAdd, setShowAdd] = useState(false);
    const [newMed, setNewMed] = useState({ name: '', category: '', stock: 0, threshold: 50, unit: 'tablets', price: 0, expiry: '' });

    const filtered = meds.filter(m => {
        const matchQ = m.name.toLowerCase().includes(q.toLowerCase()) || m.category.toLowerCase().includes(q.toLowerCase());
        const matchF = filter === 'all' || (filter === 'low' && m.stock < m.threshold) || (filter === 'ok' && m.stock >= m.threshold);
        return matchQ && matchF;
    });

    const restock = (id) => {
        setMeds(m => m.map(med => med.id === id ? { ...med, stock: med.threshold + 50 } : med));
        toast.success('Stock updated! Reorder placed.');
    };

    const addMedicine = () => {
        if (!newMed.name) { toast.error('Name required'); return; }
        setMeds(m => [...m, { ...newMed, id: Date.now() }]);
        setShowAdd(false);
        setNewMed({ name: '', category: '', stock: 0, threshold: 50, unit: 'tablets', price: 0, expiry: '' });
        toast.success('Medicine added to inventory!');
    };

    const lowCount = meds.filter(m => m.stock < m.threshold).length;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 className="page-title">📦 Stock Tracker</h1>
                        <p className="page-subtitle">{meds.length} medicines • {lowCount} low-stock alerts</p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Medicine</button>
                </div>

                {/* Stats Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                    {[
                        { label: 'Total Items', val: meds.length, color: '#0ea5e9', icon: '📦' },
                        { label: 'Low Stock', val: lowCount, color: '#ef4444', icon: '⚠️' },
                        { label: 'Well Stocked', val: meds.length - lowCount, color: '#10b981', icon: '✅' },
                    ].map(s => (
                        <div key={s.label} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 28 }}>{s.icon}</span>
                            <div>
                                <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, color: s.color }}>{s.val}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="card" style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                    <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input className="form-input" placeholder="Search medicines..." value={q} onChange={e => setQ(e.target.value)} style={{ border: 'none', background: 'transparent', padding: '4px 0', flex: 1 }} />
                    <div style={{ display: 'flex', gap: 6 }}>
                        {['all', 'low', 'ok'].map(f => (
                            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
                                {f === 'all' ? 'All' : f === 'low' ? '⚠️ Low' : '✅ OK'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Medicine</th><th>Category</th><th>Stock</th><th>Level</th><th>Expiry</th><th>Price</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(m => {
                                const pct = Math.min((m.stock / m.threshold) * 100, 100);
                                const isLow = m.stock < m.threshold;
                                return (
                                    <tr key={m.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.unit}</div>
                                        </td>
                                        <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{m.category}</span></td>
                                        <td>
                                            <span style={{ fontWeight: 700, fontSize: 15, color: isLow ? '#f87171' : '#34d399' }}>{m.stock}</span>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/{m.threshold}</span>
                                        </td>
                                        <td style={{ minWidth: 100 }}>
                                            <div className="progress-bar" style={{ height: 8 }}>
                                                <div className="progress-bar-fill" style={{ width: `${pct}%`, background: isLow ? 'var(--danger)' : 'var(--accent)' }} />
                                            </div>
                                            <span style={{ fontSize: 11, color: isLow ? '#f87171' : '#34d399' }}>{isLow ? 'Low Stock' : 'OK'}</span>
                                        </td>
                                        <td style={{ fontSize: 13, color: new Date(m.expiry) < new Date() ? '#f87171' : 'var(--text-secondary)' }}>{m.expiry}</td>
                                        <td style={{ fontWeight: 600, fontSize: 13 }}>₹{m.price}</td>
                                        <td>
                                            {isLow ? (
                                                <button className="btn btn-danger btn-sm" onClick={() => restock(m.id)}><RefreshCw size={13} /> Restock</button>
                                            ) : (
                                                <span className="badge badge-green"><CheckCircle size={10} /> Stocked</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Add Medicine Modal */}
                {showAdd && (
                    <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">➕ Add Medicine</h2>
                                <div className="modal-close" onClick={() => setShowAdd(false)}>✕</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div className="form-group">
                                    <label className="form-label">Medicine Name *</label>
                                    <input className="form-input" value={newMed.name} onChange={e => setNewMed(n => ({ ...n, name: e.target.value }))} placeholder="e.g. Aspirin 75mg" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <input className="form-input" value={newMed.category} onChange={e => setNewMed(n => ({ ...n, category: e.target.value }))} placeholder="Analgesic" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Unit</label>
                                        <select className="form-select" value={newMed.unit} onChange={e => setNewMed(n => ({ ...n, unit: e.target.value }))}>
                                            <option>tablets</option><option>capsules</option><option>vials</option><option>strips</option><option>bottles</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Current Stock</label>
                                        <input className="form-input" type="number" value={newMed.stock} onChange={e => setNewMed(n => ({ ...n, stock: +e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Min Threshold</label>
                                        <input className="form-input" type="number" value={newMed.threshold} onChange={e => setNewMed(n => ({ ...n, threshold: +e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Price (₹)</label>
                                        <input className="form-input" type="number" step="0.5" value={newMed.price} onChange={e => setNewMed(n => ({ ...n, price: +e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Expiry (YYYY-MM)</label>
                                        <input className="form-input" type="month" value={newMed.expiry} onChange={e => setNewMed(n => ({ ...n, expiry: e.target.value }))} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={addMedicine}><Plus size={16} /> Add Medicine</button>
                                    <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
