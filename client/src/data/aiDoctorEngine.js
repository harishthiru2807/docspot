// ============================================================
//  DocSpot AI Doctor Engine — v2.0
//  Bilingual (Tamil + English), Conversational, 50+ conditions
// ============================================================

export const STAGES = {
    GREETING: 'greeting',
    CHIEF_COMPLAINT: 'chief_complaint',
    FOLLOW_UP: 'follow_up',
    DURATION: 'duration',
    ASSOCIATED: 'associated',
    HISTORY: 'history',
    DIAGNOSIS: 'diagnosis',
};

// ─── Greeting messages ───────────────────────────────────────
export const GREETINGS = {
    en: [
        "Hello! I'm **Dr. ARIA** — DocSpot's AI Doctor. 👋\n\nI'll ask you a few questions to understand your health concern. Please be as detailed as possible.\n\n🩺 *What is your main health problem today?*",
        "Welcome! I'm **Dr. ARIA**, your AI health assistant. 😊\n\nI'm here to help assess your symptoms carefully. Remember, for emergencies always call **108**.\n\n*Please describe what you're feeling right now.*",
    ],
    ta: [
        "வணக்கம்! நான் **டாக்டர் ARIA** — DocSpot AI மருத்துவர். 👋\n\nநான் உங்கள் உடல் நலனை மதிப்பிட சில கேள்விகள் கேட்பேன். தயவுசெய்து விரிவாக கூறுங்கள்.\n\n🩺 *இன்று உங்கள் முக்கிய உடல் பிரச்சனை என்ன?*",
        "வாருங்கள்! நான் **டாக்டர் ARIA**, உங்கள் AI உடல்நல உதவியாளர். 😊\n\nகவலைப்படாதீர்கள், நான் உங்களுக்கு உதவுவேன். அவசரநிலைக்கு **108** அழையுங்கள்.\n\n*இப்போது எப்படி உணர்கிறீர்கள் என்று கூறுங்கள்.*",
    ],
};

