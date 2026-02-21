import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            toast.success(`Welcome back, ${result.user.name}!`);
            navigate(`/${result.user.role}`);
        } else {
            toast.error(result.error || 'Invalid credentials.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', background: 'var(--bg-base)',
            background: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(14,165,233,0.08) 0%, transparent 60%), var(--bg-base)',
        }}>
            {/* Left Panel */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px',
                background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(99,102,241,0.12) 100%)',
                borderRight: '1px solid var(--border)',
            }} className="responsive-hide">
                <div style={{ maxWidth: 440 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏨</div>
                        <span style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DocSpot</span>
                    </div>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: 38, fontWeight: 800, marginBottom: 16, lineHeight: 1.1 }}>
                        Smart Healthcare
                        <br /><span className="gradient-text">Starts Here</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
                        AI-powered telemedicine connecting patients, doctors, nurses and pharmacies — with offline support and Tamil language AI.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {['🤖 AI Symptom Checker in Tamil', '📹 Video Consultations with Doctors', '📱 QR-based Patient Health Records', '📡 Offline-First, Auto-Sync Design'].map(f => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span> {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
                    <Link to="/" style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 32 }}>
                        ← Back to Home
                    </Link>
                    <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Sign In</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 36 }}>Welcome back to DocSpot</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 44 }} />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)', padding: 0 }}>
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 4 }}>
                            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><LogIn size={18} /> Sign In</>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginTop: 28 }}>
                        New user? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create Account →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
