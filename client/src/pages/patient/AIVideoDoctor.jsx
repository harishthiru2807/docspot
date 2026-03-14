import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Mic, MicOff, Volume2, VolumeX, Globe, RefreshCw, Phone } from 'lucide-react';
import { matchCondition, GREETINGS, FALLBACK, POST_DIAGNOSIS, STAGES } from '../../data/aiDoctorEngine';
import toast from 'react-hot-toast';

/* ── Mouth Lip-Sync Overlay ────────────────────────────────── */
function LipSyncOverlay({ active }) {
    const [frame, setFrame] = useState(0);
    const mouths = [
        'M 50 62 Q 65 70 80 62',
        'M 48 60 Q 65 76 82 60',
        'M 52 61 Q 65 72 78 61',
        'M 52 63 Q 65 67 78 63',
    ];

    useEffect(() => {
        if (!active) { setFrame(3); return; }
        const id = setInterval(() => setFrame(f => (f + 1) % 3), 120);
        return () => clearInterval(id);
    }, [active]);

    return (
        <svg
            viewBox="0 0 130 130"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: active ? 1 : 0,
                transition: 'opacity 0.3s',
            }}
        >
            <defs>
                <clipPath id="mouthArea">
                    <ellipse cx="65" cy="65" rx="20" ry="10" />
                </clipPath>
                <filter id="softBlend">
                    <feGaussianBlur stdDeviation="0.5" />
                </filter>
            </defs>
            <ellipse
                cx="65" cy="65" rx={active ? 14 : 10} ry={active ? 6 : 2}
                fill="rgba(180,110,90,0.55)"
                filter="url(#softBlend)"
                style={{ transition: 'all 0.1s' }}
            />
            <path
                d={`M 51 ${active ? 61 : 63} Q 65 ${active ? 57 : 61} 79 ${active ? 61 : 63}`}
                fill="rgba(140,70,60,0.5)"
                filter="url(#softBlend)"
                style={{ transition: 'all 0.1s' }}
            />
            <path
                d={mouths[frame]}
                fill="none"
                stroke="rgba(140,70,60,0.6)"
                strokeWidth="2"
                filter="url(#softBlend)"
                style={{ transition: 'all 0.08s' }}
            />
        </svg>
    );
}

/* ── Doctor Avatar with real photo + lip-sync ─────────────── */
function DoctorAvatar({ isTalking, isListening }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Outer glow ring */}
            <div style={{
                position: 'relative',
                borderRadius: '50%',
                padding: 4,
                background: isTalking
                    ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    : isListening
                        ? 'linear-gradient(135deg, var(--accent), var(--primary-light))'
                        : 'linear-gradient(135deg, var(--border), var(--border-bright))',
                boxShadow: isTalking
                    ? '0 0 40px rgba(37, 99, 235, 0.3), 0 0 80px rgba(37, 99, 235, 0.1)'
                    : isListening
                        ? '0 0 30px rgba(16, 185, 129, 0.2)'
                        : '0 0 20px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.4s ease',
                animation: isTalking ? 'doctorGlow 1.2s ease-in-out infinite alternate' : 'none',
            }}>
                {/* Photo container */}
                <div style={{
                    width: 220,
                    height: 220,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'var(--bg-base)',
                    border: '4px solid var(--bg-surface)',
                    animation: isTalking ? 'subtleBob 0.5s ease-in-out infinite alternate' : 'none',
                }}>
                    <img
                        src="/assets/dr_aria.jpg"
                        alt="Dr. ARIA"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            display: 'block',
                            filter: isTalking ? 'brightness(1.02) saturate(1.05)' : 'none',
                            transition: 'filter 0.3s',
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        left: '30%',
                        top: '57%',
                        width: '40%',
                        height: '18%',
                        pointerEvents: 'none',
                    }}>
                        <LipSyncOverlay active={isTalking} />
                    </div>
                    {isListening && !isTalking && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(circle at 50% 60%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                            animation: 'listenPulse 1.5s ease-in-out infinite',
                        }} />
                    )}
                    {isTalking && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'radial-gradient(circle at 50% 65%, rgba(37, 99, 235, 0.08) 0%, transparent 65%)',
                            animation: 'speakGlow 0.6s ease-in-out infinite alternate',
                        }} />
                    )}
                </div>
            </div>

            {/* Name plate */}
            <div style={{
                marginTop: 18, textAlign: 'center',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 14, padding: '10px 24px',
                boxShadow: 'var(--shadow-md)',
            }}>
                <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>Dr. ARIA</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>AI Medical Officer · DocSpot Health</div>
            </div>

            {/* Live status badge */}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600 }}>
                <div style={{
                    width: 9, height: 9, borderRadius: '50%',
                    background: isListening ? 'var(--accent)' : isTalking ? 'var(--primary)' : 'var(--text-muted)',
                    animation: (isListening || isTalking) ? 'dotPulse 1s ease infinite' : 'none',
                    boxShadow: isListening ? '0 0 8px var(--accent)' : isTalking ? '0 0 8px var(--primary)' : 'none',
                }} />
                <span style={{ color: isListening ? 'var(--accent)' : isTalking ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {isListening ? 'Listening…' : isTalking ? 'Speaking…' : 'Ready'}
                </span>
            </div>
        </div>
    );
}

