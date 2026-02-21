import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import {
    LayoutDashboard, Users, FileText, Video, QrCode,
    Package, Bell, LogOut, Activity, Stethoscope,
    Pill, HeartPulse, ClipboardList, RefreshCw
} from 'lucide-react';

const navConfig = {
    patient: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/patient' },
        { icon: HeartPulse, label: 'AI Symptom Check', path: '/patient/symptoms' },
        { icon: Stethoscope, label: 'AI Video Doctor', path: '/patient/ai-doctor' },
        { icon: Video, label: 'Video Consult', path: '/patient/video' },
        { icon: QrCode, label: 'My QR Record', path: '/patient/qr' },
    ],
    doctor: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor' },
        { icon: Users, label: 'My Patients', path: '/doctor/patients' },
        { icon: Video, label: 'Video Room', path: '/doctor/video' },
        { icon: FileText, label: 'Prescriptions', path: '/doctor/prescription' },
    ],
    nurse: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/nurse' },
        { icon: Activity, label: 'Patient Vitals', path: '/nurse/vitals' },
    ],
    pharmacy: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/pharmacy' },
        { icon: Package, label: 'Stock Tracker', path: '/pharmacy/stock' },
    ],
};

const roleColors = {
    patient: 'var(--color-patient)',
    doctor: 'var(--color-doctor)',
    nurse: 'var(--color-nurse)',
    pharmacy: 'var(--color-pharmacy)',
};

const roleIcons = {
    patient: '🏥',
    doctor: '🩺',
    nurse: '💉',
    pharmacy: '💊',
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const { isOnline, pendingSync } = useOffline();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = navConfig[user?.role] || [];
    const roleColor = roleColors[user?.role] || 'var(--primary)';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">🏨</div>
                <span className="sidebar-logo-text">DocSpot</span>
            </div>

            {/* Role Badge */}
            <div style={{ padding: '0 16px 16px' }}>
                <div style={{
                    padding: '16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                }}>
                    <div className="flex items-center gap-3">
                        <div className="avatar" style={{
                            background: `${roleColor}10`,
                            color: roleColor,
                            border: `2px solid ${roleColor}25`,
                            width: 44, height: 44, fontSize: 18,
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {user?.avatar || roleIcons[user?.role]}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: roleColor }} />
                                {user?.role}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Main Menu</div>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.path}
                            className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                            style={{
                                background: isActive ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: isActive ? 600 : 400
                            }}
                        >
                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            {item.label}
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                {/* Online Status */}
                <div style={{ marginBottom: 12 }}>
                    <div className={`status-bar ${isOnline ? 'status-online' : 'status-offline'}`} style={{
                        background: isOnline ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                        border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
                        color: isOnline ? 'var(--accent)' : 'var(--danger)',
                        fontSize: 11, fontWeight: 600
                    }}>
                        <div className={`status-dot ${isOnline ? 'status-dot-online' : 'status-dot-offline'}`}
                            style={{ background: isOnline ? 'var(--accent)' : 'var(--danger)' }} />
                        {isOnline ? 'System Online' : 'Offline Mode'}
                        {pendingSync > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto', color: 'var(--accent-warm)' }}>
                                <RefreshCw size={11} className="animate-spin" />
                                {pendingSync}
                            </span>
                        )}
                    </div>
                </div>

                {user?.patientId && (
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, paddingLeft: 4, letterSpacing: '0.02em' }}>
                        PATIENT ID: {user.patientId}
                    </div>
                )}

                <div className="sidebar-nav-link" onClick={handleLogout} style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}
                    onMouseEnter={e => e.target.style.color = 'var(--danger)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                    <LogOut size={16} />
                    Sign Out
                </div>
            </div>
        </aside>
    );
}
