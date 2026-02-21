import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/Dashboard';
import PatientSymptoms from './pages/patient/Symptoms';
import PatientQR from './pages/patient/QRRecord';
import PatientVideo from './pages/patient/VideoConsult';
import AIVideoDoctor from './pages/patient/AIVideoDoctor';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorVideo from './pages/doctor/VideoRoom';
import DoctorPrescription from './pages/doctor/Prescription';
import NurseDashboard from './pages/nurse/Dashboard';
import NurseVitals from './pages/nurse/Vitals';
import PharmacyDashboard from './pages/pharmacy/Dashboard';
import PharmacyStock from './pages/pharmacy/Stock';

function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;
    return children;
}

function RoleRedirect() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <Navigate to={`/${user.role}`} replace />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<RoleRedirect />} />

            {/* Patient Routes */}
            <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patient/symptoms" element={<ProtectedRoute allowedRoles={['patient']}><PatientSymptoms /></ProtectedRoute>} />
            <Route path="/patient/qr" element={<ProtectedRoute allowedRoles={['patient']}><PatientQR /></ProtectedRoute>} />
            <Route path="/patient/video" element={<ProtectedRoute allowedRoles={['patient']}><PatientVideo /></ProtectedRoute>} />
            <Route path="/patient/ai-doctor" element={<ProtectedRoute allowedRoles={['patient']}><AIVideoDoctor /></ProtectedRoute>} />

            {/* Doctor Routes */}
            <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorPatients /></ProtectedRoute>} />
            <Route path="/doctor/video" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorVideo /></ProtectedRoute>} />
            <Route path="/doctor/prescription" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorPrescription /></ProtectedRoute>} />

            {/* Nurse Routes */}
            <Route path="/nurse" element={<ProtectedRoute allowedRoles={['nurse']}><NurseDashboard /></ProtectedRoute>} />
            <Route path="/nurse/vitals" element={<ProtectedRoute allowedRoles={['nurse']}><NurseVitals /></ProtectedRoute>} />

            {/* Pharmacy Routes */}
            <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={['pharmacy']}><PharmacyDashboard /></ProtectedRoute>} />
            <Route path="/pharmacy/stock" element={<ProtectedRoute allowedRoles={['pharmacy']}><PharmacyStock /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <OfflineProvider>
                <BrowserRouter>
                    <AppRoutes />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: '#0f1e36',
                                color: '#f0f6ff',
                                border: '1px solid rgba(148,163,184,0.2)',
                                borderRadius: '12px',
                                fontSize: '14px',
                            },
                        }}
                    />
                </BrowserRouter>
            </OfflineProvider>
        </AuthProvider>
    );
}
