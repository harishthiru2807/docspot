import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', phone: '', language: 'Tamil' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const roles = [
        { id: 'patient', label: 'Patient', icon: '🏥', color: '#0ea5e9' },
        { id: 'doctor', label: 'Doctor', icon: '🩺', color: '#6366f1' },
        { id: 'nurse', label: 'Nurse', icon: '💉', color: '#10b981' },
        { id: 'pharmacy', label: 'Pharmacy', icon: '💊', color: '#f59e0b' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register(form);
        if (result.success) {
            toast.success('Account created! Welcome to DocSpot 🎉');
            navigate(`/${result.user.role}`);
        } else {
            toast.error(result.error || 'Registration failed.');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', background: 'var(--bg-base)' }}>
            <div style={{ width: '100%', maxWidth: 520 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏨</div>
                        <span style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DocSpot</span>
                    </div>
                    <h1 style={{ fontFamily: 'Outfit', fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Create Your Account</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Join the DocSpot healthcare network</p>
                </div>

                <div className="card-glass" style={{ padding: 32 }}>
                    {/* Role Selector */}
                    <div style={{ marginBottom: 24 }}>
                        <div className="form-label" style={{ marginBottom: 10 }}>I am a...</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                            {roles.map(r => (
                                <button key={r.id} type="button"
                                    onClick={() => setForm(f => ({ ...f, role: r.id }))}
                                    style={{
                                        padding: '12px 6px', borderRadius: 12, cursor: 'pointer',
                                        border: `2px solid ${form.role === r.id ? r.color : 'var(--border)'}`,
                                        background: form.role === r.id ? `${r.color}15` : 'rgba(255,255,255,0.02)',
                                        color: form.role === r.id ? r.color : 'var(--text-secondary)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                        transition: 'all 0.2s', fontSize: 11, fontWeight: 600,
                                    }}
                                >
                                    <span style={{ fontSize: 22 }}>{r.icon}</span>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" placeholder="Dr. / Nurse / Patient name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Preferred Language</label>
                            <select className="form-select" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
                                <option>Tamil</option>
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Telugu</option>
                                <option>Kannada</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 4 }}>
                            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><UserPlus size={18} /> Create Account</>}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginTop: 20 }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign In →</Link>
                </p>
            </div>
        </div>
    );
}
