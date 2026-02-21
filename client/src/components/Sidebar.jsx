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
                <div className="card" style={{
                    padding: '14px',
                    background: `rgba(${roleColor === 'var(--color-patient)' ? '14,165,233' : roleColor === 'var(--color-doctor)' ? '99,102,241' : roleColor === 'var(--color-nurse)' ? '16,185,129' : '245,158,11'},0.08)`,
                    border: `1px solid rgba(${roleColor === 'var(--color-patient)' ? '14,165,233' : roleColor === 'var(--color-doctor)' ? '99,102,241' : roleColor === 'var(--color-nurse)' ? '16,185,129' : '245,158,11'},0.2)`,
                }}>
                    <div className="flex items-center gap-3">
                        <div className="avatar" style={{
                            background: `rgba(${roleColor === 'var(--color-patient)' ? '14,165,233' : roleColor === 'var(--color-doctor)' ? '99,102,241' : roleColor === 'var(--color-nurse)' ? '16,185,129' : '245,158,11'},0.2)`,
                            color: roleColor,
                            border: `2px solid ${roleColor}40`,
                            width: 42, height: 42, fontSize: 16,
                        }}>
                            {user?.avatar}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                                {roleIcons[user?.role]} {user?.role}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Navigation</div>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.path}
                            className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                {/* Online Status */}
                <div style={{ marginBottom: 12 }}>
                    <div className={`status-bar ${isOnline ? 'status-online' : 'status-offline'}`}>
                        <div className={`status-dot ${isOnline ? 'status-dot-online' : 'status-dot-offline'}`} />
                        {isOnline ? 'Online' : 'Offline Mode'}
                        {pendingSync > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto', color: '#fbbf24' }}>
                                <RefreshCw size={11} />
                                {pendingSync} pending
                            </span>
                        )}
                    </div>
                </div>

                {user?.patientId && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, paddingLeft: 4 }}>
                        ID: {user.patientId}
                    </div>
                )}

                <div className="sidebar-nav-link" onClick={handleLogout} style={{ color: 'var(--danger)', marginTop: 4 }}>
                    <LogOut size={18} />
                    Sign Out
                </div>
            </div>
        </aside>
    );
}
