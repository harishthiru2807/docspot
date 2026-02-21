import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();
    const [activeRole, setActiveRole] = useState(null);

    const roles = [
        { id: 'patient', icon: '🏥', title: 'Patient', desc: 'Book appointments, check symptoms with AI, get QR health records', color: '#0ea5e9', grad: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
        { id: 'doctor', icon: '🩺', title: 'Doctor', desc: 'Manage cases, conduct video consultations, write prescriptions', color: '#6366f1', grad: 'linear-gradient(135deg,#6366f1,#a5b4fc)' },
        { id: 'nurse', icon: '💉', title: 'Nurse', desc: 'Record vitals, support patients, manage shift availability', color: '#10b981', grad: 'linear-gradient(135deg,#10b981,#34d399)' },
        { id: 'pharmacy', icon: '💊', title: 'Pharmacy', desc: 'Track medication stock, handle prescriptions and refills', color: '#f59e0b', grad: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
    ];

    const features = [
        { icon: '🤖', title: 'AI Symptom Checker', desc: 'Smart diagnosis in Tamil & English using ML models', badge: 'AI Powered' },
        { icon: '📹', title: 'Video Consultations', desc: 'Connect with doctors via WebRTC & Jitsi Meet', badge: 'Live' },
        { icon: '📱', title: 'QR Health Records', desc: 'Instant digital patient history via QR code scan', badge: 'Secure' },
        { icon: '📡', title: 'Offline First', desc: 'Works without internet, auto-syncs when connected', badge: 'Offline' },
        { icon: '💊', title: 'Stock Medication', desc: 'Real-time pharmacy inventory with low-stock alerts', badge: 'Real-time' },
        { icon: '🌍', title: 'Tamil AI Doctor', desc: 'AI-powered health guidance in Tamil language', badge: 'Tamil' },
    ];

    const workflow = [
        { step: '01', title: 'Register & Get QR', icon: '📲', desc: 'Patient registers and receives a unique QR code ID' },
        { step: '02', title: 'Input Symptoms', icon: '🗣️', desc: 'Enter symptoms via voice, touch, or text in Tamil/English' },
        { step: '03', title: 'AI Analysis', icon: '🧠', desc: 'ML model assesses vitals and predicts possible conditions' },
        { step: '04', title: 'Doctor Connect', icon: '📹', desc: 'Video consultation or prescription from a qualified doctor' },
        { step: '05', title: 'Pharmacy Alert', icon: '💊', desc: 'Prescription sent to pharmacy; stock verified instantly' },
        { step: '06', title: 'Follow-Up Care', icon: '📋', desc: 'Digital records stored; nurse tracks recovery progress' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
            {/* Navbar */}
            <nav style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 40px', height: 70,
                background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: 'var(--grad-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>🏨</div>
                    <span style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        DocSpot
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Started</button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{
                minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '80px 24px 40px',
                background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 70%)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Blobs */}
                <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', top: -200, right: -100, filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(16,185,129,0.06)', bottom: -100, left: -100, filter: 'blur(80px)', pointerEvents: 'none' }} />

                <div className="badge badge-blue animate-fade-up" style={{ marginBottom: 20 }}>
                    🚀 AI-Powered Telemedicine Platform
                </div>
                <h1 className="animate-fade-up delay-1" style={{
                    fontFamily: 'Outfit', fontSize: 'clamp(48px,8vw,88px)', fontWeight: 900,
                    lineHeight: 1.05, marginBottom: 24, maxWidth: 900,
                }}>
                    Healthcare for
                    <span className="gradient-text"> Every Indian</span>
                    {' '}Village
                </h1>
                <p className="animate-fade-up delay-2" style={{
                    fontSize: 'clamp(16px,2vw,20px)', color: 'var(--text-secondary)', maxWidth: 620, marginBottom: 40, lineHeight: 1.7
                }}>
                    Connect doctors, nurses, pharmacies and patients on one AI-powered platform.
                    Diagnose symptoms in <strong style={{ color: 'var(--primary-light)' }}>Tamil</strong>, consult via video, access records via QR — even offline.
                </p>
                <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                        🚀 Start Free Today
                    </button>
                    <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>
                        🩺 Explore Portals
                    </button>
                </div>

                {/* Floating stats */}
                <div className="animate-fade-up delay-4" style={{ display: 'flex', gap: 16, marginTop: 56, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { val: '10K+', label: 'Patients Served' },
                        { val: '500+', label: 'Doctors Connected' },
                        { val: '98%', label: 'Uptime Guaranteed' },
                        { val: '24/7', label: 'AI Support' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: 14, padding: '16px 24px', textAlign: 'center',
                        }}>
                            <div style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Roles Section */}
            <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: 42, fontWeight: 800, marginBottom: 14 }}>
                        Four Portals, <span className="gradient-text">One Platform</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>Each role gets a specialized, tailored dashboard</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                    {roles.map((role) => (
                        <div key={role.id}
                            className="card"
                            onClick={() => navigate('/login')}
                            style={{
                                cursor: 'pointer', textAlign: 'center',
                                border: `1px solid ${activeRole === role.id ? role.color + '60' : 'var(--border)'}`,
                                background: activeRole === role.id ? `${role.color}10` : 'var(--bg-card)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={() => setActiveRole(role.id)}
                            onMouseLeave={() => setActiveRole(null)}
                        >
                            <div style={{
                                width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
                                background: role.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
                                boxShadow: `0 8px 20px ${role.color}40`,
                            }}>{role.icon}</div>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: role.color, marginBottom: 8 }}>{role.title}</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{role.desc}</p>
                            <button className="btn btn-sm" style={{
                                marginTop: 16, background: role.color + '20', color: role.color,
                                border: `1px solid ${role.color}40`,
                            }}>
                                Enter Portal →
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '60px 40px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
                            Everything You Need
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 17 }}>Powered by AI, built for rural and urban India</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {features.map((f, i) => (
                            <div key={i} className="card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div style={{ fontSize: 36 }}>{f.icon}</div>
                                    <span className="badge badge-blue" style={{ fontSize: 10 }}>{f.badge}</span>
                                </div>
                                <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow */}
            <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 17 }}>From symptom to cure — seamlessly connected</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    {workflow.map((w, i) => (
                        <div key={i} className="card" style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'Outfit', fontSize: 40, fontWeight: 900, color: 'rgba(255,255,255,0.04)' }}>{w.step}</div>
                            <div style={{ fontSize: 36, marginBottom: 12 }}>{w.icon}</div>
                            <div className="badge badge-blue" style={{ marginBottom: 10, fontSize: 10 }}>Step {w.step}</div>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{w.title}</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{w.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{
                padding: '80px 40px', textAlign: 'center',
                background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(14,165,233,0.1) 0%, transparent 70%)',
            }}>
                <h2 style={{ fontFamily: 'Outfit', fontSize: 48, fontWeight: 900, marginBottom: 16 }}>
                    Ready to Transform
                    <span className="gradient-text"> Healthcare?</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
                    Join thousands of doctors, nurses, pharmacies and patients already on DocSpot
                </p>
                <button className="btn btn-primary btn-lg animate-pulse-glow" onClick={() => navigate('/register')} style={{ fontSize: 18, padding: '16px 40px' }}>
                    🚀 Join DocSpot Free
                </button>
            </section>

            {/* Footer */}
            <footer style={{
                borderTop: '1px solid var(--border)', background: 'var(--bg-surface)',
                padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DocSpot</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2024 DocSpot. AI-Powered Telemedicine for India.</div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge badge-green">Offline Ready</span>
                    <span className="badge badge-blue">Tamil AI</span>
                    <span className="badge badge-purple">HIPAA Safe</span>
                </div>
            </footer>
        </div>
    );
}
