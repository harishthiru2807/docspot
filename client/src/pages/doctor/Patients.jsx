import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Video, Search, Filter, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const patients = [
    { id: 'PT-001', name: 'Arun Selvam', age: 45, gender: 'M', condition: 'Hypertension', phone: '+91 98765 43210', lastVisit: '2024-02-20', status: 'active', bp: '140/90', avatar: 'AS' },
    { id: 'PT-002', name: 'Kavya Raj', age: 28, gender: 'F', condition: 'Type 2 Diabetes', phone: '+91 87654 32109', lastVisit: '2024-02-19', status: 'active', bp: '118/76', avatar: 'KR' },
    { id: 'PT-003', name: 'Mohan Das', age: 62, gender: 'M', condition: 'Cardiac Arrhythmia', phone: '+91 76543 21098', lastVisit: '2024-02-18', status: 'critical', bp: '160/95', avatar: 'MD' },
    { id: 'PT-004', name: 'Priya Kumar', age: 34, gender: 'F', condition: 'Viral Fever', phone: '+91 65432 10987', lastVisit: '2024-02-21', status: 'recovering', bp: '120/80', avatar: 'PK' },
    { id: 'PT-005', name: 'Suresh Anand', age: 55, gender: 'M', condition: 'Asthma', phone: '+91 54321 09876', lastVisit: '2024-02-17', status: 'stable', bp: '125/82', avatar: 'SA' },
];

export default function DoctorPatients() {
    const [q, setQ] = useState('');
    const navigate = useNavigate();
    const filtered = patients.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.condition.toLowerCase().includes(q.toLowerCase()) || p.id.includes(q));

    const statusColor = { active: 'badge-blue', critical: 'badge-red', recovering: 'badge-yellow', stable: 'badge-green' };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 className="page-title">👥 My Patients</h1>
                        <p className="page-subtitle">{patients.length} patients under your care</p>
                    </div>
                </div>
                <div className="card" style={{ marginBottom: 16, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input className="form-input" placeholder="Search by name, ID, or condition..." value={q} onChange={e => setQ(e.target.value)} style={{ border: 'none', background: 'transparent', padding: '4px 0' }} />
                </div>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Patient</th><th>Condition</th><th>BP</th><th>Last Visit</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="avatar avatar-blue" style={{ width: 38, height: 38, fontSize: 13 }}>{p.avatar}</div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.id} • {p.age}y {p.gender}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 13 }}>{p.condition}</td>
                                    <td><span style={{ fontWeight: 600, color: 'var(--primary-light)' }}>{p.bp}</span></td>
                                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.lastVisit}</td>
                                    <td><span className={`badge ${statusColor[p.status]}`}>{p.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-primary btn-sm" onClick={() => navigate('/doctor/video')}><Video size={13} /> Call</button>
                                            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/doctor/prescription')}><FileText size={13} /> Rx</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