/* ── Sound wave bars ─────────────────────────────────────────  */
function SoundWave({ active, color = 'var(--primary)' }) {
    const bars = [3, 6, 9, 7, 4, 8, 5, 9, 6, 4, 8, 5, 7];
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 40, justifyContent: 'center' }}>
            {bars.map((h, i) => (
                <div key={i} style={{
                    width: 4, borderRadius: 2,
                    background: color,
                    height: active ? `${h * 3}px` : '4px',
                    animation: active ? `wave 0.8s ease-in-out ${i * 0.06}s infinite alternate` : 'none',
                    transition: 'height 0.3s',
                    opacity: active ? 0.9 : 0.3,
                }} />
            ))}
        </div>
    );
}

/* ── Transcript bubble ───────────────────────────────────────  */
function TranscriptBubble({ who, text, time }) {
    const isAI = who === 'ai';
    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12, flexDirection: isAI ? 'row' : 'row-reverse' }}>
            <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
                border: `2px solid ${isAI ? 'var(--primary-light)' : 'var(--border)'}`,
                boxShadow: 'var(--shadow-sm)',
            }}>
                {isAI
                    ? <img src="/assets/dr_aria.jpg" alt="ARIA" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🧑</div>
                }
            </div>
            <div style={{ maxWidth: '80%' }}>
                <div style={{
                    padding: '10px 14px',
                    borderRadius: isAI ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    background: isAI ? 'rgba(37, 99, 235, 0.05)' : 'var(--bg-surface)',
                    border: `1px solid ${isAI ? 'rgba(37, 99, 235, 0.1)' : 'var(--border)'}`,
                    color: 'var(--text-primary)',
                    fontSize: 13, lineHeight: 1.6,
                    boxShadow: 'var(--shadow-sm)',
                }}>{text}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, textAlign: isAI ? 'left' : 'right', padding: '0 4px' }}>
                    {isAI ? 'Dr. ARIA' : 'You'} • {time}
                </div>
            </div>
        </div>
    );
}

