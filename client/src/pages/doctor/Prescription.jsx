import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Plus, Trash2, Send, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const patientOptions = [
    { id: 'PT-001', name: 'Arun Selvam', age: 45, condition: 'Hypertension' },
    { id: 'PT-002', name: 'Kavya Raj', age: 28, condition: 'Diabetes' },
    { id: 'PT-003', name: 'Mohan Das', age: 62, condition: 'Cardiac Arrhythmia' },
    { id: 'PT-004', name: 'Priya Kumar', age: 34, condition: 'Viral Fever' },
];

const medList = ['Paracetamol 500mg', 'Amoxicillin 500mg', 'Metformin 500mg', 'Amlodipine 5mg', 'Atorvastatin 10mg', 'Omeprazole 20mg', 'Cetirizine 10mg', 'Ibuprofen 400mg', 'Doxycycline 100mg', 'Azithromycin 500mg'];

export default function DoctorPrescription() {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [meds, setMeds] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [notes, setNotes] = useState('');
    const [sent, setSent] = useState(false);

    const addMed = () => setMeds(m => [...m, { name: '', dosage: '', frequency: '', duration: '' }]);
    const removeMed = (i) => setMeds(m => m.filter((_, idx) => idx !== i));
    const updateMed = (i, field, val) => setMeds(m => m.map((med, idx) => idx === i ? { ...med, [field]: val } : med));

    const handleSend = () => {
        if (!selectedPatient || meds[0].name === '') { toast.error('Please select patient and add medication'); return; }
        setSent(true);
        toast.success('Prescription sent to pharmacy! 💊');
    };

    const patient = patientOptions.find(p => p.id === selectedPatient);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">📋 Write Prescription</h1>
                    <p className="page-subtitle">Digital prescription — sent directly to pharmacy</p>
                </div>

                {sent ? (
                    <div className="card" style={{ textAlign: 'center', padding: 60, background: 'radial-gradient(ellipse at 50% 30%,rgba(16,185,129,0.1) 0%,transparent 70%)' }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: '#34d399', marginBottom: 8 }}>Prescription Sent!</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Prescription for <strong>{patient?.name}</strong> was sent to your linked pharmacy. Stock verification in progress.</p>
                        <button className="btn btn-primary" onClick={() => { setSent(false); setSelectedPatient(''); setMeds([{ name: '', dosage: '', frequency: '', duration: '' }]); setNotes(''); }}>
                            ✏️ Write Another
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Patient */}
                            <div className="card">
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>👤 Select Patient</h3>
                                <select className="form-select" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                                    <option value="">-- Select Patient --</option>
                                    {patientOptions.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id}) — {p.condition}</option>)}
                                </select>
                                {patient && (
                                    <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
                                        <span>👤</span>
                                        <span><strong>{patient.name}</strong> • {patient.age}y • {patient.condition}</span>
                                    </div>
                                )}
                            </div>

                            {/* Medications */}
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                    <h3 style={{ fontFamily: 'Outfit', fontWeight: 700 }}>💊 Medications</h3>
                                    <button className="btn btn-outline btn-sm" onClick={addMed}><Plus size={14} /> Add</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {meds.map((med, i) => (
                                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'center', padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                                            <select className="form-select" value={med.name} onChange={e => updateMed(i, 'name', e.target.value)} style={{ fontSize: 13 }}>
                                                <option value="">Select Medicine</option>
                                                {medList.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <input className="form-input" placeholder="Dosage" value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} style={{ fontSize: 13 }} />
                                            <select className="form-select" value={med.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} style={{ fontSize: 13 }}>
                                                <option value="">Frequency</option>
                                                <option>Once daily</option>
                                                <option>Twice daily</option>
                                                <option>Thrice daily</option>
                                                <option>Every 8 hrs</option>
                                                <option>As needed</option>
                                            </select>
                                            <input className="form-input" placeholder="Days" value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)} style={{ fontSize: 13 }} />
                                            <button onClick={() => removeMed(i)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px', color: '#f87171', cursor: 'pointer' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="card">
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>📝 Doctor's Notes</h3>
                                <textarea className="form-input" rows={4} placeholder="Additional instructions, diet, follow-up notes..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleSend}>
                                    <Send size={18} /> Send to Pharmacy
                                </button>
                                <button className="btn btn-ghost" onClick={() => window.print()}><Printer size={16} /> Print</button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="card" style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 14 }}>👁 Preview</h3>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                                <div style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: 14, marginBottom: 4 }}>🏥 DocSpot Prescription</div>
                                <div>Patient: <strong>{patient?.name || '—'}</strong></div>
                                <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
                                <div style={{ margin: '10px 0', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                                    <strong>Rx:</strong>
                                    {meds.filter(m => m.name).map((m, i) => (
                                        <div key={i} style={{ marginTop: 6, padding: '4px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
                                            <div style={{ color: 'var(--text-muted)' }}>{m.dosage} • {m.frequency} • {m.duration}</div>
                                        </div>
                                    ))}
                                    {meds.filter(m => m.name).length === 0 && <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>No medications yet</div>}
                                </div>
                                {notes && <div style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}><strong>Notes:</strong><br />{notes}</div>}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