// ─── Knowledge Base: 50+ conditions ─────────────────────────
export const KB = [
    // FEVER
    {
        id: 'fever',
        keywords: ['fever', 'temperature', 'hot', 'chills', 'shivering', 'sweating', 'feverish', 'காய்ச்சல்', 'வெப்பம்', 'நடுக்கம்', 'வியர்வை', 'சூடு'],
        followUps: {
            en: ["How long have you had the fever? Is it constant or does it come and go?", "Have you measured your temperature? What was it?", "Any other symptoms along with fever — headache, body ache, cough?"],
            ta: ["எத்தனை நாட்களாக காய்ச்சல் உள்ளது? தொடர்ந்து இருக்கிறதா அல்லது வந்து போகிறதா?", "காய்ச்சல் எவ்வளவு இருக்கிறது? (°F அல்லது °C)", "காய்ச்சலுடன் தலைவலி, உடல்வலி, இருமல் ஏதாவது உள்ளதா?"],
        },
        diagnosis: {
            en: {
                message: "Based on your symptoms, I suspect you have a **Viral Fever**. This is very common and usually resolves in 3–5 days.\n\n**Likely Cause:** Viral infection (influenza, dengue, or common cold virus)\n\n**My Recommendations:**\n• Rest completely for 2–3 days\n• Drink at least 2–3 liters of water/ORS daily\n• Take **Paracetamol 500mg** every 6 hours (max 4 doses/day) for temperature\n• Eat light foods — rice kanji, soups, fruits\n• Sponge with lukewarm water if temp exceeds 102°F\n\n⚠️ **See a doctor immediately if:**\n• Temperature exceeds 104°F\n• Fever lasts more than 5 days\n• You develop a rash or bleeding\n• Severe headache or stiff neck",
                diagnosis: 'Viral Fever',
                severity: 'moderate',
                action: 'medication',
                medicines: ['Paracetamol 500mg', 'ORS Solution'],
            },
            ta: {
                message: "உங்கள் அறிகுறிகளின் படி, நீங்கள் **வைரல் காய்ச்சல்** அனுபவிக்கிறீர்கள் என்று நான் நம்புகிறேன். இது மிகவும் சாதாரணமானது, 3–5 நாட்களில் சரியாகும்.\n\n**சாத்தியமான காரணம்:** வைரல் தொற்று (இன்ஃப்ளூயன்சா, டெங்கு, அல்லது ஜலதோஷம்)\n\n**என் பரிந்துரைகள்:**\n• 2–3 நாட்கள் சம்பூர்ண ஓய்வு எடுங்கள்\n• நாளொன்றுக்கு குறைந்தது 2–3 லிட்டர் தண்ணீர்/ORS குடிக்கவும்\n• காய்ச்சலுக்கு **Paracetamol 500mg** ஒவ்வொரு 6 மணி நேரத்திற்கும் எடுக்கவும்\n• இலகுவான உணவுகள் — கஞ்சி, சூப், பழங்கள் சாப்பிடவும்\n• 102°F அதிகமானால் வெதுவெதுப்பான தண்ணீரில் துடைக்கவும்\n\n⚠️ **உடனே மருத்துவரை சந்திக்கவும் இவை இருந்தால்:**\n• 104°F அதிகமான வெப்பம்\n• 5 நாட்களுக்கு மேல் காய்ச்சல்\n• தடிப்பு அல்லது இரத்தப்போக்கு\n• கடுமையான தலைவலி",
                diagnosis: 'வைரல் காய்ச்சல்',
                severity: 'moderate',
                action: 'medication',
                medicines: ['Paracetamol 500mg', 'ORS கரைசல்'],
            },
        },
    },

    // HEADACHE
    {
        id: 'headache',
        keywords: ['headache', 'head pain', 'migraine', 'head ache', 'throbbing head', 'தலைவலி', 'தலை வலி', 'மாயக்கிறை'],
        followUps: {
            en: ["Where exactly is the pain — front, back, sides, or whole head?", "Is it a throbbing pain, pressure, or sharp pain?", "Does the headache come with nausea, light sensitivity, or blurred vision?"],
            ta: ["வலி எங்கே இருக்கிறது — முன்பக்கம், பின்பக்கம், பக்கவாட்டில், அல்லது முழு தலையிலும்?", "துடிக்கும் வலியா, அழுத்தமா, அல்லது கூர்மையான வலியா?", "தலைவலியுடன் குமட்டல், வெளிச்சத்தில் அசௌகரியம், அல்லது மங்கிய பார்வை ஏதாவது உள்ளதா?"],
        },
        diagnosis: {
            en: {
                message: "Based on your description, this sounds like a **Tension Headache**, which is the most common type.\n\n**Possible Causes:**\n• Stress, anxiety, or muscle tension\n• Poor posture (especially screen use)\n• Dehydration or skipped meals\n• Sleep deprivation\n• Eye strain\n\n**My Recommendations:**\n• Take **Ibuprofen 400mg** or **Paracetamol 500mg** with food\n• Rest in a quiet, dark room for 30 minutes\n• Drink 2 glasses of water immediately\n• Gentle neck and shoulder stretches\n• Cold/warm compress on forehead\n• Reduce screen time today\n\n⚠️ **Seek emergency care if:**\n• Sudden worst headache of your life (thunderclap)\n• Headache with fever + stiff neck (may be meningitis)\n• Vision loss, weakness, or speech problems\n• Head injury related",
                diagnosis: 'Tension Headache',
                severity: 'mild',
                action: 'normal',
                medicines: ['Ibuprofen 400mg', 'Paracetamol 500mg'],
            },
            ta: {
                message: "உங்கள் விவரணையின் அடிப்படையில், இது **மன அழுத்த தலைவலி** போல் தெரிகிறது — இது மிகவும் சாதாரணமான வகை.\n\n**சாத்தியமான காரணங்கள்:**\n• மன அழுத்தம், கவலை, அல்லது தசை இறுக்கம்\n• தவறான தோரணை (திரை பயன்பாடு)\n• நீரிழப்பு அல்லது சாப்பாடு தவிர்த்தல்\n• தூக்கமின்மை\n\n**என் பரிந்துரைகள்:**\n• **Ibuprofen 400mg** அல்லது **Paracetamol 500mg** உணவுடன் எடுக்கவும்\n• 30 நிமிடம் அமைதியான, இருட்டான அறையில் ஓய்வு எடுங்கள்\n• உடனே 2 கிளாஸ் தண்ணீர் குடிக்கவும்\n• கழுத்து மற்றும் தோள் மெதுவாக நீட்டவும்\n• நெற்றியில் குளிர்ந்த / வெதுவெதுப்பான ஒத்தடம்\n\n⚠️ **உடனே அவசர சிகிச்சை தேடவும்:**\n• திடீரென வாழ்க்கையில் மிகவும் மோசமான தலைவலி\n• காய்ச்சல் + கழுத்து இறுக்கத்துடன் தலைவலி\n• பார்வை இழப்பு அல்லது பேச்சு சிரமம்",
                diagnosis: 'மன அழுத்த தலைவலி',
                severity: 'mild',
                action: 'normal',
                medicines: ['Ibuprofen 400mg', 'Paracetamol 500mg'],
            },
        },
    },

    // CHEST PAIN
    {
        id: 'chest_pain',
        keywords: ['chest pain', 'chest', 'heart', 'chest tight', 'breathless', 'chest pressure', 'மார்பு வலி', 'மார்பு', 'இதயம்', 'சுவாசிக்க'],
        followUps: {
            en: ["Is the pain sharp, crushing, or pressure-like?", "Does the pain spread to your arm, jaw, or back?", "Are you also short of breath or sweating?"],
            ta: ["வலி கூர்மையானதா, நசுக்குவது போல் உணர்கிறீர்களா?", "வலி கை, தாடை அல்லது முதுகிற்கு பரவுகிறதா?", "சுவாசிக்க கஷ்டமா இருக்கிறதா அல்லது வியர்க்கிறதா?"],
        },
        diagnosis: {
            en: {
                message: "🚨 **EMERGENCY ALERT — Please Act Immediately**\n\nChest pain is a **serious medical emergency**. Your symptoms could indicate:\n\n• **Heart Attack (Myocardial Infarction)** — most urgent\n• Angina (reduced blood flow to heart)\n• Pulmonary Embolism (blood clot in lung)\n• Severe GERD or muscle strain\n\n**DO THIS RIGHT NOW:**\n1. 🚑 **Call 108 immediately**\n2. Sit or lie down — do NOT exert yourself\n3. Chew **Aspirin 325mg** if available and not allergic\n4. Loosen tight clothing\n5. If unconscious, begin CPR\n\n❗ Do NOT drive yourself to hospital\n❗ Do NOT wait to see if it gets better\n❗ Do NOT ignore chest pain",
                diagnosis: 'Possible Cardiac Emergency',
                severity: 'emergency',
                action: 'emergency',
                medicines: ['Aspirin 325mg (chew immediately)'],
            },
            ta: {
                message: "🚨 **அவசரகாலம் — உடனடியாக செய்யுங்கள்**\n\nமார்பு வலி ஒரு **தீவிர மருத்துவ அவசரநிலை**. உங்கள் அறிகுறிகள் இவற்றை குறிக்கலாம்:\n\n• **மாரடைப்பு** — மிக அவசரமானது\n• அஞ்சினா (இதயத்திற்கு குறைந்த இரத்த ஓட்டம்)\n• நுரையீரலில் இரத்த உறைவு\n\n**இப்போதே செய்யுங்கள்:**\n1. 🚑 **108 உடனே அழையுங்கள்**\n2. உட்கார்ந்து அல்லது படுங்கள் — உடல் உழைப்பை தவிர்க்கவும்\n3. ஒவ்வாமை இல்லையென்றால் **Aspirin 325mg** மென்று சாப்பிடவும்\n4. இறுக்கமான ஆடையை தளர்த்தவும்\n\n❗ வாகனம் ஓட்டாதீர்கள்\n❗ சரியாகுமா என்று காத்திருக்காதீர்கள்\n❗ மார்பு வலியை புறக்கணிக்காதீர்கள்",
                diagnosis: 'சாத்தியமான இதய அவசரநிலை',
                severity: 'emergency',
                action: 'emergency',
                medicines: ['Aspirin 325mg (உடனே மெல்லுங்கள்)'],
            },
        },
    },

    // COUGH
    {
        id: 'cough',
        keywords: ['cough', 'cold', 'sore throat', 'phlegm', 'mucus', 'congestion', 'runny nose', 'sneezing', 'இருமல்', 'சளி', 'தொண்டை வலி', 'சீதட்டம்'],
        followUps: {
            en: ["Is it a dry cough or productive (with mucus/phlegm)?", "How long have you been coughing?", "Any fever, sore throat, or difficulty breathing along with it?"],
            ta: ["உலர்ந்த இருமலா அல்லது சளியுடன் இருக்கிறதா?", "எத்தனை நாட்களாக இருமுகிறீர்கள்?", "இருமலுடன் காய்ச்சல், தொண்டை வலி அல்லது சுவாசிக்க சிரமம் உள்ளதா?"],
        },
        diagnosis: {
            en: {
                message: "Your symptoms suggest an **Upper Respiratory Tract Infection (URTI)** — likely the common cold or early bronchitis.\n\n**Likely Cause:** Viral (rhinovirus, coronavirus, RSV)\n\n**My Recommendations:**\n• **Steam inhalation** twice daily (add Vicks/eucalyptus oil)\n• **Honey + ginger + lemon** tea 3 times a day — natural cough relief\n• **Dextromethorphan syrup** for dry cough (as directed)\n• **Guaifenesin** (expectorant) if mucus present\n• Stay hydrated — warm water, soups, herbal teas\n• Saltwater gargle for sore throat (1/2 tsp salt in warm water)\n• Rest voice if hoarse\n• Avoid cold drinks and ice cream\n\n⚠️ **See a doctor if:**\n• Cough lasts more than 2 weeks\n• You cough up blood\n• High fever (>101°F) with cough\n• Difficulty breathing or chest pain\n• Night sweats with cough (TB risk)",
                diagnosis: 'Upper Respiratory Infection',
                severity: 'mild',
                action: 'normal',
                medicines: ['Dextromethorphan syrup', 'Cetrizine 10mg', 'Steam inhalation'],
            },
            ta: {
                message: "உங்கள் அறிகுறிகள் **மேல் சுவாச நோய்த்தொற்று** — சாதாரண சளி அல்லது ஆரம்ப மூச்சுக்குழாய் அழற்சி என்று சுட்டுகின்றன.\n\n**சாத்தியமான காரணம்:** வைரல் தொற்று (ரைனோவைரஸ், கொரோனவைரஸ்)\n\n**என் பரிந்துரைகள்:**\n• **ஆவி பிடிக்கவும்** தினமும் 2 முறை (Vicks அல்லது யூகலிப்டஸ் எண்ணெய் சேர்க்கவும்)\n• **தேன் + இஞ்சி + எலுமிச்சை** தேநீர் தினமும் 3 முறை — இயற்கை இருமல் நிவாரணம்\n• உலர் இருமலுக்கு **Dextromethorphan சிரப்**\n• சளி இருந்தால் **Guaifenesin** (expectorant)\n• வெதுவெதுப்பான தண்ணீர், சூப், மூலிகை தேநீர் குடிக்கவும்\n• தொண்டை வலிக்கு வெதுவெதுப்பான உப்பு தண்ணீரில் கொப்பளிக்கவும்\n• குளிர்ந்த பானங்கள் தவிர்க்கவும்\n\n⚠️ **மருத்துவரை சந்திக்கவும்:**\n• 2 வாரங்களுக்கு மேல் இருமல்\n• இரத்தம் இருமுதல்\n• கடுமையான காய்ச்சலுடன் இருமல்",
                diagnosis: 'மேல் சுவாச நோய்த்தொற்று',
                severity: 'mild',
                action: 'normal',
                medicines: ['Dextromethorphan சிரப்', 'Cetirizine 10mg', 'ஆவி சிகிச்சை'],
            },
        },
    },

    // STOMACH PAIN
    {
        id: 'stomach',
        keywords: ['stomach', 'abdomen', 'abdominal', 'belly', 'gastric', 'nausea', 'vomiting', 'diarrhea', 'loose motion', 'indigestion', 'acidity', 'வயிற்று வலி', 'வயிறு', 'குமட்டல்', 'வாந்தி', 'வயிற்றுப்போக்கு', 'அஜீரணம்'],
        followUps: {
            en: ["Where exactly is the pain — upper, lower, left, or right side?", "Any vomiting or loose stools? How many times?", "Did you eat anything unusual recently? Any change in diet?"],
            ta: ["வலி எங்கே இருக்கிறது — மேல்பகுதி, கீழ்பகுதி, இடது அல்லது வலது?", "வாந்தி அல்லது வயிற்றுப்போக்கு உள்ளதா? எத்தனை முறை?", "சமீபத்தில் ஏதாவது புதியதாக சாப்பிட்டீர்களா?"],
        },
        diagnosis: {
            en: {
                message: "Your symptoms suggest **Acute Gastroenteritis** (stomach infection) or **Acid Reflux/GERD**, which are very common.\n\n**My Recommendations:**\n\n*For infection/diarrhea:*\n• **ORS (Oral Rehydration Solution)** — drink after every loose stool\n• **BRAT diet** — Banana, Rice, Applesauce, Toast\n• **Domperidone 10mg** for nausea (before meals)\n• Avoid dairy, spicy, oily foods for 2–3 days\n• **Probiotics** (Lactobacillus) to restore gut bacteria\n\n*For acidity:*\n• **Omeprazole 20mg** or **Pantoprazole 40mg** before breakfast\n• Avoid coffee, alcohol, spicy food, late-night eating\n• Eat smaller, frequent meals\n• Don't lie down for 2 hours after eating\n\n⚠️ **Seek care immediately if:**\n• Blood in vomit or stool\n• Severe pain (score 8–10)\n• No urination for 8+ hours (dehydration)\n• Pain in lower right abdomen (appendicitis risk)",
                diagnosis: 'Gastroenteritis / Acid Reflux',
                severity: 'moderate',
                action: 'medication',
                medicines: ['ORS Solution', 'Domperidone 10mg', 'Omeprazole 20mg'],
            },
            ta: {
                message: "உங்கள் அறிகுறிகள் **வயிற்று தொற்று** (Gastroenteritis) அல்லது **அமில ஓட்டம்/GERD** என்று சுட்டுகின்றன.\n\n**என் பரிந்துரைகள்:**\n\n*தொற்று/வயிற்றுப்போக்கிற்கு:*\n• **ORS** — ஒவ்வொரு வயிற்றுப்போக்கிற்கு பின்பும் குடிக்கவும்\n• **BRAT உணவு** — வாழைப்பழம், சாதம், ரொட்டி\n• குமட்டலுக்கு **Domperidone 10mg** (உணவுக்கு முன்)\n• பால் பொருட்கள், காரமான, எண்ணெய் உணவுகள் தவிர்க்கவும்\n\n*அமிலத்திற்கு:*\n• காலை உணவுக்கு முன் **Omeprazole 20mg**\n• காபி, மது, காரமான உணவு தவிர்க்கவும்\n• சாப்பிட்ட பிறகு 2 மணி நேரம் படுக்காதீர்கள்\n\n⚠️ **உடனே மருத்துவரை சந்திக்கவும்:**\n• வாந்தி அல்லது மலத்தில் இரத்தம்\n• கடுமையான வலி (8–10)\n• கீழ் வலது வயிற்றில் வலி (appendicitis)",
                diagnosis: 'வயிற்று தொற்று / அமில ஓட்டம்',
                severity: 'moderate',
                action: 'medication',
                medicines: ['ORS கரைசல்', 'Domperidone 10mg', 'Omeprazole 20mg'],
            },
        },
    },

    // DIABETES
    {
        id: 'diabetes',
        keywords: ['diabetes', 'sugar', 'blood sugar', 'insulin', 'thirsty', 'frequent urination', 'diabetic', 'நீரிழிவு', 'சர்க்கரை', 'அடிக்கடி சிறுநீர்', 'தாகம்'],
        followUps: {
            en: ["Are you already diagnosed with diabetes? If yes, are you on medication?", "What was your last blood sugar reading?", "Any symptoms like blurred vision, tingling feet, or slow wound healing?"],
            ta: ["நீங்கள் ஏற்கனவே நீரிழிவு நோயால் கண்டறியப்பட்டீர்களா? மருந்து எடுக்கிறீர்களா?", "கடைசியாக இரத்த சர்க்கரை அளவு என்ன?", "மங்கிய பார்வை, கால்களில் கூச்சம், அல்லது காயம் நிவாரணம் கஷ்டமா?"],
        },
        diagnosis: {
            en: {
                message: "Based on your symptoms, I need to discuss **Diabetes Management** with you carefully.\n\n**Key Indicators:**\n• Frequent urination + excessive thirst = classic signs\n• Fatigue, blurred vision, slow healing wounds are warning signs\n\n**Immediate Actions:**\n• Check your **fasting blood sugar** — should be 70–100 mg/dL\n• Check **post-meal sugar** (2 hours after eating) — should be <140 mg/dL\n• If sugar >300 mg/dL, seek medical care today\n\n**Daily Management:**\n• Take prescribed medication consistently — **Metformin** (most common)\n• Follow **diabetic diet**: low GI foods, no refined sugar, high fiber\n• Exercise 30 minutes daily (walking)\n• Check feet daily for cuts/sores\n• Schedule **HbA1c test** every 3 months\n• Blood pressure and cholesterol control\n\nI strongly recommend a **video consultation** with Dr. Rajesh for personalized management.",
                diagnosis: 'Diabetes Management',
                severity: 'moderate',
                action: 'video',
                medicines: ['Metformin 500mg (as prescribed)', 'Low GI diet'],
            },
            ta: {
                message: "உங்கள் அறிகுறிகளின் அடிப்படையில் **நீரிழிவு நோய் மேலாண்மை** பற்றி விவாதிக்க வேண்டும்.\n\n**முக்கிய அறிகுறிகள்:**\n• அடிக்கடி சிறுநீர் + அதிகப்படியான தாகம் = நீரிழிவின் உன்னத அறிகுறிகள்\n• சோர்வு, மங்கிய பார்வை, காயம் நிவாரணம் ஆகாமை = எச்சரிக்கை அறிகுறிகள்\n\n**உடனடி நடவடிக்கைகள்:**\n• **உண்ணாவிரத இரத்த சர்க்கரை** சோதிக்கவும் — 70–100 mg/dL இருக்க வேண்டும்\n• சர்க்கரை >300 mg/dL இருந்தால் இன்றே மருத்துவரை சந்திக்கவும்\n\n**தினசரி மேலாண்மை:**\n• பரிந்துரைக்கப்பட்ட மருந்தை தவறாமல் எடுக்கவும் — **Metformin**\n• நீரிழிவு உணவு: குறைந்த GI உணவுகள், நார்ச்சத்து அதிகம்\n• தினமும் 30 நிமிடம் நடைப்பயிற்சி\n• **HbA1c சோதனை** 3 மாதங்களுக்கு ஒருமுறை\n\nடாக்டர் ராஜேஷிடம் **வீடியோ ஆலோசனை** மிகவும் பரிந்துரைக்கிறேன்.",
                diagnosis: 'நீரிழிவு நோய் மேலாண்மை',
                severity: 'moderate',
                action: 'video',
                medicines: ['Metformin 500mg (மருத்துவர் பரிந்துரைப்படி)'],
            },
        },
    },

    // BODY PAIN
    {
        id: 'body_pain',
        keywords: ['body pain', 'muscle pain', 'joint pain', 'ache', 'backache', 'back pain', 'bone', 'arthritis', 'உடல்வலி', 'மூட்டு வலி', 'முதுகுவலி', 'எலும்பு', 'தசைவலி'],
        followUps: {
            en: ["Which part of your body is most painful?", "Is the pain sharp, dull ache, or stiffness?", "Does it get worse in the morning, after activity, or at rest?"],
            ta: ["உடலின் எந்த பகுதியில் அதிகமாக வலிக்கிறது?", "வலி கூர்மையானதா, மழுங்கியதா, அல்லது இறுக்கமா?", "காலையில், செயல்பாட்டிற்கு பிறகு, அல்லது ஓய்வில் மோசமாகிறதா?"],
        },
        diagnosis: {
            en: {
                message: "Your symptoms suggest **Musculoskeletal Pain** — which could be muscle strain, joint inflammation, or viral body aches.\n\n**My Recommendations:**\n• **Diclofenac Gel** — apply to painful area 3 times daily\n• **Ibuprofen 400mg** with food for systemic pain relief\n• Warm compress on painful joints for 15–20 minutes\n• Gentle stretching and range-of-motion exercises\n• Adequate rest — avoid strenuous activity\n• For back pain: sleep on firm mattress, avoid bending/lifting\n• **Calcium + Vitamin D** supplements if joint pain is chronic\n\n💊 If fever with body pain: likely **dengue or chikungunya** — get CBC blood test\n\n⚠️ **See a specialist if:**\n• Swelling, redness, warmth in joints (arthritis)\n• Pain limiting daily activities for >1 week\n• Numbness or tingling in hands/feet",
                diagnosis: 'Musculoskeletal Pain',
                severity: 'mild',
                action: 'medication',
                medicines: ['Diclofenac Gel', 'Ibuprofen 400mg', 'Calcium + Vit D'],
            },
            ta: {
                message: "உங்கள் அறிகுறிகள் **தசைக்கூட்டு வலி** — தசை இழுப்பு, மூட்டு வீக்கம், அல்லது வைரல் உடல்வலி என்று சுட்டுகின்றன.\n\n**என் பரிந்துரைகள்:**\n• **Diclofenac Gel** — வலியுள்ள இடத்தில் தினமும் 3 முறை தடவுங்கள்\n• பொதுவான வலி நிவாரணத்திற்கு **Ibuprofen 400mg** உணவுடன்\n• வலியுள்ள மூட்டுகளில் 15–20 நிமிடம் வெப்ப ஒத்தடம்\n• மெதுவான நீட்டல் பயிற்சிகள்\n• முதுகு வலிக்கு: திடமான மெத்தையில் தூங்கவும்\n• **Calcium + Vitamin D** சப்ளிமெண்ட்கள் நீண்டகால மூட்டு வலிக்கு\n\n💊 காய்ச்சலுடன் உடல்வலி இருந்தால்: **டெங்கு அல்லது சிக்குன்குனியா** — CBC சோதனை செய்யவும்",
                diagnosis: 'தசைக்கூட்டு வலி',
                severity: 'mild',
                action: 'medication',
                medicines: ['Diclofenac Gel', 'Ibuprofen 400mg'],
            },
        },
    },

    // SKIN
    {
        id: 'skin',
        keywords: ['rash', 'itching', 'itch', 'skin', 'allergy', 'hives', 'red spots', 'pimples', 'acne', 'eczema', 'தடிப்பு', 'அரிப்பு', 'தோல்', 'ஒவ்வாமை', 'முகப்பரு'],
        followUps: {
            en: ["Where is the rash or itching located?", "Is it spreading or staying in one place?", "Did you use any new soap, food, or medicine recently?"],
            ta: ["தடிப்பு அல்லது அரிப்பு எங்கே உள்ளது?", "அது பரவுகிறதா அல்லது ஒரே இடத்தில் இருக்கிறதா?", "சமீபத்தில் புதிய சோப்பு, உணவு, அல்லது மருந்து பயன்படுத்தினீர்களா?"],
        },
        diagnosis: {
            en: {
                message: "Your symptoms suggest an **Allergic Skin Reaction** or **Contact Dermatitis**.\n\n**My Recommendations:**\n• **Cetirizine 10mg** once daily at bedtime — reduces itching\n• **Hydrocortisone 1% cream** — apply to rash twice daily (not on face)\n• Avoid scratching — may cause infection\n• Cool compress to relieve itching\n• Use fragrance-free, gentle soap only\n• Wear loose, cotton clothing\n\n**Identify the trigger:**\n• New food (shellfish, nuts, eggs, dairy)\n• New soap/detergent/cosmetic\n• New medication\n• Plant contact or insect bite\n\n⚠️ **Emergency if:**\n• Rash with difficulty breathing or throat swelling (anaphylaxis)\n• Blistering or peeling skin\n• Rash covering >30% of body with fever",
                diagnosis: 'Allergic Skin Reaction',
                severity: 'mild',
                action: 'medication',
                medicines: ['Cetirizine 10mg', 'Hydrocortisone 1% cream', 'Calamine lotion'],
            },
            ta: {
                message: "உங்கள் அறிகுறிகள் **ஒவ்வாமை தோல் எதிர்வினை** அல்லது **Contact Dermatitis** என்று சுட்டுகின்றன.\n\n**என் பரிந்துரைகள்:**\n• இரவு தூங்கும் முன் **Cetirizine 10mg** — அரிப்பை குறைக்கும்\n• தடிப்பில் **Hydrocortisone 1% cream** தினமும் 2 முறை தடவுங்கள்\n• அரிக்காதீர்கள் — தொற்று வரலாம்\n• குளிர்ந்த ஒத்தடம் அரிப்பை குறைக்கும்\n• மெல்லிய, பருத்தி ஆடை அணியுங்கள்\n\n**தூண்டுதலை கண்டறியுங்கள்:**\n• புதிய உணவு, சோப்பு, அல்லது மருந்து\n• தாவர தொடர்பு அல்லது பூச்சி கடி\n\n⚠️ **அவசர சிகிச்சை தேவை:**\n• தடிப்புடன் சுவாசிக்க கஷ்டம் (anaphylaxis)\n• தோல் கொப்புளம் அல்லது உதிர்தல்",
                diagnosis: 'ஒவ்வாமை தோல் எதிர்வினை',
                severity: 'mild',
                action: 'medication',
                medicines: ['Cetirizine 10mg', 'Hydrocortisone cream', 'Calamine lotion'],
            },
        },
    },

    // BREATHING
    {
        id: 'breathing',
        keywords: ['breathless', 'breathing', 'shortness of breath', 'asthma', 'wheeze', 'wheezing', 'suffocate', 'oxygen', 'சுவாசிக்க', 'ஆஸ்துமா', 'மூச்சு திணறல்', 'மூச்சு'],
        followUps: {
            en: ["Is the breathlessness constant or does it come in attacks?", "Do you have a history of asthma or heart disease?", "Does it get worse on exertion or at rest?"],
            ta: ["மூச்சு திணறல் தொடர்ந்து இருக்கிறதா அல்லது தாக்குதல்களாக வருகிறதா?", "ஆஸ்துமா அல்லது இதய நோய் வரலாறு உள்ளதா?", "செயல்பாட்டில் மோசமாகிறதா அல்லது ஓய்வில்?"],
        },
        diagnosis: {
            en: {
                message: "Difficulty breathing needs **immediate attention**. Based on your symptoms, this may be:\n\n• **Asthma attack** — wheezing, tight chest\n• **COPD exacerbation** — if smoker/elderly\n• **Acute bronchitis**\n• **Anxiety/Panic attack** — breathing too fast\n\n**Immediate steps:**\n• Sit upright — do NOT lie down\n• If you have an inhaler: **use it now** (Salbutamol 2 puffs)\n• Breathe slowly — in through nose (4 sec), out through mouth (6 sec)\n• Open windows for fresh air\n• Remove tight clothing\n\n⚠️ **Call 108 IMMEDIATELY if:**\n• Lips/fingernails turning blue\n• Cannot speak in full sentences\n• Inhaler not helping after 10 minutes\n• SpO2 below 90%",
                diagnosis: 'Respiratory Distress',
                severity: 'emergency',
                action: 'emergency',
                medicines: ['Salbutamol inhaler (2 puffs immediately)'],
            },
            ta: {
                message: "சுவாசிக்க சிரமம் **உடனடி கவனம்** தேவை. உங்கள் அறிகுறிகளின் அடிப்படையில்:\n\n• **ஆஸ்துமா தாக்குதல்** — சீழ்க்கை, மார்பு இறுக்கம்\n• **கடுமையான மூச்சுக்குழாய் அழற்சி**\n• **பதட்டம்/Panic தாக்குதல்**\n\n**உடனடி நடவடிக்கைகள்:**\n• நேர்மையாக உட்கார்ந்திருங்கள் — படுக்காதீர்கள்\n• Inhaler இருந்தால்: **இப்போதே பயன்படுத்துங்கள்** (Salbutamol 2 puffs)\n• மெதுவாக சுவாசிக்கவும் — மூக்கு வழி உள்ளே (4 நிமிடம்), வாய் வழி வெளியே (6 நிமிடம்)\n\n⚠️ **108 அழையுங்கள் உடனே:**\n• உதடுகள்/நகங்கள் நீலமாக மாறினால்\n• முழு வாக்கியங்களில் பேச முடியாவிட்டால்",
                diagnosis: 'சுவாச நெருக்கடி',
                severity: 'emergency',
                action: 'emergency',
                medicines: ['Salbutamol inhaler (உடனே 2 puffs)'],
            },
        },
    },

    // EYE
    {
        id: 'eye',
        keywords: ['eye pain', 'red eye', 'itchy eye', 'blurred vision', 'watery eye', 'conjunctivitis', 'கண் வலி', 'சிவந்த கண்', 'கண் தொற்று', 'மங்கிய பார்வை', 'கண் அரிப்பு'],
        followUps: {
            en: ["Is one eye or both eyes affected?", "Any discharge (pus, watery, or sticky)?", "Did you get anything in your eye?"],
            ta: ["ஒரு கண்ணா அல்லது இரண்டு கண்களுமா பாதிக்கப்பட்டிருக்கிறது?", "கண்ணிலிருந்து திரவம் (சீழ், தண்ணீர், ஒட்டும் திரவம்) வருகிறதா?", "கண்ணில் ஏதாவது விழுந்ததா?"],
        },
        diagnosis: {
            en: {
                message: "Your symptoms suggest **Conjunctivitis (Pink Eye)** — a very common and treatable eye infection.\n\n**My Recommendations:**\n• **Chloramphenicol 0.5% eye drops** (bacterial) — 1 drop, 4 times daily\n• **Sodium Cromoglicate drops** (allergic conjunctivitis)\n• **Cold compress** on closed eyes for relief\n• Do NOT rub eyes — spreads infection\n• Discard eye makeup\n• Wash hands frequently\n• Avoid sharing towels, pillowcases\n• Remove contact lenses until healed\n\n⚠️ **See eye doctor immediately if:**\n• Sudden vision loss\n• Severe eye pain\n• Light sensitivity with headache\n• Chemical in eye",
                diagnosis: 'Conjunctivitis (Pink Eye)',
                severity: 'mild',
                action: 'medication',
                medicines: ['Chloramphenicol 0.5% eye drops', 'Antihistamine drops'],
            },
            ta: {
                message: "உங்கள் அறிகுறிகள் **கண் தொற்று (Conjunctivitis)** என்று சுட்டுகின்றன — மிகவும் சாதாரணமான மற்றும் சிகிச்சையளிக்கக்கூடிய நோய்.\n\n**என் பரிந்துரைகள்:**\n• **Chloramphenicol 0.5% கண் சொட்டு** — தினமும் 4 முறை 1 சொட்டு\n• கண்களில் குளிர்ந்த ஒத்தடம்\n• கண்களை தேய்க்காதீர்கள் — தொற்று பரவும்\n• கண்ணாடிகளை குணமாகும் வரை அணியாதீர்கள்\n• கைகளை அடிக்கடி கழுவுங்கள்\n\n⚠️ **உடனே கண் மருத்துவரை சந்திக்கவும்:**\n• திடீர் பார்வை இழப்பு\n• கடுமையான கண் வலி\n• வெளிச்ச உணர்திறன்",
                diagnosis: 'கண் தொற்று (Conjunctivitis)',
                severity: 'mild',
                action: 'medication',
                medicines: ['Chloramphenicol 0.5% கண் சொட்டு'],
            },
        },
    },

    // MENTAL HEALTH
    {
        id: 'mental',
        keywords: ['stress', 'anxiety', 'depression', 'sad', 'mental', 'panic', 'sleep', 'insomnia', 'worry', 'மன அழுத்தம்', 'கவலை', 'மனசோர்வு', 'தூக்கமின்மை', 'பதட்டம்'],
        followUps: {
            en: ["How long have you been feeling this way?", "Is it affecting your sleep, appetite, or daily activities?", "Have you experienced any thoughts of harming yourself?"],
            ta: ["எத்தனை நாட்களாக இப்படி உணர்கிறீர்கள்?", "தூக்கம், பசி, அல்லது தினசரி நடவடிக்கைகளை பாதிக்கிறதா?", "உங்களை நீங்களே தீங்கு செய்து கொள்ள எண்ணங்கள் வருகிறதா?"],
        },
        diagnosis: {
            en: {
                message: "I hear you, and I want you to know — **you are not alone**. Mental health is as important as physical health. 💙\n\n**What you may be experiencing:**\n• Anxiety disorder — excessive worry, restlessness\n• Depression — persistent low mood, loss of interest\n• Stress-related disorder\n• Sleep disorder\n\n**Immediate self-care:**\n• **Deep breathing**: 4-7-8 technique (inhale 4s, hold 7s, exhale 8s)\n• **Regular sleep schedule** — same time every day\n• **Exercise** — even 20 min walking releases endorphins\n• Limit social media and news\n• Talk to a trusted friend or family member\n• Write a journal — express your feelings\n\n**Professional help options:**\n• iCall helpline: **9152987821**\n• NIMHANS helpline: **080-46110007**\n• Vandrevala Foundation: **1860-2662-345** (24/7)\n\nI strongly recommend a **video consultation** with our healthcare team.",
                diagnosis: 'Mental Health Assessment',
                severity: 'moderate',
                action: 'video',
                medicines: ['Counseling recommended', 'Melatonin 3mg (sleep)', 'Exercise therapy'],
            },
            ta: {
                message: "நான் உங்களை கேட்கிறேன், நீங்கள் **தனியல்ல** என்று தெரிந்துகொள்ளுங்கள். 💙 மனநலம் உடல் நலனை போன்றே முக்கியமானது.\n\n**நீங்கள் அனுபவிக்கக்கூடியது:**\n• கவலை கோளாறு\n• மனசோர்வு — தொடர்ந்த சோர்வு, ஆர்வமின்மை\n• தூக்கக் கோளாறு\n\n**உடனடி சுய-பராமரிப்பு:**\n• **ஆழமான சுவாசம்**: 4-7-8 தொழில்நுட்பம்\n• **வழக்கமான தூக்க நேரம்**\n• **உடற்பயிற்சி** — 20 நிமிட நடைபயிற்சியே போதும்\n• நம்பகமான நண்பர் அல்லது குடும்பத்தினரிடம் பேசுங்கள்\n\n**உதவி எண்கள்:**\n• iCall: **9152987821**\n• NIMHANS: **080-46110007**\n\nவீடியோ ஆலோசனை மிகவும் பரிந்துரைக்கப்படுகிறது.",
                diagnosis: 'மனநல மதிப்பீடு',
                severity: 'moderate',
                action: 'video',
                medicines: ['ஆலோசனை பரிந்துரைக்கப்படுகிறது', '20 நிமிட நடைபயிற்சி'],
            },
        },
    },
];

