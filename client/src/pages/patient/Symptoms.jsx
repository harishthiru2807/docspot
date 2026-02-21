import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Send, Mic, Globe, RefreshCw, Video, Phone, AlertTriangle, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    GREETINGS, KB, matchCondition, FALLBACK, POST_DIAGNOSIS, STAGES,
} from '../../data/aiDoctorEngine';
import ReactMarkdown from 'react-markdown';

const TYPING_DELAY = 1200;

function TypingIndicator() {
    return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 18 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>🩺</div>
            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '18px 18px 18px 4px', padding: '14px 18px', display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
            </div>
        </div>
    );
}

function Message({ msg, lang }) {
    const isDoctor = msg.sender === 'doctor';
    return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 18, flexDirection: isDoctor ? 'row' : 'row-reverse' }}>
            {isDoctor && (
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>🩺</div>
            )}
            <div style={{ maxWidth: '78%' }}>
                {isDoctor && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, marginLeft: 4 }}>Dr. ARIA • {msg.time}</div>}
                <div style={{
                    background: isDoctor ? 'rgba(99,102,241,0.08)' : 'linear-gradient(135deg,var(--primary),var(--primary-dark,#4f46e5))',
                    border: isDoctor ? '1px solid rgba(99,102,241,0.2)' : 'none',
                    borderRadius: isDoctor ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    padding: '14px 18px',
                    color: isDoctor ? 'var(--text-primary)' : '#fff',
                    fontSize: 14,
                    lineHeight: 1.7,
                }}>
                    <div className="ai-markdown">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                </div>
                {msg.pills && msg.pills.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {msg.pills.map(p => (
                            <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '4px 10px', color: '#34d399' }}>
                                <Pill size={10} /> {p}
                            </span>
                        ))}
                    </div>
                )}
                {msg.severity && (
                    <div style={{ marginTop: 8 }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
                            borderRadius: 20, padding: '4px 12px',
                            background: msg.severity === 'emergency' ? 'rgba(239,68,68,0.15)' : msg.severity === 'moderate' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                            color: msg.severity === 'emergency' ? '#f87171' : msg.severity === 'moderate' ? '#fbbf24' : '#34d399',
                            border: `1px solid ${msg.severity === 'emergency' ? 'rgba(239,68,68,0.3)' : msg.severity === 'moderate' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                        }}>
                            {msg.severity === 'emergency' ? '🚨 EMERGENCY' : msg.severity === 'moderate' ? '⚠️ MODERATE' : '✅ MILD'} — {msg.diagnosis}
                        </span>
                    </div>
                )}
                {!isDoctor && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right', marginRight: 4 }}>You • {msg.time}</div>}
            </div>
        </div>
    );
}

export default function PatientSymptoms() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [lang, setLang] = useState('en');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [stage, setStage] = useState(STAGES.GREETING);
    const [currentCondition, setCurrentCondition] = useState(null);
    const [followUpIndex, setFollowUpIndex] = useState(0);
    const [diagnosed, setDiagnosed] = useState(false);
    const [lastDiag, setLastDiag] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const getTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const addDoctorMsg = (text, extras = {}) => {
        setMessages(m => [...m, { id: Date.now(), sender: 'doctor', text, time: getTime(), ...extras }]);
    };

    const startConversation = (language) => {
        const greets = GREETINGS[language];
        const greeting = greets[Math.floor(Math.random() * greets.length)];
        setMessages([{ id: 1, sender: 'doctor', text: greeting, time: getTime() }]);
        setStage(STAGES.CHIEF_COMPLAINT);
        setCurrentCondition(null);
        setFollowUpIndex(0);
        setDiagnosed(false);
        setLastDiag(null);
    };

    useEffect(() => { startConversation(lang); }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;
        setInput('');
        setMessages(m => [...m, { id: Date.now(), sender: 'user', text, time: getTime() }]);
        setTyping(true);

        await new Promise(r => setTimeout(r, TYPING_DELAY));
        setTyping(false);

        if (stage === STAGES.CHIEF_COMPLAINT) {
            const match = matchCondition(text);
            if (match) {
                setCurrentCondition(match);
                const fups = match.followUps[lang];
                setFollowUpIndex(1);
                setStage(STAGES.FOLLOW_UP);
                addDoctorMsg(fups[0]);
            } else {
                addDoctorMsg(FALLBACK[lang](user?.name?.split(' ')[0]));
            }
        } else if (stage === STAGES.FOLLOW_UP && currentCondition) {
            const fups = currentCondition.followUps[lang];
            if (followUpIndex < fups.length) {
                addDoctorMsg(fups[followUpIndex]);
                setFollowUpIndex(f => f + 1);
            } else {
                // Deliver diagnosis
                const diag = currentCondition.diagnosis[lang];
                setStage(STAGES.DIAGNOSIS);
                setDiagnosed(true);
                setLastDiag(diag);
                const prefix = lang === 'en'
                    ? `Thank you for answering those questions, **${user?.name?.split(' ')[0] || 'friend'}**. Based on my assessment:\n\n---\n\n`
                    : `கேள்விகளுக்கு பதில் அளித்தமைக்கு நன்றி, **${user?.name?.split(' ')[0] || 'நண்பரே'}**. என் மதிப்பீட்டின் அடிப்படையில்:\n\n---\n\n`;
                addDoctorMsg(prefix + diag.message, {
                    severity: diag.severity,
                    diagnosis: diag.diagnosis,
                    pills: diag.medicines,
                });
                // Post-diagnosis follow-up
                setTimeout(() => {
                    const post = POST_DIAGNOSIS[lang];
                    addDoctorMsg(post[Math.floor(Math.random() * post.length)]);
                }, 2000);
            }
        } else if (stage === STAGES.DIAGNOSIS) {
            // Continue conversation after diagnosis
            const lower = text.toLowerCase();
            if (lower.includes('video') || lower.includes('doctor') || lower.includes('consult') || lower.includes('ஆலோசனை') || lower.includes('மருத்துவர்')) {
                addDoctorMsg(lang === 'en'
                    ? "Sure! I'm redirecting you to our Video Consultation page where you can connect with a doctor right now. 📹"
                    : "சரி! நான் உங்களை Video ஆலோசனை பக்கத்திற்கு அழைத்துச் செல்கிறேன். 📹"
                );
                setTimeout(() => navigate('/patient/video'), 1500);
            } else if (lower.includes('yes') || lower.includes('another') || lower.includes('more') || lower.includes('ஆம்') || lower.includes('வேறு')) {
                setStage(STAGES.CHIEF_COMPLAINT);
                setCurrentCondition(null);
                addDoctorMsg(lang === 'en'
                    ? "Of course! Please tell me about your other symptoms."
                    : "நிச்சயமாக! மற்ற அறிகுறிகளை கூறுங்கள்."
                );
            } else if (lower.includes('no') || lower.includes('thank') || lower.includes('நன்றி') || lower.includes('இல்லை')) {
                addDoctorMsg(lang === 'en'
                    ? "You're welcome! Take care and get well soon. 💙 Remember to follow the recommendations and consult a doctor if symptoms worsen. Stay healthy!"
                    : "வருக! விரைவில் குணமடைவீர்கள். 💙 பரிந்துரைகளை பின்பற்றுங்கள். அறிகுறிகள் மோசமடைந்தால் மருத்துவரை சந்திக்கவும். ஆரோக்கியமாக இருங்கள்!"
                );
            } else {
                const match = matchCondition(text);
                if (match) {
                    setCurrentCondition(match);
                    setFollowUpIndex(1);
                    setStage(STAGES.FOLLOW_UP);
                    addDoctorMsg(match.followUps[lang][0]);
                } else {
                    addDoctorMsg(lang === 'en'
                        ? "I understand. Is there anything specific about your condition or treatment you'd like me to explain further?"
                        : "புரிகிறது. உங்கள் நிலை அல்லது சிகிச்சை பற்றி இன்னும் விளக்கம் வேண்டுமா?"
                    );
                }
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const switchLang = () => {
        const newLang = lang === 'en' ? 'ta' : 'en';
        setLang(newLang);
        startConversation(newLang);
    };

    const severity = lastDiag?.severity;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 16px rgba(99,102,241,0.5)' }}>🩺</div>
                        <div>
                            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 17 }}>Dr. ARIA <span style={{ fontSize: 11, fontWeight: 400, color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '2px 8px', marginLeft: 6 }}>● Online</span></div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI Medical Assistant • DocSpot Health</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={switchLang} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Globe size={14} /> {lang === 'en' ? 'தமிழ்' : 'English'}
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => startConversation(lang)} title="Reset conversation">
                            <RefreshCw size={14} />
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/patient/video')}>
                            <Video size={14} /> See Doctor
                        </button>
                    </div>
                </div>

                {/* Diagnosis Banner */}
                {diagnosed && lastDiag && (
                    <div style={{
                        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
                        background: severity === 'emergency' ? 'rgba(239,68,68,0.12)' : severity === 'moderate' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.08)',
                        borderBottom: `1px solid ${severity === 'emergency' ? 'rgba(239,68,68,0.3)' : severity === 'moderate' ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.2)'}`,
                    }}>
                        {severity === 'emergency' ? <AlertTriangle size={16} color="#f87171" /> : <Pill size={16} color={severity === 'moderate' ? '#fbbf24' : '#34d399'} />}
                        <span style={{ fontSize: 13, fontWeight: 600, color: severity === 'emergency' ? '#f87171' : severity === 'moderate' ? '#fbbf24' : '#34d399' }}>
                            Assessment: {lastDiag.diagnosis}
                        </span>
                        {severity === 'emergency' && (
                            <a href="tel:108" style={{ marginLeft: 'auto' }}>
                                <button className="btn btn-danger btn-sm"><Phone size={13} /> Call 108</button>
                            </a>
                        )}
                        {severity === 'moderate' && (
                            <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }} onClick={() => navigate('/patient/video')}>
                                <Video size={13} /> Book Consult
                            </button>
                        )}
                    </div>
                )}

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    {messages.map(msg => <Message key={msg.id} msg={msg} lang={lang} />)}
                    {typing && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Symptom Chips */}
                <div style={{ padding: '8px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0, background: 'var(--bg-card)' }}>
                    {(lang === 'en'
                        ? ['I have fever', 'Headache', 'Stomach ache', 'Chest pain', 'Cough & cold', 'Body pain', 'Skin rash', 'Breathless', 'Anxiety', 'Eye pain']
                        : ['காய்ச்சல் உள்ளது', 'தலைவலி', 'வயிற்று வலி', 'மார்பு வலி', 'இருமல் சளி', 'உடல்வலி', 'தோல் தடிப்பு', 'சுவாசிக்க கஷ்டம்', 'மன அழுத்தம்', 'கண் வலி']
                    ).map(chip => (
                        <button key={chip} onClick={() => { setInput(chip); inputRef.current?.focus(); }}
                            style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 20, fontSize: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.target.style.background = 'rgba(99,102,241,0.1)'; e.target.style.borderColor = 'rgba(99,102,241,0.4)'; e.target.style.color = 'var(--primary-light)'; }}
                            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}>
                            {chip}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
                    <textarea ref={inputRef} className="form-input" rows={1} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                        placeholder={lang === 'en' ? 'Describe your symptoms... (Press Enter to send)' : 'உங்கள் அறிகுறிகளை விவரிக்கவும்... (Enter அழுத்தவும்)'}
                        style={{ flex: 1, resize: 'none', borderRadius: 12, fontSize: 14, padding: '12px 16px', maxHeight: 120, overflowY: 'auto' }}
                    />
                    <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim()} style={{ padding: '12px 20px', borderRadius: 12, flexShrink: 0 }}>
                        <Send size={18} />
                    </button>
                </div>
            </main>
        </div>
    );
}
