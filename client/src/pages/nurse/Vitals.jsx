import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const patients = ['Arun Selvam (PT-001)', 'Kavya Raj (PT-002)', 'Mohan Das (PT-003)', 'Priya Kumar (PT-004)'];

export default function NurseVitals() {
    const [form, setForm] = useState({ patient: '', bp_sys: '', bp_dia: '', temp: '', pulse: '', spo2: '', weight: '', notes: '', pain: 0 });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (!form.patient || !form.bp_sys || !form.temp) { toast.error('Please fill required fields'); return; }
        setSaved(true);
        toast.success('Vitals recorded successfully!');
    };

    if (saved) return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ textAlign: 'center', padding: 56, maxWidth: 480 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, color: '#34d399', marginBottom: 8 }}>Vitals Recorded!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Patient vitals have been saved and synced to the doctor's dashboard.</p>
                    <button className="btn btn-primary" onClick={() => { setSaved(false); setForm({ patient: '', bp_sys: '', bp_dia: '', temp: '', pulse: '', spo2: '', weight: '', notes: '', pain: 0 }); }}>
                        📋 Record Another
                    </button>
                </div>
            </main>
        </div>
    );

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">📊 Record Patient Vitals</h1>
                    <p className="page-subtitle">Enter and track patient vital signs</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
                    <div className="card">
                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label className="form-label">Patient *</label>
                            <select className="form-select" value={form.patient} onChange={e => setForm(f => ({ ...f, patient: e.target.value }))}>
                                <option value="">-- Select Patient --</option>
                                {patients.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div className="form-group">
                                <label className="form-label">BP Systolic * (mmHg)</label>
                                <input className="form-input" type="number" placeholder="120" value={form.bp_sys} onChange={e => setForm(f => ({ ...f, bp_sys: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">BP Diastolic * (mmHg)</label>
                                <input className="form-input" type="number" placeholder="80" value={form.bp_dia} onChange={e => setForm(f => ({ ...f, bp_dia: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Temperature * (°F)</label>
                                <input className="form-input" type="number" step="0.1" placeholder="98.6" value={form.temp} onChange={e => setForm(f => ({ ...f, temp: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pulse (bpm)</label>
                                <input className="form-input" type="number" placeholder="72" value={form.pulse} onChange={e => setForm(f => ({ ...f, pulse: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">SpO2 (%)</label>
                                <input className="form-input" type="number" placeholder="98" value={form.spo2} onChange={e => setForm(f => ({ ...f, spo2: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Weight (kg)</label>
                                <input className="form-input" type="number" placeholder="65" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 16 }}>
                            <label className="form-label">Pain Scale: {form.pain}/10</label>
                            <input type="range" min={0} max={10} value={form.pain} onChange={e => setForm(f => ({ ...f, pain: +e.target.value }))}
                                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                <span>No Pain</span><span>Moderate</span><span>Severe</span>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label className="form-label">Clinical Notes</label>
                            <textarea className="form-input" rows={3} placeholder="Any observations, patient complaints, or alerts..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} />
                        </div>

                        <button className="btn btn-primary btn-lg w-full" onClick={handleSave}>
                            <Save size={18} /> Save Vitals
                        </button>
                    </div>

                    {/* Reference Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { label: 'Normal BP', val: '120/80 mmHg', icon: '💗', status: 'green' },
                            { label: 'Normal Temp', val: '97.8 – 99.1 °F', icon: '🌡️', status: 'green' },
                            { label: 'Normal Pulse', val: '60 – 100 bpm', icon: '❤️', status: 'green' },
                            { label: 'Normal SpO2', val: '95 – 100 %', icon: '🫁', status: 'green' },
                        ].map(r => (
                            <div key={r.label} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10 }}>
                                <span style={{ fontSize: 20 }}>{r.icon}</span>
                                <div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.label}</div>
                                    <div style={{ fontWeight: 600, fontSize: 13, color: '#34d399' }}>{r.val}</div>
                                </div>
                            </div>
                        ))}
                        <div className="card" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)', marginTop: 4 }}>
                            <div style={{ fontWeight: 700, marginBottom: 8, color: '#fbbf24' }}>⚠️ Alert Thresholds</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                BP &gt;140/90 → Hypertension<br />
                                Temp &gt;100.4°F → Fever<br />
                                Pulse &gt;100 → Tachycardia<br />
                                SpO2 &lt;90% → Emergency
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