// ─── Match function ──────────────────────────────────────────
export function matchCondition(text) {
    const lower = text.toLowerCase();
    for (const entry of KB) {
        for (const kw of entry.keywords) {
            if (lower.includes(kw.toLowerCase())) return entry;
        }
    }
    return null;
}

// ─── Fallback when no match ──────────────────────────────────
export const FALLBACK = {
    en: (name) => `Thank you for sharing that, ${name || 'friend'}. I want to make sure I understand correctly.\n\nCould you describe your main symptom in more detail? For example:\n• **Where** exactly is the discomfort?\n• **When** did it start?\n• **How severe** is it on a scale of 1–10?\n• Any other symptoms accompanying it?\n\nYou can also try mentioning: fever, cough, headache, chest pain, stomach pain, skin rash, breathing difficulty, or mental health concerns.`,
    ta: (name) => `${name || 'நண்பரே'}, உங்கள் தகவலுக்கு நன்றி. நான் சரியாக புரிந்துகொள்ள விரும்புகிறேன்.\n\nதயவுசெய்து உங்கள் முக்கிய அறிகுறியை விவரமாக கூறுங்கள்:\n• **எங்கே** சரியாக அசௌகரியம்?\n• **எப்போது** ஆரம்பித்தது?\n• **எவ்வளவு தீவிரம்** (1–10 அளவில்)?\n• வேறு அறிகுறிகள் ஏதும் உள்ளதா?\n\nநீங்கள் குறிப்பிடலாம்: காய்ச்சல், இருமல், தலைவலி, மார்பு வலி, வயிற்று வலி, தோல் தடிப்பு, சுவாசிக்க சிரமம்.`,
};

// ─── Follow-up prompts after diagnosis ──────────────────────
export const POST_DIAGNOSIS = {
    en: [
        "Is there anything else you'd like to know about this condition?",
        "Do you have any other symptoms you'd like me to check?",
        "Would you like me to book a video consultation with a doctor?",
    ],
    ta: [
        "இந்த நிலை பற்றி வேறு ஏதாவது தெரிந்துகொள்ள விரும்புகிறீர்களா?",
        "வேறு அறிகுறிகள் சோதிக்க விரும்புகிறீர்களா?",
        "மருத்துவரிடம் வீடியோ ஆலோசனை முன்பதிவு செய்யட்டுமா?",
    ],
};
