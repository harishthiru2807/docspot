import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Download, Share2, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

const mockRecord = {
    medications: ['Metformin 500mg', 'Amlodipine 5mg'],
    allergies: ['Penicillin', 'Aspirin'],
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    bloodGroup: 'O+',
    lastVisit: '2024-02-15',
    doctor: 'Dr. Rajesh Kumar',
    emergencyContact: '+91 98765 43210',
};

export default function PatientQR() {
    const { user } = useAuth();
    const canvasRef = useRef(null);
    const [qrGenerated, setQrGenerated] = useState(false);

    useEffect(() => {
        generateQR();
    }, [user]);

    const generateQR = async () => {
        if (!canvasRef.current) return;
        const data = JSON.stringify({ id: user?.patientId, name: user?.name, ...mockRecord });
        try {
            await QRCode.toCanvas(canvasRef.current, data, {
                width: 220, margin: 2,
                color: { dark: '#0ea5e9', light: '#0a1628' },
            });
            setQrGenerated(true);
        } catch (e) { console.error(e); }
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `${user?.patientId}-health-qr.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
        toast.success('QR Code downloaded!');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(`Patient ID: ${user?.patientId}\nName: ${user?.name}`);
        toast.success('Patient info copied to clipboard!');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">📱 QR Health Record</h1>
                    <p className="page-subtitle">Your digital health passport — scan to view complete medical history</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'start' }}>
                    {/* QR Card */}
                    <div className="card" style={{ textAlign: 'center', minWidth: 280, background: 'var(--bg-card)', border: '1px solid rgba(14,165,233,0.3)' }}>
                        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 6 }}>🏥 DocSpot Health ID</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>{user?.patientId}</p>
                        <div style={{
                            padding: 16, borderRadius: 16, background: '#0a1628',
                            display: 'inline-block', border: '2px solid rgba(14,165,233,0.4)',
                            boxShadow: '0 0 30px rgba(14,165,233,0.2)',
                        }}>
                            <canvas ref={canvasRef} style={{ display: 'block' }} />
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '14px 0 4px' }}>Scan with any QR reader</p>
                        <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary-light)' }}>{user?.name}</p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
                            <button className="btn btn-primary btn-sm" onClick={handleDownload}><Download size={14} /> Download</button>
                            <button className="btn btn-outline btn-sm" onClick={handleShare}><Share2 size={14} /> Share ID</button>
                            <button className="btn btn-ghost btn-sm" onClick={generateQR}><RefreshCw size={14} /></button>
                        </div>
                    </div>

                    {/* Health Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Blood Group & Emergency */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                                <div style={{ fontSize: 42, marginBottom: 4 }}>🩸</div>
                                <div style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 900, color: '#f87171' }}>{mockRecord.bloodGroup}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Blood Group</div>
                            </div>
                            <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
                                <div style={{ fontSize: 22, marginBottom: 6 }}>📞</div>
                                <div style={{ fontWeight: 700, marginBottom: 2 }}>Emergency Contact</div>
                                <div style={{ fontSize: 14, color: '#fbbf24', fontWeight: 600 }}>{mockRecord.emergencyContact}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Last Visit: {mockRecord.lastVisit}</div>
                            </div>
                        </div>

                        {/* Conditions */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>🏥 Medical Conditions</h3>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {mockRecord.conditions.map(c => <span key={c} className="badge badge-yellow">{c}</span>)}
                            </div>
                        </div>

                        {/* Medications */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>💊 Current Medications</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {mockRecord.medications.map(m => (
                                    <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(16,185,129,0.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.15)' }}>
                                        <span>💊</span>
                                        <span style={{ fontSize: 14, fontWeight: 500 }}>{m}</span>
                                        <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: 10 }}>Active</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Allergies */}
                        <div className="card">
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>⚠️ Allergies</h3>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {mockRecord.allergies.map(a => <span key={a} className="badge badge-red">⚠️ {a}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