/* ── Main Component ──────────────────────────────────────────  */
export default function AIVideoDoctor() {
    const { user } = useAuth();
    const [lang, setLang] = useState('en');
    const [isListening, setIsListening] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [liveText, setLiveText] = useState('');
    const [sessionActive, setSessionActive] = useState(false);
    const [stage, setStage] = useState(STAGES.CHIEF_COMPLAINT);
    const [currentCondition, setCurrentCondition] = useState(null);
    const [followUpIndex, setFollowUpIndex] = useState(0);
    const [supported, setSupported] = useState(true);
    const [typedInput, setTypedInput] = useState('');

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const scrollRef = useRef(null);

    const getTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const getFirstName = () => user?.name ? user.name.split(' ')[0] : (lang === 'ta' ? 'நண்பரே' : 'friend');

    const speak = useCallback((text, onEnd) => {
        if (isMuted || !synthRef.current) { onEnd?.(); return; }
        synthRef.current.cancel();

        const plain = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,3} /g, '').replace(/\n/g, ' ');
        const utter = new SpeechSynthesisUtterance(plain.substring(0, 700));

        // Use 'ta-IN' for Tamil, else default to 'en-IN'
        utter.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
        utter.pitch = 1.0;
        utter.rate = lang === 'ta' ? 0.9 : 1.0;
        utter.volume = 1;

        const voices = synthRef.current.getVoices();
        if (voices.length > 0) {
            // Find specific Tamil voice, or any voice starting with 'ta'
            let selectedVoice = voices.find(v => v.lang === 'ta-IN' || v.lang === 'ta_IN');
            if (!selectedVoice && lang === 'ta') {
                selectedVoice = voices.find(v => v.lang.startsWith('ta'));
            }

            // For English
            if (!selectedVoice && lang === 'en') {
                selectedVoice = voices.find(v => v.lang.startsWith('en'));
            }

            if (selectedVoice) {
                utter.voice = selectedVoice;
            } else if (lang === 'ta') {
                console.warn('No Tamil voice found on this system.');
                // Show a one-time toast if Tamil voice is missing
                if (!window.hasNotifiedMissingTamilVoice) {
                    toast.info('Tamil voice output is not installed on your system. Dr. ARIA will respond in text.');
                    window.hasNotifiedMissingTamilVoice = true;
                }
            }
        }

        utter.onstart = () => setIsTalking(true);
        utter.onend = () => { setIsTalking(false); onEnd?.(); };
        utter.onerror = (e) => {
            console.error('Speech synthesis error:', e);
            setIsTalking(false);
            onEnd?.();
        };

        synthRef.current.speak(utter);
    }, [isMuted, lang]);

    const aiSay = useCallback((text, cb) => {
        setTranscript(t => [...t, { who: 'ai', text, time: getTime() }]);
        speak(text, cb);
    }, [speak]);

    const startSession = useCallback(() => {
        setSessionActive(true);
        setTranscript([]);
        setStage(STAGES.CHIEF_COMPLAINT);
        setCurrentCondition(null);
        setFollowUpIndex(0);
        setTimeout(() => aiSay(GREETINGS[lang][0]), 400);
    }, [lang, aiSay]);

    const endSession = () => {
        synthRef.current?.cancel();
        recognitionRef.current?.stop();
        setIsListening(false);
        setIsTalking(false);
        setSessionActive(false);
        setLiveText('');
    };

    const toggleMic = () => {
        if (isTalking) { toast('Please wait for Dr. ARIA to finish speaking'); return; }
        if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
        else startListening();
    };

    const startListening = () => {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) { setSupported(false); return; }

        if (!navigator.onLine) {
            toast.error('You are offline. Voice recognition requires internet.');
            return;
        }

        // Clean up any existing instances first
        if (recognitionRef.current) {
            try {
                recognitionRef.current.abort();
            } catch (e) {
                console.error('Error aborting previous recognition:', e);
            }
        }

        const rec = new SpeechRec();
        rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
        rec.continuous = false;
        rec.interimResults = true;

        rec.onstart = () => setIsListening(true);
        rec.onresult = (e) => {
            let interim = ''; let final = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) final += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            setLiveText(final || interim);
            if (final) handleUserInput(final.trim());
        };
        rec.onerror = (e) => {
            setIsListening(false);
            console.error('Speech recognition error:', e.error);

            const errorMessages = {
                'not-allowed': 'Microphone access denied. Please allow mic permission in your browser.',
                'network': 'Network error. The browser cannot reach the voice processing server. Please check your internet or try a different browser (Chrome/Edge).',
                'no-speech': null,
                'audio-capture': 'No microphone was found. Check your hardware.',
                'aborted': null,
                'busy': 'Voice system is busy. Please wait a moment.'
            };

            const msg = errorMessages[e.error];
            if (msg) toast.error(msg);
            else if (e.error !== 'no-speech' && e.error !== 'aborted') {
                toast.error(`Voice error (${e.error}). Please try again.`);
            }
        };
        rec.onend = () => { setIsListening(false); setLiveText(''); };
        recognitionRef.current = rec;

        try {
            rec.start();
        } catch (e) {
            console.error('Error starting recognition:', e);
            toast.error('Could not start voice recognition. Please refresh.');
        }
    };

    const handleUserInput = (text) => {
        if (!text) return;
        setLiveText('');
        setTranscript(t => [...t, { who: 'user', text, time: getTime() }]);

        setTimeout(() => {
            try {
                if (stage === STAGES.CHIEF_COMPLAINT) {
                    const match = matchCondition(text);
                    if (match) {
                        setCurrentCondition(match);
                        setFollowUpIndex(1);
                        setStage(STAGES.FOLLOW_UP);
                        aiSay(match.followUps[lang][0]);
                    } else {
                        aiSay(FALLBACK[lang](getFirstName()));
                    }
                } else if (stage === STAGES.FOLLOW_UP && currentCondition) {
                    const fups = currentCondition.followUps[lang];
                    if (followUpIndex < fups.length) {
                        aiSay(fups[followUpIndex]);
                        setFollowUpIndex(f => f + 1);
                    } else {
                        const diag = currentCondition.diagnosis[lang];
                        setStage(STAGES.DIAGNOSIS);
                        const prefix = lang === 'en'
                            ? `Thank you, ${getFirstName()}. Based on my assessment: `
                            : `நன்றி ${getFirstName()}. என் மதிப்பீட்டின் படி: `;
                        aiSay(prefix + diag.message, () => {
                            setTimeout(() => aiSay(POST_DIAGNOSIS[lang][0]), 1000);
                        });
                    }
                } else if (stage === STAGES.DIAGNOSIS) {
                    const lower = text.toLowerCase();
                    if (lower.includes('yes') || lower.includes('ஆம்') || lower.includes('more') || lower.includes('வேறு')) {
                        setStage(STAGES.CHIEF_COMPLAINT);
                        setCurrentCondition(null);
                        aiSay(lang === 'en' ? 'Of course! Please tell me about your other symptoms.' : 'நிச்சயமாக! மற்ற அறிகுறிகளை கூறுங்கள்.');
                    } else if (lower.includes('no') || lower.includes('இல்லை') || lower.includes('thank') || lower.includes('நன்றி')) {
                        aiSay(lang === 'en'
                            ? 'You are welcome! Take care and get well soon. Stay healthy!'
                            : 'வரவேற்கிறேன்! ஆரோக்கியமாக இருங்கள்!',
                            () => setTimeout(endSession, 2200));
                    } else {
                        const match = matchCondition(text);
                        if (match) {
                            setCurrentCondition(match); setFollowUpIndex(1); setStage(STAGES.FOLLOW_UP);
                            aiSay(match.followUps[lang][0]);
                        } else {
                            aiSay(lang === 'en' ? "I didn't quite get that. Do you have any other symptoms or questions?" : "மன்னிக்கவும், எனக்கு புரியவில்லை. உங்களுக்கு வேறு அறிகுறிகள் அல்லது கேள்விகள் உள்ளதா?");
                        }
                    }
                }
            } catch (error) {
                console.error('AI Logic Error:', error);
                toast.error(lang === 'en' ? 'An error occurred. Please try again.' : 'மன்னிக்கவும், ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.');
                aiSay(lang === 'en' ? "I encountered a small error. Can you repeat that?" : "என்னிடம் ஒரு சிறிய பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் கூறவும்?");
            }
        }, 400);
    };

    useEffect(() => {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec || !window.speechSynthesis) setSupported(false);
        return () => { synthRef.current?.cancel(); recognitionRef.current?.stop(); };
    }, []);

    useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [transcript]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
                <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-light)', boxShadow: 'var(--shadow-sm)' }}>
                            <img src="/assets/dr_aria.jpg" alt="ARIA" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                        </div>
                        <div>
                            <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
                                Dr. ARIA <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 20, padding: '2px 8px', marginLeft: 6 }}>● Active</span>
                            </h1>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>AI Medical Officer · DocSpot Health</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--border)' }} onClick={() => { endSession(); setLang(l => l === 'en' ? 'ta' : 'en'); }}>
                            <Globe size={14} /> {lang === 'en' ? 'தமிழ்' : 'English'}
                        </button>
                        {sessionActive && <button className="btn btn-danger btn-sm" onClick={endSession}><Phone size={14} /> End Consultation</button>}
                    </div>
                </div>

                {!supported && (
                    <div style={{ margin: 16, padding: 14, borderRadius: 12, background: '#fffbeb', border: '1px solid #fcd34d', color: '#b45309', fontSize: 13 }}>
                        ⚠️ Use <strong>Chrome</strong> or <strong>Edge</strong> for best voice support.
                    </div>
                )}

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', overflow: 'hidden' }}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: 32, borderRight: '1px solid var(--border)', position: 'relative',
                        background: 'radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.03) 0%, transparent 70%)'
                    }}>
                        {!sessionActive ? (
                            <div style={{ textAlign: 'center', maxWidth: 420 }}>
                                <div style={{
                                    width: 200, height: 200, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 24px',
                                    border: '4px solid var(--bg-surface)',
                                    boxShadow: 'var(--shadow-lg)',
                                }}>
                                    <img src="/assets/dr_aria.jpg" alt="Dr. ARIA" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                                </div>
                                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, marginBottom: 8, color: 'var(--text-primary)' }}>Meet Dr. ARIA</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 8, lineHeight: 1.7 }}>
                                    Your AI doctor is ready. Describe your symptoms naturally — Dr. ARIA will ask follow-up questions and provide a complete medical assessment.
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 28 }}>
                                    🎤 Microphone required &nbsp;•&nbsp; 🔊 Responds in {lang === 'en' ? 'English' : 'Tamil'}
                                </p>
                                <button className="btn btn-primary btn-lg" style={{ fontSize: 17, padding: '16px 44px', boxShadow: 'var(--shadow-lg)' }} onClick={startSession}>
                                    📞 Start Consultation
                                </button>
                                <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    {(lang === 'en'
                                        ? ['Fever', 'Headache', 'Chest Pain', 'Cough', 'Stomach Pain']
                                        : ['காய்ச்சல்', 'தலைவலி', 'மார்பு வலி', 'இருமல்', 'வயிற்று வலி']
                                    ).map(s => (
                                        <span key={s} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)' }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 380 }}>
                                <DoctorAvatar isTalking={isTalking} isListening={isListening} />
                                <div style={{ marginTop: 24, width: '100%' }}>
                                    <SoundWave active={isTalking} color="var(--primary)" />
                                </div>
                                {liveText && (
                                    <div style={{ marginTop: 12, padding: '10px 18px', borderRadius: 12, background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)', fontSize: 14, color: 'var(--primary)', textAlign: 'center', fontStyle: 'italic', maxWidth: 340, boxShadow: 'var(--shadow-sm)' }}>
                                        🎤 "{liveText}"
                                    </div>
                                )}

                                {/* Text Input Fallback */}
                                <div style={{ marginTop: 28, width: '100%', display: 'flex', gap: 8 }}>
                                    <input
                                        type="text"
                                        value={typedInput}
                                        onChange={(e) => setTypedInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (handleUserInput(typedInput), setTypedInput(''))}
                                        placeholder="Or type your symptoms here..."
                                        style={{
                                            flex: 1,
                                            padding: '12px 18px',
                                            borderRadius: 24,
                                            background: 'var(--bg-surface)',
                                            border: '1.5px solid var(--border)',
                                            fontSize: 14,
                                            color: 'var(--text-primary)',
                                            boxShadow: 'var(--shadow-sm)',
                                        }}
                                    />
                                    <button
                                        onClick={() => { handleUserInput(typedInput); setTypedInput(''); }}
                                        disabled={!typedInput.trim()}
                                        className="btn btn-primary"
                                        style={{ width: 50, height: 50, borderRadius: '50%', padding: 0 }}
                                    >
                                        ➔
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: 18, marginTop: 24, alignItems: 'center' }}>
                                    <button onClick={() => setIsMuted(m => !m)} style={{
                                        width: 50, height: 50, borderRadius: '50%',
                                        background: isMuted ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)',
                                        border: `1.5px solid ${isMuted ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)'}`,
                                        color: isMuted ? 'var(--danger)' : 'var(--text-secondary)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)',
                                    }}>
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <button onClick={toggleMic} style={{
                                        width: 72, height: 72, borderRadius: '50%',
                                        background: isListening ? 'rgba(16, 185, 129, 0.1)' : 'var(--grad-primary)',
                                        border: `2px solid ${isListening ? 'var(--accent)' : 'transparent'}`,
                                        color: isListening ? 'var(--accent)' : 'white', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: isListening ? '0 0 28px rgba(16, 185, 129, 0.25)' : 'var(--shadow-lg)',
                                        animation: isListening ? 'listenPulse 1.5s ease infinite' : 'none',
                                        transition: 'all 0.3s',
                                    }}>
                                        {isListening ? <Mic size={30} /> : <MicOff size={26} />}
                                    </button>
                                    <button onClick={() => { endSession(); setTimeout(() => startSession(), 150); }} style={{
                                        width: 50, height: 50, borderRadius: '50%',
                                        background: 'var(--bg-surface)', border: '1.5px solid var(--border)',
                                        color: 'var(--text-secondary)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)',
                                    }}>
                                        <RefreshCw size={20} />
                                    </button>
                                </div>
                                <p style={{ marginTop: 14, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                                    {isListening ? '✅ Listening — speak clearly and naturally'
                                        : isTalking ? '🔊 Dr. ARIA is speaking…'
                                            : '👆 Tap the mic button to speak'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fcfdfe' }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', flexShrink: 0 }}>
                            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>📋 Consultation Notes</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{transcript.length} exchanges</div>
                        </div>

                        <div ref={scrollRef} className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
                            {transcript.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                                    <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
                                    <p style={{ fontSize: 14 }}>Conversation will appear here</p>
                                    <p style={{ fontSize: 12, marginTop: 6 }}>Start a consultation to begin</p>
                                </div>
                            ) : (
                                transcript.map((m, i) => <TranscriptBubble key={i} {...m} />)
                            )}
                        </div>

                        {sessionActive && (
                            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', flexShrink: 0 }}>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Quick Responses</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                    {(lang === 'en'
                                        ? ['I have fever', 'Headache', 'Chest pain', 'Yes', 'No thank you', 'Stomach pain']
                                        : ['காய்ச்சல் உள்ளது', 'தலைவலி', 'மார்பு வலி', 'ஆம்', 'இல்லை நன்றி', 'வயிற்று வலி']
                                    ).map(s => (
                                        <button key={s} onClick={() => handleUserInput(s)}
                                            style={{ padding: '6px 12px', borderRadius: 20, fontSize: 11, border: '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500 }}
                                            onMouseEnter={e => { e.target.style.background = 'rgba(37, 99, 235, 0.05)'; e.target.style.borderColor = 'var(--primary-light)'; e.target.style.color = 'var(--primary)'; }}
                                            onMouseLeave={e => { e.target.style.background = 'var(--bg-base)'; e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main >
        </div >
    );
}
