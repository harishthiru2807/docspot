import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ExternalLink, Copy, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorVideo() {
    const { user } = useAuth();
    const [roomName] = useState(`docspot-dr-${user?.name?.split(' ')[1]?.toLowerCase() || 'room'}-${Date.now()}`);
    const [inRoom, setInRoom] = useState(false);

    const copyLink = () => {
        navigator.clipboard.writeText(`https://meet.jit.si/${roomName}`);
        toast.success('Room link copied!');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">📹 Video Consultation Room</h1>
                    <p className="page-subtitle">Start and manage video calls with your patients</p>
                </div>

                {!inRoom ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                        <div className="card" style={{ textAlign: 'center', padding: 48, background: 'radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.1) 0%, transparent 70%)' }}>
                            <div style={{ fontSize: 72, marginBottom: 20 }}>📹</div>
                            <h2 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Your Video Room is Ready</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: 15 }}>Room: <strong style={{ color: 'var(--primary-light)' }}>{roomName}</strong></p>
                            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Share this room with your patient to start the consultation</p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button className="btn btn-primary btn-lg" onClick={() => setInRoom(true)}>🚀 Enter Video Room</button>
                                <button className="btn btn-outline" onClick={copyLink}><Copy size={16} /> Copy Link</button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="card">
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 12 }}>📋 Pre-Call Checklist</h3>
                                {['Camera and microphone working', 'Patient confirmed appointment', 'Medical notes prepared', 'Prescription pad ready', 'Stable internet connection'].map(item => (
                                    <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                                        <span style={{ color: '#34d399' }}>✓</span> {item}
                                    </div>
                                ))}
                            </div>
                            <div className="card" style={{ background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: 8 }}>🔒 Security</h3>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All calls are end-to-end encrypted via Jitsi Meet WebRTC infrastructure. No data is stored on our servers.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span className="badge badge-green" style={{ fontSize: 13, padding: '6px 14px' }}>● Live Session</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-ghost btn-sm" onClick={copyLink}><Copy size={14} /> Copy Link</button>
                                <a href={`https://meet.jit.si/${roomName}`} target="_blank" rel="noreferrer">
                                    <button className="btn btn-ghost btn-sm"><ExternalLink size={14} /> Pop-out</button>
                                </a>
                                <button className="btn btn-danger btn-sm" onClick={() => setInRoom(false)}>✕ End Session</button>
                            </div>
                        </div>
                        <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', height: 'calc(100vh - 280px)', minHeight: 450 }}>
                            <iframe
                                src={`https://meet.jit.si/${roomName}`}
                                allow="camera; microphone; fullscreen; display-capture; autoplay"
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title="Doctor Video Room"
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
