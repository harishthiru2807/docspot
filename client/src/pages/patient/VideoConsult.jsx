import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Video, Phone, PhoneOff, ExternalLink } from 'lucide-react';

const doctors = [
    { id: 1, name: 'Dr. Rajesh Kumar', spec: 'General Physician', status: 'available', avatar: 'RK', color: '#6366f1', wait: '~2 min' },
    { id: 2, name: 'Dr. Meena Krishnan', spec: 'Cardiologist', status: 'busy', avatar: 'MK', color: '#10b981', wait: '~15 min' },
    { id: 3, name: 'Dr. Suresh Babu', spec: 'Dermatologist', status: 'available', avatar: 'SB', color: '#f59e0b', wait: '~5 min' },
    { id: 4, name: 'Dr. Lakshmi Priya', spec: 'Diabetologist', status: 'offline', avatar: 'LP', color: '#ef4444', wait: null },
];

export default function PatientVideo() {
    const { user } = useAuth();
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [inCall, setInCall] = useState(false);
    const [roomName] = useState(`docspot-${user?.patientId?.toLowerCase()}-${Date.now()}`);

    const startCall = (doc) => {
        setSelectedDoc(doc);
        setInCall(true);
    };

    const endCall = () => {
        setInCall(false);
        setSelectedDoc(null);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">📹 Video Consultation</h1>
                    <p className="page-subtitle">Connect with a doctor via secure video call — powered by Jitsi Meet & WebRTC</p>
                </div>

                {!inCall ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
                        {/* Doctor List */}
                        <div>
                            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Available Doctors</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {doctors.map(doc => (
                                    <div key={doc.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div className="avatar" style={{ width: 52, height: 52, fontSize: 18, background: `${doc.color}20`, color: doc.color, border: `2px solid ${doc.color}40` }}>
                                            {doc.avatar}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: 15 }}>{doc.name}</div>
                                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{doc.spec}</div>
                                            {doc.wait && <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>⏱ Wait: {doc.wait}</div>}
                                        </div>
                                        <span className={`badge ${doc.status === 'available' ? 'badge-green' : doc.status === 'busy' ? 'badge-yellow' : 'badge-red'}`}>
                                            {doc.status === 'available' ? '● Available' : doc.status === 'busy' ? '● Busy' : '● Offline'}
                                        </span>
                                        <button
                                            className={`btn btn-sm ${doc.status === 'available' ? 'btn-primary' : 'btn-ghost'}`}
                                            disabled={doc.status !== 'available'}
                                            onClick={() => startCall(doc)}
                                        >
                                            <Video size={14} /> {doc.status === 'available' ? 'Call Now' : 'Unavailable'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Panel */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="card" style={{ background: 'rgba(14,165,233,0.05)', borderColor: 'rgba(14,165,233,0.2)' }}>
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 10 }}>🔒 Secure Call Info</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                                    <div>✓ End-to-end encrypted via Jitsi Meet</div>
                                    <div>✓ WebRTC peer-to-peer connection</div>
                                    <div>✓ No recording without consent</div>
                                    <div>✓ Works on mobile & desktop</div>
                                </div>
                            </div>
                            <div className="card">
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 10 }}>📋 Your Health ID</h3>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Shared with doctor during call:</div>
                                <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{user?.patientId}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{user?.name}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* In-Call View */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.25)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399', animation: 'pulse-glow 1.5s infinite' }} />
                                <span style={{ fontWeight: 600 }}>In Call with {selectedDoc?.name}</span>
                                <span className="badge badge-green" style={{ fontSize: 10 }}>{selectedDoc?.spec}</span>
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={endCall}><PhoneOff size={14} /> End Call</button>
                        </div>

                        {/* Jitsi iframe */}
                        <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', height: 'calc(100vh - 320px)', minHeight: 400 }}>
                            <iframe
                                src={`https://meet.jit.si/${roomName}`}
                                allow="camera; microphone; fullscreen; display-capture; autoplay"
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title="Jitsi Video Call"
                            />
                        </div>

                        <div className="card" style={{ padding: '12px 20px' }}>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                                🔒 Secure call via Jitsi Meet • Room: <strong style={{ color: 'var(--primary-light)' }}>{roomName}</strong> •
                                <a href={`https://meet.jit.si/${roomName}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', marginLeft: 6 }}>
                                    <ExternalLink size={12} style={{ display: 'inline' }} /> Open in new tab
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
