const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'docspot_secret_key_2024';

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ── In-Memory Store (replace with PostgreSQL for production) ──
const db = {
    users: [],
    patients: [],
    appointments: [],
    prescriptions: [],
    vitals: [],
    medications: [
        { id: 1, name: 'Paracetamol 500mg', stock: 30, threshold: 100, unit: 'tablets', category: 'Analgesic' },
        { id: 2, name: 'Amoxicillin 500mg', stock: 12, threshold: 50, unit: 'capsules', category: 'Antibiotic' },
        { id: 3, name: 'Metformin 500mg', stock: 200, threshold: 80, unit: 'tablets', category: 'Antidiabetic' },
    ],
};

// ── Auth Middleware ──
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// ── Health Check ──
app.get('/api/health', (req, res) => {
    res.json({ status: 'DocSpot API running', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ── Auth Routes ──
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role, phone, language } = req.body;
        if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing required fields' });
        if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });
        const hashedPwd = await bcrypt.hash(password, 10);
        const patientId = `PT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
        const user = { id: uuidv4(), name, email, password: hashedPwd, role, phone, language, patientId, createdAt: new Date().toISOString() };
        db.users.push(user);

        // Generate QR code data
        const qrData = JSON.stringify({ patientId, name, role, timestamp: Date.now() });
        const qrCode = await QRCode.toDataURL(qrData);

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...safeUser } = user;
        res.status(201).json({ user: { ...safeUser, qrCode }, token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = db.users.find(u => u.email === email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...safeUser } = user;
        res.json({ user: safeUser, token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ── Patient Routes ──
app.get('/api/patients', authenticateToken, (req, res) => {
    const patients = db.users.filter(u => u.role === 'patient').map(({ password, ...u }) => u);
    res.json(patients);
});

app.get('/api/patients/:id', authenticateToken, (req, res) => {
    const patient = db.users.find(u => u.id === req.params.id || u.patientId === req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    const { password, ...safe } = patient;
    res.json(safe);
});

// ── QR Code Route ──
app.get('/api/qr/:patientId', authenticateToken, async (req, res) => {
    try {
        const patient = db.users.find(u => u.patientId === req.params.patientId);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        const qrData = JSON.stringify({ patientId: patient.patientId, name: patient.name, timestamp: Date.now() });
        const qrCode = await QRCode.toDataURL(qrData);
        res.json({ qrCode, patientId: patient.patientId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ── Appointments ──
app.get('/api/appointments', authenticateToken, (req, res) => {
    const userApp = db.appointments.filter(a => a.patientId === req.user.id || a.doctorId === req.user.id);
    res.json(userApp);
});

app.post('/api/appointments', authenticateToken, (req, res) => {
    const apt = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString(), status: 'scheduled' };
    db.appointments.push(apt);
    res.status(201).json(apt);
});

// ── Prescriptions ──
app.get('/api/prescriptions', authenticateToken, (req, res) => {
    res.json(db.prescriptions);
});

app.post('/api/prescriptions', authenticateToken, (req, res) => {
    const rx = { id: uuidv4(), ...req.body, doctorId: req.user.id, createdAt: new Date().toISOString(), status: 'pending' };
    db.prescriptions.push(rx);
    res.status(201).json(rx);
});

// ── Vitals ──
app.post('/api/vitals', authenticateToken, (req, res) => {
    const v = { id: uuidv4(), ...req.body, nurseId: req.user.id, recordedAt: new Date().toISOString() };
    db.vitals.push(v);
    res.status(201).json(v);
});

app.get('/api/vitals/:patientId', authenticateToken, (req, res) => {
    res.json(db.vitals.filter(v => v.patientId === req.params.patientId));
});

// ── Pharmacy / Medications ──
app.get('/api/pharmacy/stock', authenticateToken, (req, res) => {
    res.json(db.medications);
});

app.put('/api/pharmacy/stock/:id', authenticateToken, (req, res) => {
    const idx = db.medications.findIndex(m => m.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Medicine not found' });
    db.medications[idx] = { ...db.medications[idx], ...req.body };
    res.json(db.medications[idx]);
});

app.post('/api/pharmacy/stock', authenticateToken, (req, res) => {
    const med = { id: db.medications.length + 1, ...req.body };
    db.medications.push(med);
    res.status(201).json(med);
});

// ── AI Symptom Check (Mock) ──
app.post('/api/ai/symptom-check', authenticateToken, (req, res) => {
    const { symptoms, language } = req.body;
    const lower = (symptoms || '').toLowerCase();
    let response = { diagnosis: 'General Assessment', severity: 'mild', action: 'normal', confidence: 0.82 };

    if (lower.includes('fever') || lower.includes('காய்ச்சல்')) {
        response = { diagnosis: language === 'tamil' ? 'வைரல் காய்ச்சல்' : 'Viral Fever', severity: 'moderate', action: 'medication', confidence: 0.88 };
    } else if (lower.includes('chest') || lower.includes('மார்பு')) {
        response = { diagnosis: language === 'tamil' ? 'அவசரகாலம்' : 'Emergency - Chest Pain', severity: 'emergency', action: 'emergency', confidence: 0.95 };
    } else if (lower.includes('headache') || lower.includes('தலைவலி')) {
        response = { diagnosis: 'Tension Headache', severity: 'mild', action: 'normal', confidence: 0.79 };
    }

    res.json({ ...response, processedAt: new Date().toISOString(), model: 'DocSpot-ML-v1.0', language });
});

// ── Offline Sync ──
app.post('/api/sync', authenticateToken, (req, res) => {
    const { queue } = req.body;
    const synced = queue?.length || 0;
    res.json({ synced, message: `${synced} offline actions synchronized`, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\n🏥 DocSpot API Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  POST /api/auth/register`);
    console.log(`  POST /api/auth/login`);
    console.log(`  GET  /api/patients`);
    console.log(`  GET  /api/qr/:patientId`);
    console.log(`  GET/POST /api/appointments`);
    console.log(`  GET/POST /api/prescriptions`);
    console.log(`  GET/POST /api/pharmacy/stock`);
    console.log(`  POST /api/ai/symptom-check`);
    console.log(`  POST /api/sync`);
});
