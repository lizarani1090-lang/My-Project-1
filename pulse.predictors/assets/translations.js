// Pulse Predictor - Comprehensive Translation & PWA Engine
// Supports English (en), Hindi (hi), and Marathi (mr)

(() => {
  const translations = {
    hi: {
      // General & App Titles
      "Pulse Predictor": "पल्स प्रेडिक्टर",
      "Rural Healthcare Access & Quality Platform": "ग्रामीण स्वास्थ्य सेवा पहुँच एवं गुणवत्ता मंच",
      "Rural Health Access & Quality Platform": "ग्रामीण स्वास्थ्य सेवा पहुँच एवं गुणवत्ता मंच",
      "Rural Health Access & Quality Bridge": "ग्रामीण स्वास्थ्य पहुँच और गुणवत्ता सेतु",
      "Enterprise Healthcare Network · 4 Dedicated Workplaces": "एंटरप्राइज हेल्थकेयर नेटवर्क · 4 समर्पित कार्यस्थल",
      "Care moves better together.": "स्वास्थ्य सेवा मिलकर बेहतर काम करती है।",
      "A coordinated digital health network connecting frontline workers, primary doctors, facility administrators, and rural patients. Select your authorized workplace to sign in.": "फ्रंटलाइन कार्यकर्ताओं, प्राथमिक डॉक्टरों, अस्पताल प्रशासकों और ग्रामीण मरीजों को जोड़ने वाला डिजिटल स्वास्थ्य नेटवर्क। साइन इन करने के लिए अपना अधिकृत कार्यस्थल चुनें।",
      "Protected role-based workspaces · Authorized personnel only": "सुरक्षित भूमिका-आधारित कार्यक्षेत्र · केवल अधिकृत कर्मियों हेतु",
      "Secure Role-Based Health Network": "सुरक्षित भूमिका-आधारित स्वास्थ्य नेटवर्क",
      "Choose your workplace": "अपना कार्यस्थल चुनें",
      "Select your authorized department to continue to your secure workplace.": "अपने सुरक्षित कार्यस्थल पर जारी रखने के लिए अधिकृत विभाग चुनें।",
      "HIPAA & ABDM Compliant · 256-bit Encrypted Portal Session": "HIPAA एवं ABDM अनुपालक · 256-बिट एन्क्रिप्टेड सत्र",
      "Verifying secure workplace session...": "सुरक्षित कार्यस्थल सत्र सत्यापित किया जा रहा है...",
      "Authenticating role credentials with Pulse Predictor network": "पल्स प्रेडिक्टर नेटवर्क के साथ क्रेडेंशियल सत्यापित किए जा रहे हैं",
      "Offline mode — data queued locally, will auto-sync when network returns": "ऑफ़लाइन मोड — डेटा स्थानीय रूप से सुरक्षित है, नेटवर्क लौटने पर ऑटो-सिंक होगा",

      // Top bar & Actions
      "Install App": "ऐप इंस्टॉल करें",
      "Install application on phone": "फ़ोन पर ऐप इंस्टॉल करें",
      "Choose language": "भाषा चुनें",
      "Switch Workplace": "कार्यस्थल बदलें",
      "Toggle simulated network connectivity": "सिम्युलेटेड नेटवर्क कनेक्टिविटी बदलें",
      "Log out of this workplace and sign into another portal": "इस कार्यस्थल से लॉग आउट करें और दूसरे पोर्टल में साइन इन करें",
      "ASHA Workplace": "आशा कार्यस्थल",
      "Doctor Workplace": "डॉक्टर कार्यस्थल",
      "Facility Workplace": "सुविधा कार्यस्थल",
      "Patient Portal": "मरीज पोर्टल",
      "Community Care Portal": "सामुदायिक स्वास्थ्य पोर्टल",

      // Roles & Cards
      "ASHA Worker": "आशा कार्यकर्ता",
      "Sub-Centre symptom capture, digital triage, & referrals": "उप-केंद्र लक्षण जांच, डिजिटल ट्रायेज और रेफरल",
      "Doctor / PHC": "डॉक्टर / पीएचसी",
      "Live teleconsult queue, e-prescriptions, & diagnostics": "लाइव टेलीकंसल्ट कतार, ई-प्रिस्क्रिप्शन और डायग्नोस्टिक्स",
      "Facility Admin": "सुविधा प्रशासक",
      "Bed capacity, oxygen stock, & ambulance tracking": "बेड क्षमता, ऑक्सीजन स्टॉक और एम्बुलेंस ट्रैकिंग",
      "Book consults, token queue, & unified ABHA record": "परामर्श बुक करें, टोकन कतार और एकीकृत आभा रिकॉर्ड",

      // Login Portals
      "Pulse Predictor | Choose Workplace Portal": "पल्स प्रेडिक्टर | कार्यस्थल पोर्टल चुनें",
      "ASHA Worker Sign In | Pulse Predictor": "आशा कार्यकर्ता साइन इन | पल्स प्रेडिक्टर",
      "Frontline Community Care Portal": "फ्रंटलाइन सामुदायिक स्वास्थ्य पोर्टल",
      "ASHA Workplace Portal": "आशा कार्यस्थल पोर्टल",
      "Bring every patient closer to care.": "हर मरीज को बेहतर स्वास्थ्य सेवा के करीब लाएं।",
      "Record household symptoms, run clinical protocol triage, coordinate teleconsultations with PHC doctors, and track referrals safely.": "घरेलू लक्षणों को दर्ज करें, क्लिनिकल प्रोटोकॉल ट्रायेज चलाएं, पीएचसी डॉक्टरों के साथ टेलीकंसल्टेशन करें और रेफरल ट्रैक करें।",
      "Dedicated ASHA Workplace · Authorized personnel only": "समर्पित आशा कार्यस्थल · केवल अधिकृत कर्मियों हेतु",
      "ASHA Worker Sign In": "आशा कार्यकर्ता साइन इन",
      "Sign in to access Sub-Centre 4 triage and community follow-up records.": "उप-केंद्र 4 ट्रायेज और समुदाय अनुवर्ती रिकॉर्ड देखने के लिए साइन इन करें।",
      "ASHA Official ID": "आशा आधिकारिक आईडी",
      "Enter ASHA ID or Email": "आशा आईडी या ईमेल दर्ज करें",
      "Password": "पासवर्ड",
      "Enter password": "पासवर्ड दर्ज करें",
      "Sign in as ASHA Worker": "आशा कार्यकर्ता के रूप में साइन इन करें",
      "All Portals": "सभी पोर्टल",
      "Doctor Portal": "डॉक्टर पोर्टल",
      "Facility Portal": "सुविधा पोर्टल",
      "Other portals": "अन्य पोर्टल",

      "Doctor Sign In | Pulse Predictor": "डॉक्टर साइन इन | पल्स प्रेडिक्टर",
      "Medical Officer & PHC Portal": "चिकित्सा अधिकारी एवं पीएचसी पोर्टल",
      "Doctor Workplace Portal": "डॉक्टर कार्यस्थल पोर्टल",
      "Make the next clinical decision clearer.": "क्लिनिकल निर्णय को अधिक स्पष्ट और प्रभावी बनाएं।",
      "Review real-time teleconsultation queues, analyze AI vitals triage, issue signed e-prescriptions, and coordinate emergency referrals with secondary hospitals.": "रियल-टाइम टेलीकंसल्टेशन कतार देखें, एआई वाइटल्स ट्रायेज का विश्लेषण करें, हस्ताक्षरित ई-प्रिस्क्रिप्शन जारी करें और आपातकालीन रेफरल समन्वय करें।",
      "Dedicated Clinical Workplace · Authorized medical officers only": "समर्पित क्लिनिकल कार्यस्थल · केवल अधिकृत डॉक्टरों हेतु",
      "Doctor Sign In": "डॉक्टर साइन इन",
      "Sign in to access your consultation queue and active clinical station.": "अपनी परामर्श कतार और सक्रिय क्लिनिकल स्टेशन देखने के लिए साइन इन करें।",
      "Doctor Identification / Email": "डॉक्टर पहचान आईडी / ईमेल",
      "Enter Doctor ID or Email": "डॉक्टर आईडी या ईमेल दर्ज करें",
      "Sign in as Doctor / PHC": "डॉक्टर के रूप में साइन इन करें",

      "Facility Admin Sign In | Pulse Predictor": "सुविधा प्रशासक साइन इन | पल्स प्रेडिक्टर",
      "Facility & Health Logistics Portal": "सुविधा एवं स्वास्थ्य रसद पोर्टल",
      "Facility Admin Workplace": "सुविधा प्रशासक कार्यस्थल",
      "Coordinate resources, beds, and logistics.": "संसाधनों, बिस्तरों और रसद का कुशल समन्वय करें।",
      "Monitor real-time general and ICU bed occupancy, emergency oxygen reserves, inbound patient transfers, and drug restocking workflows.": "रियल-टाइम सामान्य और आईसीयू बेड उपलब्धता, आपातकालीन ऑक्सीजन भंडार, मरीज स्थानांतरण और दवा आपूर्ति की निगरानी करें।",
      "Dedicated Facility Workplace · Authorized administrators only": "समर्पित सुविधा कार्यस्थल · केवल अधिकृत प्रशासकों हेतु",
      "Facility Admin Sign In": "सुविधा प्रशासक साइन इन",
      "Sign in to manage bed capacity, ambulance dispatch, and pharmacy stock.": "बेड क्षमता, एम्बुलेंस प्रेषण और फार्मेसी स्टॉक प्रबंधित करने हेतु साइन इन करें।",
      "Facility Admin ID": "सुविधा प्रशासक आईडी",
      "Enter Facility ID or Email": "सुविधा आईडी या ईमेल दर्ज करें",
      "Sign in as Facility Admin": "सुविधा प्रशासक के रूप में साइन इन करें",

      "Patient Sign In | Pulse Predictor": "मरीज साइन इन | पल्स प्रेडिक्टर",
      "Patient Health & Teleconsult Portal": "मरीज स्वास्थ्य एवं टेलीकंसल्ट पोर्टल",
      "Patient Health Portal": "मरीज स्वास्थ्य पोर्टल",
      "Your care, records, and prescriptions in one place.": "आपकी स्वास्थ्य सेवा, रिकॉर्ड और पर्चियां एक ही स्थान पर।",
      "Book virtual appointments with rural PHC doctors, join live HD teleconsultations from your phone, and access your longitudinal health record linked to your ABHA card.": "ग्रामीण पीएचसी डॉक्टरों से अपॉइंटमेंट बुक करें, फ़ोन से लाइव एचडी टेलीकंसल्टेशन में जुड़ें और अपने आभा कार्ड से जुड़े स्वास्थ्य रिकॉर्ड देखें।",
      "Dedicated Patient Portal · Secure access": "समर्पित मरीज पोर्टल · सुरक्षित उपयोग",
      "Patient Sign In": "मरीज साइन इन",
      "Sign in to view your appointments, prescriptions, and health history.": "अपने अपॉइंटमेंट, दवा के पर्चे और स्वास्थ्य इतिहास देखने के लिए साइन इन करें।",
      "Patient ID / Mobile Number / ABHA": "मरीज आईडी / मोबाइल नंबर / आभा",
      "Enter ABHA ID or Mobile Number": "आभा आईडी या मोबाइल नंबर दर्ज करें",
      "Sign in as Patient": "मरीज के रूप में साइन इन करें",

      // ASHA Dashboard
      "Sunita Devi": "सुनीता देवी",
      "Sunita Devi · Sub-Centre 4": "सुनीता देवी · उप-केंद्र 4",
      "ASHA Facilitator · Sub-Centre 4, Ward 4 · Dist. Satara": "आशा फैसिलिटेटर · उप-केंद्र 4, वार्ड 4 · जिला सतारा",
      "Frontline Community Healthcare": "फ्रंटलाइन सामुदायिक स्वास्थ्य सेवा",
      "Door-to-door preventative screening, maternal care monitoring, and fast-track teleconsult triage for 4 remote villages.": "4 दूरदराज गांवों के लिए घर-घर निवारक जांच, मातृ स्वास्थ्य निगरानी और त्वरित टेलीकंसल्ट ट्रायेज।",
      "4 Villages": "4 गांव",
      "Field Coverage": "क्षेत्रीय कवरेज",
      "42 Families": "42 परिवार",
      "Active Registry": "सक्रिय रजिस्ट्री",
      "100% Offline": "100% ऑफ़लाइन",
      "Sub-Centre Sync": "उप-केंद्र सिंक",
      "Tap to execute": "निष्पादित करने के लिए टैप करें",
      "Quick Actions": "त्वरित कार्य",
      "Digital Triage": "डिजिटल ट्रायेज",
      "Symptom check & risk": "लक्षण जांच एवं जोखिम गणना",
      "Assisted Teleconsult": "सहायता प्राप्त टेलीकंसल्ट",
      "Live Video with Doctor": "डॉक्टर के साथ लाइव वीडियो",
      "Referral Tracker": "रेफरल ट्रैकर",
      "Live GPS transit flow": "लाइव जीपीएस पारगमन प्रवाह",
      "Medicine Availability": "दवा उपलब्धता",
      "Stock & restock orders": "स्टॉक और पुनर्भरण आदेश",
      "Action Required": "कार्रवाई आवश्यक",
      "Priority Follow-ups": "प्राथमिकता फॉलो-अप",
      "High Risk Flagged": "उच्च जोखिम चिह्नित",
      "Assigned Patients": "आवंटित मरीज",
      "Resolved This Week": "इस सप्ताह हल किए गए",

      // Patient Profiles & Lists
      "Ramesh Patil (48y)": "रमेश पाटिल (48 वर्ष)",
      "High BP · Referred to District Hospital yesterday": "उच्च बीपी · कल जिला अस्पताल रेफर किया गया",
      "BP 150/95": "बीपी 150/95",
      "In Transit": "पारगमन में",
      "Priya Sharma (26y)": "प्रिया शर्मा (26 वर्ष)",
      "Maternal Checkup · ANC 3rd Trimester · Due today": "मातृ जांच · एएनसी तीसरी तिमाही · आज निर्धारित",
      "Hb: 10.8 g/dL": "एचबी: 10.8 g/dL",
      "Scheduled": "निर्धारित",
      "Amit Singh (35y)": "अमित सिंह (35 वर्ष)",
      "Routine Checkup": "नियमित जांच",
      "Waiting 15m": "15 मिनट से प्रतीक्षारत",
      "Waiting 4m": "4 मिनट से प्रतीक्षारत",
      "Waiting 9m": "9 मिनट से प्रतीक्षारत",

      // Triage Form
      "Digital Clinical Triage": "डिजिटल क्लिनिकल ट्रायेज",
      "Rapid frontline triage with automated protocol risk score": "स्वचालित प्रोटोकॉल जोखिम स्कोर के साथ त्वरित ट्रायेज",
      "Patient Name or ABHA ID": "मरीज का नाम या आभा आईडी",
      "Enter name or scan ABHA ID": "नाम दर्ज करें या आभा स्कैन करें",
      "Tap Presenting Symptoms (Interactive Risk Engine)": "मौजूदा लक्षणों पर टैप करें (जोखिम मूल्यांकन)",
      "Fever (102°F)": "बुखार (102°F)",
      "Cough & Cold": "खांसी और जुकाम",
      "Breathlessness": "सांस फूलना",
      "Stomach Pain": "पेट दर्द",
      "Chest Tightness": "छाती में जकड़न",
      "High BP Spike": "उच्च रक्तचाप वृद्धि",
      "Blood Pressure": "रक्तचाप (बीपी)",
      "Pulse Rate": "नाड़ी गति",
      "Oxygen SpO2": "ऑक्सीजन स्तर",
      "Calculate Clinical Risk Score": "क्लिनिकल जोखिम स्कोर की गणना करें",
      "High Clinical Risk — RED ALERT": "उच्च क्लिनिकल जोखिम — लाल चेतावनी (RED ALERT)",
      "Moderate Clinical Risk — AMBER": "मध्यम क्लिनिकल जोखिम — पीली चेतावनी (AMBER)",
      "Low Clinical Risk — GREEN": "कम क्लिनिकल जोखिम — सुरक्षित (GREEN)",
      "Risk Score: 8/10": "जोखिम स्कोर: 8/10",
      "Launch Teleconsult": "टेलीकंसल्ट शुरू करें",
      "Initiate Referral": "रेफरल आरंभ करें",

      // Teleconsultation
      "Assisted Teleconsultation": "सहायता प्राप्त टेलीकंसल्टेशन",
      "Live Clinical WebRTC Session with PHC Medical Officer": "पीएचसी चिकित्सा अधिकारी के साथ लाइव वेबसत्र",
      "Encrypted · 720p 30fps": "एन्क्रिप्टेड · 720p 30fps",
      "Dr. Rajesh Kumar (PHC)": "डॉ. राजेश कुमार (पीएचसी)",
      "Synced Offline": "ऑफ़लाइन सिंक हुआ",
      "Frontline Vitals:": "फ्रंटलाइन वाइटल्स:",
      "Presenting Symptoms:": "मौजूदा लक्षण:",
      "High fever (102°F), productive cough, breathlessness": "तेज बुखार (102°F), बलगम वाली खांसी, सांस लेने में तकलीफ",
      "Digital e-Prescription (Synced across Network)": "डिजिटल ई-पर्चा (नेटवर्क पर सिंक)",
      "Sign & Complete Consultation": "हस्ताक्षर करें एवं परामर्श पूर्ण करें",
      "Diagnostic Coordination": "डायग्नोस्टिक समन्वय",
      "Order & track clinical lab investigations across facilities": "विभिन्न केंद्रों में लैब जांच ऑर्डर एवं ट्रैक करें",
      "Select Diagnostic Orders for Ramesh Patil": "रमेश पाटिल के लिए डायग्नोस्टिक टेस्ट चुनें",
      "Chest X-Ray (PA View)": "चेस्ट एक्स-रे (पीए व्यू)",
      "12-Lead ECG": "12-लीड ईसीजी",
      "CBC & ESR": "सीबीसी और ईएसआर",
      "Pending District Lab Results": "लंबित जिला लैब परिणाम",
      "Priya Sharma — Hemoglobin": "प्रिया शर्मा — हीमोग्लोबिन",
      "Ordered 2 days ago · Rural Hospital Lab": "2 दिन पहले ऑर्डर किया गया · ग्रामीण अस्पताल लैब",
      "Sample Processing": "सैंपल की जांच प्रक्रिया जारी",
      "Amit Singh — Fasting Blood Sugar": "अमित सिंह — फास्टिंग ब्लड शुगर",
      "Ordered yesterday · PHC Lab": "कल ऑर्डर किया गया · पीएचसी लैब",
      "Result Ready: 112 mg/dL": "परिणाम तैयार: 112 mg/dL",
      "Patient Longitudinal Record": "मरीज का समग्र स्वास्थ्य इतिहास",
      "Unified Multi-Facility Electronic Health Record": "एकीकृत बहु-सुविधा इलेक्ट्रॉनिक स्वास्थ्य रिकॉर्ड",

      // Referral Pathway
      "Referral Pathway Tracker": "रेफरल पाथवे ट्रैकर",
      "Live multi-tier coordination across rural health facilities": "ग्रामीण स्वास्थ्य केंद्रों के मध्य लाइव समन्वय",
      "Emergency Referral: High BP & Dyspnea · Sub-Centre 4 → District Hospital": "आपातकालीन रेफरल: उच्च बीपी और सांस फूलना · उप-केंद्र 4 → जिला अस्पताल",
      "1. Sub-Centre": "1. उप-केंद्र",
      "2. PHC Ward 4": "2. पीएचसी वार्ड 4",
      "3. Rural Hosp. (ETA 22m)": "3. ग्रामीण अस्पताल (अनुमानित समय 22 मि)",
      "4. District Hosp.": "4. जिला अस्पताल",
      "Sub-Centre": "उप-केंद्र",
      "PHC": "पीएचसी",
      "Rural Hosp.": "ग्रामीण अस्पताल",
      "District Hospital": "जिला अस्पताल",
      "Call Ambulance": "एम्बुलेंस को कॉल करें",
      "View ABHA Record": "आभा रिकॉर्ड देखें",
      "Maternal checkup & ultrasound · Referred 3 days ago": "मातृ जांच एवं अल्ट्रासाउंड · 3 दिन पहले रेफर किया गया",

      // Medicine Stock
      "Sub-Centre 4 Stock": "उप-केंद्र 4 दवा स्टॉक",
      "Essential medicine inventory synced from PHC Central Warehouse": "पीएचसी केंद्रीय गोदाम से सिंक की गई आवश्यक दवाएं",
      "Amoxicillin 500mg": "एमोक्सिसिलिन 500mg",
      "220 strips in stock · Reorder at 50": "220 स्ट्रिप्स उपलब्ध · 50 पर पुनः ऑर्डर",
      "Available": "उपलब्ध",
      "Iron & Folic Acid (IFA)": "आयरन एवं फोलिक एसिड (IFA)",
      "18 strips remaining · Reorder threshold 25": "18 स्ट्रिप्स शेष · रीऑर्डर सीमा 25",
      "Low Stock": "कम स्टॉक",
      "Oral Rehydration Salts (ORS)": "ओआरएस घोल पैकेट",
      "0 packets remaining · Critical shortage": "0 पैकेट शेष · भारी कमी",
      "Out of Stock": "स्टॉक समाप्त",
      "Request Emergency Restock from PHC": "पीएचसी से आपातकालीन स्टॉक का अनुरोध करें",
      "Paracetamol 500mg": "पैरासिटामोल 500mg",
      "Paracetamol 650mg": "पैरासिटामोल 650mg",
      "SOS for fever/pain relief": "बुखार/दर्द निवारण हेतु आवश्यकतानुसार",

      // Doctor Module
      "Dr. Rajesh Kumar": "डॉ. राजेश कुमार",
      "Dr. Rajesh Kumar · PHC Clinic": "डॉ. राजेश कुमार · पीएचसी क्लिनिक",
      "Medical Officer · PHC Ward 4 · Teleconsult Station 1": "चिकित्सा अधिकारी · पीएचसी वार्ड 4 · टेलीकंसल्ट स्टेशन 1",
      "Rural Primary Health Centre Teleconsult": "ग्रामीण प्राथमिक स्वास्थ्य केंद्र टेलीकंसल्ट",
      "Bridging medical specialists with frontline ASHA workers and rural patients with AI assisted vitals triage and instant digital prescriptions.": "एआई वाइटल्स ट्रायेज और त्वरित डिजिटल नुस्खों के साथ ग्रामीण मरीजों और आशा कार्यकर्ताओं को डॉक्टरों से जोड़ना।",
      "7 Waiting": "7 प्रतीक्षारत",
      "Queue Triage": "कतार ट्रायेज",
      "< 12 mins": "< 12 मिनट",
      "Avg Turnaround": "औसत समय",
      "Civil Hospital": "सिविल अस्पताल",
      "Direct Escalation": "प्रत्यक्ष एस्केलेशन",
      "In Queue": "कतार में",
      "Avg Wait": "औसत प्रतीक्षा",
      "High Risk": "उच्च जोखिम",
      "+18% vs Last Week": "+18% पिछले सप्ताह की तुलना में",
      "Priority Patient Queue": "प्राथमिकता मरीज कतार",
      "Sorted by Triage Severity": "ट्रायेज गंभीरता अनुसार क्रमबद्ध",
      "Triage: RED · BP 150/95 · Waiting 4m": "ट्रायेज: RED (गंभीर) · बीपी 150/95 · प्रतीक्षा 4 मि",
      "Triage: Moderate · Maternal Review · Waiting 9m": "ट्रायेज: मध्यम · मातृ समीक्षा · प्रतीक्षा 9 मि",
      "Triage: Low · Routine Checkup · Waiting 15m": "ट्रायेज: कम जोखिम · नियमित जांच · प्रतीक्षा 15 मि",
      "Consultation: Ramesh Patil": "परामर्श: रमेश पाटिल",
      "Connecting Sub-Centre 4 via Encrypted WebRTC Stream": "उप-केंद्र 4 से एन्क्रिप्टेड वेबआरटीसी द्वारा जुड़ाव",
      "ASHA: Sunita Devi & Patient": "आशा: सुनीता देवी और मरीज",

      // Facility Admin Module
      "Rampur Primary Health Centre": "रामपुर प्राथमिक स्वास्थ्य केंद्र",
      "Rampur Admin · Facility Ops": "रामपुर प्रशासन · सुविधा ऑपरेशन्स",
      "PHC Ward 4": "पीएचसी वार्ड 4",
      "District Quality & Operations": "जिला गुणवत्ता एवं संचालन",
      "Superintendent Dashboard · 4 Sub-Centres Connected": "अधीक्षक डैशबोर्ड · 4 उप-केंद्र जुड़े हुए",
      "Rural Health Logistics & Emergency Command": "ग्रामीण स्वास्थ्य रसद एवं आपातकालीन कमान",
      "Coordinating oxygen reserves, critical ICU and general bed capacity, and rural ambulance transfers across 4 peripheral sub-centres.": "4 उप-केंद्रों में ऑक्सीजन भंडार, महत्वपूर्ण आईसीयू व सामान्य बिस्तर क्षमता और एम्बुलेंस का समन्वय।",
      "18 Beds": "18 बिस्तर",
      "General Vacant": "सामान्य रिक्त",
      "4 ICU Beds": "4 आईसीयू बिस्तर",
      "Equipped with O2": "ऑक्सीजन सुसज्जित",
      "2 Ambulances": "2 एम्बुलेंस",
      "Standby GPS Active": "स्टैंडबाय जीपीएस सक्रिय",
      "Referral Completion": "रेफरल पूर्णता",
      "Target: 85% met": "लक्ष्य: 85% पूर्ण",
      "High-Risk Follow-up": "उच्च जोखिम अनुवर्ती",
      "Within 48h protocol": "48 घंटे के भीतर प्रोटोकॉल",
      "14 min": "14 मिनट",
      "Avg Wait Time": "औसत प्रतीक्षा समय",
      "-6m from last month": "पिछले माह से -6 मिनट",
      "Teleconsults": "टेलीकंसल्ट",
      "Conducted this week": "इस सप्ताह आयोजित",
      "Operational": "सक्रिय रूप से कार्यरत",
      "General Wards (34 / 40 Beds Occupied)": "सामान्य वार्ड (34 / 40 बिस्तर भरे)",
      "Maternity & NICU (11 / 15 Beds Occupied)": "प्रसूति एवं एनआईसीयू (11 / 15 बिस्तर भरे)",
      "Oxygen Cylinder Reserves (18 / 20 Full)": "ऑक्सीजन सिलेंडर भंडार (18 / 20 भरे)",
      "Quality & Supply Alerts": "गुणवत्ता एवं आपूर्ति अलर्ट",
      "Referral Alert:": "रेफरल अलर्ट:",
      "Stock Shortage:": "स्टॉक कमी:",
      "Referral Pipeline": "रेफरल पाइपलाइन",
      "Medicine Logistics": "दवा रसद प्रबंधन",
      "District Referral Pipeline": "जिला रेफरल पाइपलाइन",
      "Live multi-facility transfer tracking": "लाइव बहु-केंद्र स्थानांतरण ट्रैकिंग",
      "Initiated": "आरंभ किया गया",
      "Overdue": "विलंबित",
      "Completed": "संपन्न",
      "Sub-Centre 4 → District Hospital · Transport active": "उप-केंद्र 4 → जिला अस्पताल · परिवहन सक्रिय",
      "Overdue 26h": "26 घंटे विलंबित",
      "Warehouse Medicine Logistics": "गोदाम दवा रसद",
      "Inventory levels across connected sub-centres": "संबद्ध उप-केंद्रों में इन्वेंटरी स्तर",
      "Sub-Centre 4": "उप-केंद्र 4",
      "1 Out of Stock": "1 अनुपलब्ध",
      "Oral Rehydration Salts — 0 packets remaining": "ओआरएस — 0 पैकेट शेष",
      "PHC Ward 4 Central": "पीएचसी वार्ड 4 केंद्रीय",
      "Stocked": "पूर्ण स्टॉक",
      "All essential antibiotics & analgesics above safe buffer": "सभी आवश्यक एंटीबायोटिक्स व दर्द निवारक सुरक्षित स्तर से ऊपर",
      "District Hospital Pharmacy": "जिला अस्पताल फार्मेसी",
      "1 Low Stock": "1 कम स्टॉक",
      "Insulin Regular — 40 vials (threshold 60 vials)": "इंसुलिन रेगुलर — 40 शीशियां (न्यूनतम सीमा 60)",

      // Patient Module
      "Damodar Kumar Singh": "दामोदर कुमार सिंह",
      "Ramesh Patil": "रमेश पाटिल",
      "Ramesh Patil · Personal Record": "रमेश पाटिल · व्यक्तिगत रिकॉर्ड",
      "Digital Health Locker": "डिजिटल स्वास्थ्य लॉकर",
      "ABHA ID: 91-8507-4746-3815 · Ayushman Bharat": "आभा आईडी: 91-8507-4746-3815 · आयुष्मान भारत",
      "ABHA ID: 12-3456-7890 · Ayushman Bharat": "आभा आईडी: 12-3456-7890 · आयुष्मान भारत",
      "Your Village Healthcare & Wellness Hub": "आपका ग्रामीण स्वास्थ्य एवं कल्याण केंद्र",
      "Connect directly with primary doctors from your village, store lab reports and verified digital prescriptions in your Ayushman Bharat health account.": "अपने गांव के डॉक्टरों से सीधे जुड़ें, लैब रिपोर्ट और डिजिटल पर्चे अपने आयुष्मान भारत खाते में सुरक्षित रखें।",
      "Assigned Doctor": "नियुक्त डॉक्टर",
      "Token #04": "टोकन #04",
      "Current Queue": "वर्तमान कतार",
      "Free Meds": "मुफ्त दवाएं",
      "At PHC Dispensary": "पीएचसी औषधालय में",
      "Book Care": "अपॉइंटमेंट लें",
      "Appointments & Queue": "अपॉइंटमेंट और कतार",
      "Join Teleconsult": "टेलीकंसल्ट में जुड़ें",
      "Live with Dr. Rajesh": "डॉ. राजेश के साथ लाइव",
      "Health Record": "स्वास्थ्य रिकॉर्ड",
      "Prescriptions & history": "पर्चे और इतिहास",
      "Meds & Tests": "दवाएं और जांच",
      "Active dosages": "सक्रिय खुराक",
      "Book Appointment": "अपॉइंटमेंट बुक करें",
      "Schedule in-person or teleconsultation care": "प्रत्यक्ष या टेलीकंसल्टेशन समय बुक करें",
      "Select Health Facility": "स्वास्थ्य सुविधा चुनें",
      "PHC Ward 4 — Dr. Rajesh Kumar": "पीएचसी वार्ड 4 — डॉ. राजेश कुमार",
      "District Hospital — Cardiology Department": "जिला अस्पताल — कार्डियोलॉजी विभाग",
      "Select Preferred Consultation Slot": "पसंदीदा परामर्श समय चुनें",
      "2:00 PM": "दोपहर 2:00",
      "3:30 PM": "दोपहर 3:30",
      "5:00 PM": "शाम 5:00",
      "Appointment confirmed for 2:00 PM": "दोपहर 2:00 बजे के लिए अपॉइंटमेंट पक्का हुआ",
      "#3 in Queue": "कतार में #3",
      "Estimated wait time:": "अनुमानित प्रतीक्षा समय:",
      "12 minutes": "12 मिनट",
      "Patient Teleconsultation": "मरीज टेलीकंसल्टेशन",
      "Live Video Consultation with Dr. Rajesh Kumar": "डॉ. राजेश कुमार के साथ लाइव वीडियो परामर्श",
      "● High Speed": "● उच्च गति",
      "Doctor's Direct Guidance": "डॉक्टर का सीधा मार्गदर्शन",
      "My Digital Health History": "मेरा डिजिटल स्वास्थ्य इतिहास",
      "ABHA Linked Records across all clinics and hospitals": "सभी क्लीनिकों और अस्पतालों में आभा से जुड़े रिकॉर्ड",
      "Active Medications & Tests": "सक्रिय दवाएं और परीक्षण",
      "Current treatment plan and scheduled lab appointments": "वर्तमान उपचार योजना और निर्धारित लैब परीक्षण",
      "Prescribed Medications": "निर्धारित दवाएं",
      "1 capsule morning, 1 night · 5 days": "1 कैप्सूल सुबह, 1 रात · 5 दिन",
      "Active": "सक्रिय",
      "Diagnostic Tests Scheduled": "निर्धारित डायग्नोस्टिक जांच",
      "Ordered by Dr. Rajesh Kumar · District Diagnostic Hub": "डॉ. राजेश कुमार द्वारा अनुशंसित · जिला जांच केंद्र",

      // Bottom Navigation Tabs
      "Home": "होम",
      "Triage": "ट्रायेज",
      "Referrals": "रेफरल",
      "Stock": "दवा स्टॉक",
      "Queue": "कतार",
      "Diagnostics": "जांच",
      "Schedule": "शेड्यूल",
      "Dashboard": "डैशबोर्ड",
      "Book": "बुक करें",
      "Records": "रिकॉर्ड",
      "Meds": "दवाएं",
      "Exit": "बाहर निकलें",

      // Install Modal
      "Install Pulse Predictor": "पल्स प्रेडिक्टर इंस्टॉल करें",
      "Fast offline access on your phone": "आपके फ़ोन पर तेज़ ऑफ़लाइन उपयोग",
      "Install on iPhone / iPad": "iPhone / iPad पर इंस्टॉल करें",
      "Install on Android / Desktop": "Android / कंप्यूटर पर इंस्टॉल करें",
      "Add Pulse Predictor to your Home Screen": "होम स्क्रीन पर पल्स प्रेडिक्टर जोड़ें",
      "Tap the Share button in the Safari bottom toolbar.": "सफ़ारी के नीचे टूलबार में शेयर बटन पर टैप करें।",
      "Scroll down the action sheet and tap Add to Home Screen.": "नीचे स्क्रॉल करें और 'होम स्क्रीन में जोड़ें' पर टैप करें।",
      "Tap Add in the top right corner. The app will launch in full screen!": "ऊपर दाईं ओर 'जोड़ें' पर टैप करें। ऐप फ़ुल स्क्रीन में खुलेगी!",
      "Tap the browser menu button in your browser toolbar.": "अपने ब्राउज़र टूलबार में तीन डॉट्स मेनू बटन पर टैप करें।",
      "Select Install app or Add to Home screen.": "'ऐप इंस्टॉल करें' या 'होम स्क्रीन में जोड़ें' चुनें।",
      "Confirm prompt. Pulse Predictor will be added to your home screen with 100% offline access.": "पुष्टि करें। पल्स प्रेडिक्टर 100% ऑफ़लाइन क्षमता के साथ आपकी होम स्क्रीन पर जुड़ जाएगा।",
      "Open in New Tab": "नए टैब में खोलें",
      "Got It, Close": "समझ गया, बंद करें",
      "Close": "बंद करें"
    },

    mr: {
      // General & App Titles
      "Pulse Predictor": "पल्स प्रेडिक्टर",
      "Rural Healthcare Access & Quality Platform": "ग्रामीण आरोग्य सेवा पोहोच व गुणवत्ता व्यासपीठ",
      "Rural Health Access & Quality Platform": "ग्रामीण आरोग्य सेवा पोहोच व गुणवत्ता व्यासपीठ",
      "Rural Health Access & Quality Bridge": "ग्रामीण आरोग्य पोहोच आणि गुणवत्ता सेतू",
      "Enterprise Healthcare Network · 4 Dedicated Workplaces": "एंटरप्राइझ हेल्थकेअर नेटवर्क · 4 समर्पित कार्यस्थळे",
      "Care moves better together.": "आरोग्य सेवा एकत्र अधिक चांगल्या प्रकारे काम करते.",
      "A coordinated digital health network connecting frontline workers, primary doctors, facility administrators, and rural patients. Select your authorized workplace to sign in.": "आशा सेविका, प्राथमिक डॉक्टर, रुग्णालय प्रशासक आणि ग्रामीण रुग्णांना जोडणारे डिजिटल आरोग्य नेटवर्क. साइन इन करण्यासाठी आपले अधिकृत कार्यस्थळ निवडा.",
      "Protected role-based workspaces · Authorized personnel only": "सुरक्षित भूमिका-आधारित कार्यक्षेत्र · केवळ अधिकृत व्यक्तींसाठी",
      "Secure Role-Based Health Network": "सुरक्षित भूमिका-आधारित आरोग्य नेटवर्क",
      "Choose your workplace": "आपले कार्यस्थळ निवडा",
      "Select your authorized department to continue to your secure workplace.": "आपल्या सुरक्षित कार्यस्थळावर जाण्यासाठी अधिकृत विभाग निवडा.",
      "HIPAA & ABDM Compliant · 256-bit Encrypted Portal Session": "HIPAA आणि ABDM सुसंगत · 256-बिट एन्क्रिप्टेड सत्र",
      "Verifying secure workplace session...": "सुरक्षित कार्यस्थळ सत्र तपासत आहे...",
      "Authenticating role credentials with Pulse Predictor network": "पल्स प्रेडिक्टर नेटवर्कसह क्रेडेन्शियल तपासत आहे",
      "Offline mode — data queued locally, will auto-sync when network returns": "ऑफलाइन मोड — डेटा स्थानिक पातळीवर जतन केला आहे, नेटवर्क परत आल्यावर आपोआप सिंक होईल",

      // Top bar & Actions
      "Install App": "अॅप स्थापित करा",
      "Install application on phone": "फोनवर अॅप स्थापित करा",
      "Choose language": "भाषा निवडा",
      "Switch Workplace": "कार्यस्थळ बदला",
      "Toggle simulated network connectivity": "सिम्युलेटेड नेटवर्क कनेक्टिव्हिटी टॉगल करा",
      "Log out of this workplace and sign into another portal": "या कार्यस्थळातून बाहेर पडा आणि दुसऱ्या पोर्टलमध्ये साइन इन करा",
      "ASHA Workplace": "आशा कार्यस्थळ",
      "Doctor Workplace": "डॉक्टर कार्यस्थळ",
      "Facility Workplace": "सुविधा कार्यस्थळ",
      "Patient Portal": "रुग्ण पोर्टल",
      "Community Care Portal": "समुदाय आरोग्य पोर्टल",

      // Roles & Cards
      "ASHA Worker": "आशा कार्यकर्ती",
      "Sub-Centre symptom capture, digital triage, & referrals": "उप-केंद्र लक्षण नोंद, डिजिटल ट्रायेज आणि संदर्भ",
      "Doctor / PHC": "डॉक्टर / पीएचसी",
      "Live teleconsult queue, e-prescriptions, & diagnostics": "थेट टेलिकन्सल्ट रांग, ई-प्रिस्क्रिप्शन आणि निदान",
      "Facility Admin": "सुविधा प्रशासक",
      "Bed capacity, oxygen stock, & ambulance tracking": "बेड क्षमता, ऑक्सिजन साठा आणि रुग्णवाहिका ट्रॅकिंग",
      "Book consults, token queue, & unified ABHA record": "सल्लामसलत बुक करा, टोकन रांग आणि आभा नोंद",

      // Login Portals
      "Pulse Predictor | Choose Workplace Portal": "पल्स प्रेडिक्टर | कार्यस्थळ पोर्टल निवडा",
      "ASHA Worker Sign In | Pulse Predictor": "आशा कार्यकर्ती साइन इन | पल्स प्रेडिक्टर",
      "Frontline Community Care Portal": "फ्रंटलाइन समुदाय आरोग्य पोर्टल",
      "ASHA Workplace Portal": "आशा कार्यस्थळ पोर्टल",
      "Bring every patient closer to care.": "प्रत्येक रुग्णाला दर्जेदार आरोग्य सेवेच्या जवळ आणा.",
      "Record household symptoms, run clinical protocol triage, coordinate teleconsultations with PHC doctors, and track referrals safely.": "घरोघरी जाऊन लक्षणे नोंदवा, डिजिटल ट्रायेज करा, डॉक्टरांशी टेलिकन्सल्टेशन करा आणि संदर्भ सुरक्षितपणे ट्रॅक करा.",
      "Dedicated ASHA Workplace · Authorized personnel only": "समर्पित आशा कार्यस्थळ · केवळ अधिकृत कर्मचाऱ्यांसाठी",
      "ASHA Worker Sign In": "आशा कार्यकर्ती साइन इन",
      "Sign in to access Sub-Centre 4 triage and community follow-up records.": "उप-केंद्र 4 ट्रायेज आणि समुदाय पाठपुरावा नोंदी पाहण्यासाठी साइन इन करा.",
      "ASHA Official ID": "आशा अधिकृत आयडी",
      "Enter ASHA ID or Email": "आशा आयडी किंवा ईमेल प्रविष्ट करा",
      "Password": "पासवर्ड",
      "Enter password": "पासवर्ड प्रविष्ट करा",
      "Sign in as ASHA Worker": "आशा कार्यकर्ती म्हणून साइन इन करा",
      "All Portals": "सर्व पोर्टल्स",
      "Doctor Portal": "डॉक्टर पोर्टल",
      "Facility Portal": "सुविधा पोर्टल",
      "Other portals": "इतर पोर्टल्स",

      "Doctor Sign In | Pulse Predictor": "डॉक्टर साइन इन | पल्स प्रेडिक्टर",
      "Medical Officer & PHC Portal": "वैद्यकीय अधिकारी आणि पीएचसी पोर्टल",
      "Doctor Workplace Portal": "डॉक्टर कार्यस्थळ पोर्टल",
      "Make the next clinical decision clearer.": "क्लिनिकल निर्णय अधिक स्पष्ट आणि अचूक करा.",
      "Review real-time teleconsultation queues, analyze AI vitals triage, issue signed e-prescriptions, and coordinate emergency referrals with secondary hospitals.": "टेलिकन्सल्टेशन रांगा पहा, एआय वाइटल्स ट्रायेज तपासा, डिजिटल स्वाक्षरी असलेले ई-प्रिस्क्रिप्शन द्या आणि संदर्भ व्यवस्थापित करा.",
      "Dedicated Clinical Workplace · Authorized medical officers only": "समर्पित क्लिनिकल कार्यस्थळ · केवळ अधिकृत डॉक्टरांसाठी",
      "Doctor Sign In": "डॉक्टर साइन इन",
      "Sign in to access your consultation queue and active clinical station.": "तुमची सल्लामसलत रांग आणि सक्रिय क्लिनिकल स्टेशन पाहण्यासाठी साइन इन करा.",
      "Doctor Identification / Email": "डॉक्टर ओळख / ईमेल",
      "Enter Doctor ID or Email": "डॉक्टर आयडी किंवा ईमेल प्रविष्ट करा",
      "Sign in as Doctor / PHC": "डॉक्टर म्हणून साइन इन करा",

      "Facility Admin Sign In | Pulse Predictor": "सुविधा प्रशासक साइन इन | पल्स प्रेडिक्टर",
      "Facility & Health Logistics Portal": "सुविधा आणि आरोग्य रसद पोर्टल",
      "Facility Admin Workplace": "सुविधा प्रशासक कार्यस्थळ",
      "Coordinate resources, beds, and logistics.": "संसाधने, बेड्स आणि रसद यांचे समन्वय करा.",
      "Monitor real-time general and ICU bed occupancy, emergency oxygen reserves, inbound patient transfers, and drug restocking workflows.": "रिअल-टाइम सामान्य आणि आयसीयू बेड उपलब्धता, ऑक्सिजन साठा, रुग्णवाहिका आणि औषध पुरवठ्याचे निरीक्षण करा.",
      "Dedicated Facility Workplace · Authorized administrators only": "समर्पित सुविधा कार्यस्थळ · केवळ अधिकृत प्रशासकांसाठी",
      "Facility Admin Sign In": "सुविधा प्रशासक साइन इन",
      "Sign in to manage bed capacity, ambulance dispatch, and pharmacy stock.": "बेड क्षमता, रुग्णवाहिका आणि औषध साठा व्यवस्थापनासाठी साइन इन करा.",
      "Facility Admin ID": "सुविधा प्रशासक आयडी",
      "Enter Facility ID or Email": "सुविधा आयडी किंवा ईमेल प्रविष्ट करा",
      "Sign in as Facility Admin": "सुविधा प्रशासक म्हणून साइन इन करा",

      "Patient Sign In | Pulse Predictor": "रुग्ण साइन इन | पल्स प्रेडिक्टर",
      "Patient Health & Teleconsult Portal": "रुग्ण आरोग्य व टेलिकन्सल्ट पोर्टल",
      "Patient Health Portal": "रुग्ण आरोग्य पोर्टल",
      "Your care, records, and prescriptions in one place.": "तुमची आरोग्य सेवा, नोंदी आणि औषधांच्या चिठ्ठ्या एकाच ठिकाणी.",
      "Book virtual appointments with rural PHC doctors, join live HD teleconsultations from your phone, and access your longitudinal health record linked to your ABHA card.": "पीएचसी डॉक्टरांसोबत भेटी बुक करा, थेट एचडी टेलिकन्सल्टेशनमध्ये सामील व्हा आणि आभा कार्डशी जोडलेल्या आरोग्याच्या नोंदी पहा.",
      "Dedicated Patient Portal · Secure access": "समर्पित रुग्ण पोर्टल · सुरक्षित प्रवेश",
      "Patient Sign In": "रुग्ण साइन इन",
      "Sign in to view your appointments, prescriptions, and health history.": "तुमच्या भेटी, औषधोपचार आणि आरोग्य इतिहास पाहण्यासाठी साइन इन करा.",
      "Patient ID / Mobile Number / ABHA": "रुग्ण आयडी / मोबाईल नंबर / आभा",
      "Enter ABHA ID or Mobile Number": "आभा आयडी किंवा मोबाईल नंबर प्रविष्ट करा",
      "Sign in as Patient": "रुग्ण म्हणून साइन इन करा",

      // ASHA Dashboard
      "Sunita Devi": "सुनिता देवी",
      "Sunita Devi · Sub-Centre 4": "सुनिता देवी · उप-केंद्र 4",
      "ASHA Facilitator · Sub-Centre 4, Ward 4 · Dist. Satara": "आशा कार्यकर्ती · उप-केंद्र 4, प्रभाग 4 · जि. सातारा",
      "Frontline Community Healthcare": "फ्रंटलाइन समुदाय आरोग्य सेवा",
      "Door-to-door preventative screening, maternal care monitoring, and fast-track teleconsult triage for 4 remote villages.": "4 दुर्गम गावांसाठी घरोघरी जाऊन प्रतिबंधात्मक तपासणी, माता आरोग्य देखरेख आणि जलद टेलिकन्सल्ट ट्रायेज.",
      "4 Villages": "4 गावे",
      "Field Coverage": "क्षेत्र कव्हरेज",
      "42 Families": "42 कुटुंबे",
      "Active Registry": "सक्रिय नोंदणी",
      "100% Offline": "100% ऑफलाइन",
      "Sub-Centre Sync": "उप-केंद्र सिंक",
      "Tap to execute": "सुरू करण्यासाठी टॅप करा",
      "Quick Actions": "जलद कृती",
      "Digital Triage": "डिजिटल ट्रायेज",
      "Symptom check & risk": "लक्षण तपासणी व जोखीम",
      "Assisted Teleconsult": "टेलिकन्सल्टेशन",
      "Live Video with Doctor": "डॉक्टरांशी थेट व्हिडिओ",
      "Referral Tracker": "रेफरल ट्रॅकर",
      "Live GPS transit flow": "थेट जीपीएस ट्रान्झिट प्रवाह",
      "Medicine Availability": "औषध उपलब्धता",
      "Stock & restock orders": "साठा व पुनर्भरणा आदेश",
      "Action Required": "कृती आवश्यक",
      "Priority Follow-ups": "प्राधान्य पाठपुरावा",
      "High Risk Flagged": "उच्च जोखीम",
      "Assigned Patients": "नेमून दिलेले रुग्ण",
      "Resolved This Week": "या आठवड्यात पूर्ण",

      // Patient Profiles
      "Ramesh Patil (48y)": "रमेश पाटील (48 वर्षे)",
      "High BP · Referred to District Hospital yesterday": "उच्च बीपी · काल जिल्हा रुग्णालयात पाठवले",
      "BP 150/95": "बीपी 150/95",
      "In Transit": "वाटेवर आहे",
      "Priya Sharma (26y)": "प्रिया शर्मा (26 वर्षे)",
      "Maternal Checkup · ANC 3rd Trimester · Due today": "माता तपासणी · एएनसी ३री तिमाही · आज नियोजित",
      "Hb: 10.8 g/dL": "एचबी: 10.8 g/dL",
      "Scheduled": "नियोजित",
      "Amit Singh (35y)": "अमित सिंह (35 वर्षे)",
      "Routine Checkup": "नियमित तपासणी",
      "Waiting 15m": "15 मिनिटे प्रतीक्षा",
      "Waiting 4m": "4 मिनिटे प्रतीक्षा",
      "Waiting 9m": "9 मिनिटे प्रतीक्षा",

      // Triage Form
      "Digital Clinical Triage": "डिजिटल क्लिनिकल ट्रायेज",
      "Rapid frontline triage with automated protocol risk score": "स्वयंचलित जोखीम गुणांसह जलद ट्रायेज",
      "Patient Name or ABHA ID": "रुग्णाचे नाव किंवा आभा आयडी",
      "Enter name or scan ABHA ID": "नाव प्रविष्ट करा किंवा आभा स्कॅन करा",
      "Tap Presenting Symptoms (Interactive Risk Engine)": "सध्याच्या लक्षणांवर टॅप करा (जोखीम मूल्यमापन)",
      "Fever (102°F)": "ताप (102°F)",
      "Cough & Cold": "खोकला व सर्दी",
      "Breathlessness": "श्वास घेण्यास त्रास",
      "Stomach Pain": "पोटदुखी",
      "Chest Tightness": "छातीत घट्टपणा",
      "High BP Spike": "उच्च रक्तदाब वाढ",
      "Blood Pressure": "रक्तदाब (बीपी)",
      "Pulse Rate": "नाडीचा ठोका",
      "Oxygen SpO2": "ऑक्सिजन पातळी",
      "Calculate Clinical Risk Score": "क्लिनिकल जोखीम गुणांची गणना करा",
      "High Clinical Risk — RED ALERT": "उच्च क्लिनिकल जोखीम — लाल धोक्याचा इशारा (RED ALERT)",
      "Moderate Clinical Risk — AMBER": "मध्यम क्लिनिकल जोखीम — पिवळा इशारा (AMBER)",
      "Low Clinical Risk — GREEN": "कमी क्लिनिकल जोखीम — सुरक्षित (GREEN)",
      "Risk Score: 8/10": "जोखीम गुण: 8/10",
      "Launch Teleconsult": "टेलिकन्सल्ट सुरू करा",
      "Initiate Referral": "रेफरल सुरू करा",

      // Teleconsultation
      "Assisted Teleconsultation": "सहाय्यित टेलिकन्सल्टेशन",
      "Live Clinical WebRTC Session with PHC Medical Officer": "पीएचसी वैद्यकीय अधिकाऱ्यांशी थेट वेब सत्र",
      "Encrypted · 720p 30fps": "एन्क्रिप्टेड · 720p 30fps",
      "Dr. Rajesh Kumar (PHC)": "डॉ. राजेश कुमार (पीएचसी)",
      "Synced Offline": "ऑफलाइन सिंक झाले",
      "Frontline Vitals:": "महत्त्वाचे माप:",
      "Presenting Symptoms:": "सध्याची लक्षणे:",
      "High fever (102°F), productive cough, breathlessness": "तीव्र ताप (102°F), खोकला, धाप लागणे",
      "Digital e-Prescription (Synced across Network)": "डिजिटल ई-प्रिस्क्रिप्शन (नेटवर्कवर सिंक)",
      "Sign & Complete Consultation": "स्वाक्षरी करा व सल्लामसलत पूर्ण करा",
      "Diagnostic Coordination": "निदान समन्वय",
      "Order & track clinical lab investigations across facilities": "विविध केंद्रांमध्ये लॅब चाचण्या मागवा आणि ट्रॅक करा",
      "Select Diagnostic Orders for Ramesh Patil": "रमेश पाटील यांच्यासाठी चाचण्या निवडा",
      "Chest X-Ray (PA View)": "छातीचा एक्स-रे (पीए व्ह्यू)",
      "12-Lead ECG": "12-लीड ईसीजी",
      "CBC & ESR": "सीबीसी आणि ईएसआर",
      "Pending District Lab Results": "प्रलंबित जिल्हा लॅब निकाल",
      "Priya Sharma — Hemoglobin": "प्रिया शर्मा — हिमोग्लोबिन",
      "Ordered 2 days ago · Rural Hospital Lab": "२ दिवसांपूर्वी मागवले · ग्रामीण रुग्णालय लॅब",
      "Sample Processing": "नमुन्याची तपासणी सुरू",
      "Amit Singh — Fasting Blood Sugar": "अमित सिंह — फास्टिंग ब्लड शुगर",
      "Ordered yesterday · PHC Lab": "काल मागवले · पीएचसी लॅब",
      "Result Ready: 112 mg/dL": "निकाल तयार: 112 mg/dL",
      "Patient Longitudinal Record": "रुग्णाचा संपूर्ण आरोग्य इतिहास",
      "Unified Multi-Facility Electronic Health Record": "एकीकृत इलेक्ट्रॉनिक आरोग्य नोंद",

      // Referral Pathway
      "Referral Pathway Tracker": "रेफरल पाथवे ट्रॅकर",
      "Live multi-tier coordination across rural health facilities": "ग्रामीण आरोग्य केंद्रांमध्ये थेट समन्वय",
      "Emergency Referral: High BP & Dyspnea · Sub-Centre 4 → District Hospital": "तातडीचा संदर्भ: उच्च बीपी आणि धाप · उप-केंद्र 4 → जिल्हा रुग्णालय",
      "1. Sub-Centre": "1. उप-केंद्र",
      "2. PHC Ward 4": "2. पीएचसी प्रभाग 4",
      "3. Rural Hosp. (ETA 22m)": "3. ग्रामीण रुग्णालय (वेळ 22 मि)",
      "4. District Hosp.": "4. जिल्हा रुग्णालय",
      "Sub-Centre": "उप-केंद्र",
      "PHC": "पीएचसी",
      "Rural Hosp.": "ग्रामीण रुग्णालय",
      "District Hospital": "जिल्हा रुग्णालय",
      "Call Ambulance": "रुग्णवाहिका बोलवा",
      "View ABHA Record": "आभा नोंद पहा",
      "Maternal checkup & ultrasound · Referred 3 days ago": "माता तपासणी आणि सोनोग्राफी · ३ दिवसांपूर्वी पाठवले",

      // Medicine Stock
      "Sub-Centre 4 Stock": "उप-केंद्र 4 औषध साठा",
      "Essential medicine inventory synced from PHC Central Warehouse": "पीएचसी गोदामातून सिंक झालेली आवश्यक औषधे",
      "Amoxicillin 500mg": "एमोक्सिसिलिन 500mg",
      "220 strips in stock · Reorder at 50": "220 स्ट्रिप्स शिल्लक · 50 वर पुनर्भरणा",
      "Available": "उपलब्ध",
      "Iron & Folic Acid (IFA)": "आयर्न व फॉलिक अॅसिड (IFA)",
      "18 strips remaining · Reorder threshold 25": "18 स्ट्रिप्स शिल्लक · मर्यादा 25",
      "Low Stock": "कमी साठा",
      "Oral Rehydration Salts (ORS)": "ओआरएस पाकिटे",
      "0 packets remaining · Critical shortage": "0 पाकिटे शिल्लक · तीव्र टंचाई",
      "Out of Stock": "साठा संपला",
      "Request Emergency Restock from PHC": "पीएचसीकडून तातडीच्या साठ्याची विनंती करा",
      "Paracetamol 500mg": "पॅरासिटामॉल 500mg",
      "Paracetamol 650mg": "पॅरासिटामॉल 650mg",
      "SOS for fever/pain relief": "ताप/वेदनेसाठी गरजेनुसार",

      // Doctor Module
      "Dr. Rajesh Kumar": "डॉ. राजेश कुमार",
      "Dr. Rajesh Kumar · PHC Clinic": "डॉ. राजेश कुमार · पीएचसी क्लिनिक",
      "Medical Officer · PHC Ward 4 · Teleconsult Station 1": "वैद्यकीय अधिकारी · पीएचसी प्रभाग 4 · टेलिकन्सल्ट स्टेशन 1",
      "Rural Primary Health Centre Teleconsult": "ग्रामीण प्राथमिक आरोग्य केंद्र टेलिकन्सल्ट",
      "Bridging medical specialists with frontline ASHA workers and rural patients with AI assisted vitals triage and instant digital prescriptions.": "एआय वाइटल्स ट्रायेज आणि त्वरित ई-प्रिस्क्रिप्शनसह ग्रामीण रुग्ण व आशा कार्यकर्त्यांना डॉक्टरांशी जोडणे.",
      "7 Waiting": "7 प्रतीक्षेत",
      "Queue Triage": "रांग ट्रायेज",
      "< 12 mins": "< 12 मिनिटे",
      "Avg Turnaround": "सरासरी वेळ",
      "Civil Hospital": "सिव्हिल रुग्णालय",
      "Direct Escalation": "थेट पुढील संदर्भ",
      "In Queue": "रांगेत",
      "Avg Wait": "सरासरी प्रतीक्षा",
      "High Risk": "उच्च जोखीम",
      "+18% vs Last Week": "+18% मागील आठवड्यापेक्षा",
      "Priority Patient Queue": "प्राधान्य रुग्ण रांग",
      "Sorted by Triage Severity": "गंभीरतेनुसार क्रमवारी",
      "Triage: RED · BP 150/95 · Waiting 4m": "ट्रायेज: RED (गंभीर) · बीपी 150/95 · प्रतीक्षा 4 मि",
      "Triage: Moderate · Maternal Review · Waiting 9m": "ट्रायेज: मध्यम · माता पुनरावलोकन · प्रतीक्षा 9 मि",
      "Triage: Low · Routine Checkup · Waiting 15m": "ट्रायेज: कमी · नियमित तपासणी · प्रतीक्षा 15 मि",
      "Consultation: Ramesh Patil": "सल्लामसलत: रमेश पाटील",
      "Connecting Sub-Centre 4 via Encrypted WebRTC Stream": "उप-केंद्र 4 शी सुरक्षित प्रवाहाद्वारे जोडत आहे",
      "ASHA: Sunita Devi & Patient": "आशा: सुनिता देवी व रुग्ण",

      // Facility Module
      "Rampur Primary Health Centre": "रामपूर प्राथमिक आरोग्य केंद्र",
      "Rampur Admin · Facility Ops": "रामपूर प्रशासन · सुविधा ऑपरेशन्स",
      "PHC Ward 4": "पीएचसी प्रभाग 4",
      "District Quality & Operations": "जिल्हा गुणवत्ता व ऑपरेशन्स",
      "Superintendent Dashboard · 4 Sub-Centres Connected": "अधीक्षक डॅशबोर्ड · 4 उप-केंद्रे जोडलेली",
      "Rural Health Logistics & Emergency Command": "ग्रामीण आरोग्य रसद व आपत्कालीन नियंत्रण",
      "Coordinating oxygen reserves, critical ICU and general bed capacity, and rural ambulance transfers across 4 peripheral sub-centres.": "4 उप-केंद्रांमध्ये ऑक्सिजन साठा, आयसीयू व बेड्स क्षमता आणि रुग्णवाहिकांचे नियंत्रण.",
      "18 Beds": "18 बेड्स",
      "General Vacant": "सामान्य रिक्त",
      "4 ICU Beds": "4 आयसीयू बेड्स",
      "Equipped with O2": "ऑक्सिजन सुसज्ज",
      "2 Ambulances": "2 रुग्णवाहिका",
      "Standby GPS Active": "स्टँडबाय जीपीएस सक्रिय",
      "Referral Completion": "रेफरल पूर्णता",
      "Target: 85% met": "लक्ष्य: 85% पूर्ण",
      "High-Risk Follow-up": "उच्च जोखीम पाठपुरावा",
      "Within 48h protocol": "48 तासांच्या आत",
      "14 min": "14 मिनिटे",
      "Avg Wait Time": "सरासरी प्रतीक्षा वेळ",
      "-6m from last month": "मागील महिन्यापेक्षा -6 मि",
      "Teleconsults": "टेलिकन्सल्ट्स",
      "Conducted this week": "या आठवड्यात घेतलेले",
      "Operational": "सक्रिय कार्यरत",
      "General Wards (34 / 40 Beds Occupied)": "सामान्य वॉर्ड (34 / 40 बेड्स भरलेले)",
      "Maternity & NICU (11 / 15 Beds Occupied)": "प्रसूती व एनआयसीयू (11 / 15 बेड्स भरलेले)",
      "Oxygen Cylinder Reserves (18 / 20 Full)": "ऑक्सिजन सिलिंडर साठा (18 / 20 भरलेले)",
      "Quality & Supply Alerts": "गुणवत्ता व पुरवठा सूचना",
      "Referral Alert:": "रेफरल सूचना:",
      "Stock Shortage:": "साठा टंचाई:",
      "Referral Pipeline": "रेफरल पाइपलाइन",
      "Medicine Logistics": "औषध रसद व्यवस्थापन",
      "District Referral Pipeline": "जिल्हा संदर्भ पाइपलाइन",
      "Live multi-facility transfer tracking": "थेट बहु-केंद्र रुग्ण हस्तांतरण ट्रॅकिंग",
      "Initiated": "सुरू केले",
      "Overdue": "उशीर झाले",
      "Completed": "पूर्ण झाले",
      "Sub-Centre 4 → District Hospital · Transport active": "उप-केंद्र 4 → जिल्हा रुग्णालय · वाहतूक सुरू",
      "Overdue 26h": "26 तास उशीर",
      "Warehouse Medicine Logistics": "गोदाम औषध रसद",
      "Inventory levels across connected sub-centres": "जोडलेल्या उप-केंद्रांमधील साठा पातळी",
      "Sub-Centre 4": "उप-केंद्र 4",
      "1 Out of Stock": "1 संपले",
      "Oral Rehydration Salts — 0 packets remaining": "ओआरएस — 0 पाकिटे शिल्लक",
      "PHC Ward 4 Central": "पीएचसी प्रभाग 4 मुख्य",
      "Stocked": "पुरेसा साठा",
      "All essential antibiotics & analgesics above safe buffer": "सर्व महत्त्वाची प्रतिजैविके व औषधे सुरक्षित पातळीवर",
      "District Hospital Pharmacy": "जिल्हा रुग्णालय औषधालय",
      "1 Low Stock": "1 कमी साठा",
      "Insulin Regular — 40 vials (threshold 60 vials)": "इन्सुलिन रेगुलर — 40 बाटल्या (किमान 60 आवश्यक)",

      // Patient Module
      "Damodar Kumar Singh": "दामोदर कुमार सिंग",
      "Ramesh Patil": "रमेश पाटील",
      "Ramesh Patil · Personal Record": "रमेश पाटील · वैयक्तिक नोंद",
      "Digital Health Locker": "डिजिटल आरोग्य लॉकर",
      "ABHA ID: 91-8507-4746-3815 · Ayushman Bharat": "आभा आयडी: 91-8507-4746-3815 · आयुष्मान भारत",
      "ABHA ID: 12-3456-7890 · Ayushman Bharat": "आभा आयडी: 12-3456-7890 · आयुष्मान भारत",
      "Your Village Healthcare & Wellness Hub": "तुमचे गाव आरोग्य आणि कल्याण केंद्र",
      "Connect directly with primary doctors from your village, store lab reports and verified digital prescriptions in your Ayushman Bharat health account.": "गावातील डॉक्टरांशी थेट संपर्क साधा, लॅब अहवाल आणि डिजिटल औषध चिठ्ठ्या आभा खात्यात सुरक्षित ठेवा.",
      "Assigned Doctor": "नेमलेले डॉक्टर",
      "Token #04": "टोकन #04",
      "Current Queue": "सध्याची रांग",
      "Free Meds": "मोफत औषधे",
      "At PHC Dispensary": "पीएचसी औषधालयात",
      "Book Care": "भेट निश्चित करा",
      "Appointments & Queue": "भेटी आणि रांग",
      "Join Teleconsult": "टेलिकन्सल्टमध्ये सामील व्हा",
      "Live with Dr. Rajesh": "डॉ. राजेश यांच्याशी थेट",
      "Health Record": "आरोग्य नोंद",
      "Prescriptions & history": "प्रिस्क्रिप्शन व इतिहास",
      "Meds & Tests": "औषधे आणि चाचण्या",
      "Active dosages": "सध्याचे डोस",
      "Book Appointment": "अपॉइंटमेंट बुक करा",
      "Schedule in-person or teleconsultation care": "प्रत्यक्ष किंवा टेलिकन्सल्टेशन काळजी शेड्यूल करा",
      "Select Health Facility": "आरोग्य केंद्र निवडा",
      "PHC Ward 4 — Dr. Rajesh Kumar": "पीएचसी प्रभाग 4 — डॉ. राजेश कुमार",
      "District Hospital — Cardiology Department": "जिल्हा रुग्णालय — कार्डिओलॉजी विभाग",
      "Select Preferred Consultation Slot": "पसंतीची वेळ निवडा",
      "2:00 PM": "दुपारी 2:00",
      "3:30 PM": "दुपारी 3:30",
      "5:00 PM": "संध्याकाळी 5:00",
      "Appointment confirmed for 2:00 PM": "दुपारी 2:00 वाजता भेट निश्चित झाली",
      "#3 in Queue": "रांगेत #3",
      "Estimated wait time:": "अंदाजे प्रतीक्षा वेळ:",
      "12 minutes": "12 मिनिटे",
      "Patient Teleconsultation": "रुग्ण टेलिकन्सल्टेशन",
      "Live Video Consultation with Dr. Rajesh Kumar": "डॉ. राजेश कुमार यांच्याशी थेट व्हिडिओ सल्लामसलत",
      "● High Speed": "● उच्च गती",
      "Doctor's Direct Guidance": "डॉक्टरांचे थेट मार्गदर्शन",
      "My Digital Health History": "माझा डिजिटल आरोग्य इतिहास",
      "ABHA Linked Records across all clinics and hospitals": "सर्व दवाखाने व रुग्णालयांमधील आभा नोंदी",
      "Active Medications & Tests": "सध्याची औषधे आणि चाचण्या",
      "Current treatment plan and scheduled lab appointments": "सध्याची उपचार योजना आणि ठरलेल्या चाचण्या",
      "Prescribed Medications": "दिलेली औषधे",
      "1 capsule morning, 1 night · 5 days": "1 कॅप्सूल सकाळी, 1 रात्री · 5 दिवस",
      "Active": "सक्रिय",
      "Diagnostic Tests Scheduled": "नियोजित निदान चाचण्या",
      "Ordered by Dr. Rajesh Kumar · District Diagnostic Hub": "डॉ. राजेश कुमार यांनी दिलेली · जिल्हा तपासणी केंद्र",

      // Bottom Navigation Tabs
      "Home": "मुख्यपृष्ठ",
      "Triage": "ट्रायेज",
      "Referrals": "रेफरल्स",
      "Stock": "औषध साठा",
      "Queue": "रांग",
      "Diagnostics": "निदान",
      "Schedule": "वेळापत्रक",
      "Dashboard": "डॅशबोर्ड",
      "Book": "बुक करा",
      "Records": "नोंदी",
      "Meds": "औषधे",
      "Exit": "बाहेर पडा",

      // Install Modal
      "Install Pulse Predictor": "पल्स प्रेडिक्टर स्थापित करा",
      "Fast offline access on your phone": "आपल्या फोनवर जलद ऑफलाइन वापर",
      "Install on iPhone / iPad": "iPhone / iPad वर स्थापित करा",
      "Install on Android / Desktop": "Android / संगणकावर स्थापित करा",
      "Add Pulse Predictor to your Home Screen": "होम स्क्रीनवर पल्स प्रेडिक्टर जोडा",
      "Tap the Share button in the Safari bottom toolbar.": "सफारीच्या तळाशी असलेल्या टूलबारमधील शेअर बटणावर टॅप करा.",
      "Scroll down the action sheet and tap Add to Home Screen.": "खाली स्क्रोल करा आणि 'होम स्क्रीनवर जोडा' वर टॅप करा.",
      "Tap Add in the top right corner. The app will launch in full screen!": "वरच्या उजव्या कोपऱ्यात 'जोडा' वर टॅप करा. अॅप पूर्ण स्क्रीनमध्ये उघडेल!",
      "Tap the browser menu button in your browser toolbar.": "आपल्या ब्राउझर टूलबारमधील तीन ठिपके (मेनू) वर टॅप करा.",
      "Select Install app or Add to Home screen.": "'अॅप स्थापित करा' किंवा 'होम स्क्रीनवर जोडा' निवडा.",
      "Confirm prompt. Pulse Predictor will be added to your home screen with 100% offline access.": "पुष्टी करा. पल्स प्रेडिक्टर 100% ऑफलाइन क्षमतेसह आपल्या होम स्क्रीनवर जोडले जाईल.",
      "Open in New Tab": "नवीन टॅबमध्ये उघडा",
      "Got It, Close": "समजले, बंद करा",
      "Close": "बंद करा"
    }
  };

  // State & Memory
  let currentLanguage = "en";
  const sourceText = new WeakMap();
  const sourceAttributes = new WeakMap();
  let isTranslating = false;

  function normalize(str) {
    if (!str) return "";
    return str.replace(/\s+/g, " ").trim();
  }

  function translate(rawText, lang = currentLanguage) {
    if (!rawText || lang === "en") return rawText;
    const dict = translations[lang];
    if (!dict) return rawText;

    const trimmed = normalize(rawText);
    if (dict[trimmed]) return dict[trimmed];
    if (dict[rawText]) return dict[rawText];

    // Case-insensitive fallback
    const lower = trimmed.toLowerCase();
    for (const [k, v] of Object.entries(dict)) {
      if (k.toLowerCase() === lower) return v;
    }

    // Number & unit pattern replacements
    let result = trimmed;
    if (lang === "hi") {
      result = result
        .replace(/(\d+)\s*mins?/gi, "$1 मिनट")
        .replace(/(\d+)\s*m\b/gi, "$1 मिनट")
        .replace(/Waiting\s*(\d+)m/gi, "$1 मिनट से प्रतीक्षारत")
        .replace(/(\d+)\s*Beds/gi, "$1 बिस्तर")
        .replace(/ETA:\s*(\d+)\s*hours?/gi, "अनुमानित समय: $1 घंटे")
        .replace(/ETA:\s*(\d+)m/gi, "अनुमानित समय: $1 मिनट");
    } else if (lang === "mr") {
      result = result
        .replace(/(\d+)\s*mins?/gi, "$1 मिनिटे")
        .replace(/(\d+)\s*m\b/gi, "$1 मिनिटे")
        .replace(/Waiting\s*(\d+)m/gi, "$1 मिनिटे प्रतीक्षा")
        .replace(/(\d+)\s*Beds/gi, "$1 बेड्स")
        .replace(/ETA:\s*(\d+)\s*hours?/gi, "अंदाजे वेळ: $1 तास")
        .replace(/ETA:\s*(\d+)m/gi, "अंदाजे वेळ: $1 मिनिटे");
    }

    return result !== trimmed ? result : rawText;
  }

  function applyTranslations() {
    if (isTranslating) return;
    isTranslating = true;

    try {
      // 1. Walk all text nodes
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      for (const node of textNodes) {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE"].includes(parent.tagName)) continue;
        if (parent.tagName === "OPTION" && parent.parentElement && parent.parentElement.id === "languageSelector") continue;

        const original = sourceText.get(node) ?? node.nodeValue;
        sourceText.set(node, original);

        if (currentLanguage === "en") {
          node.nodeValue = original;
        } else {
          const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
          if (match && match[2]) {
            const translatedCore = translate(match[2], currentLanguage);
            node.nodeValue = `${match[1]}${translatedCore}${match[3]}`;
          }
        }
      }

      // 2. Translate attributes: placeholder, title, aria-label, input values
      document.querySelectorAll("[placeholder], [title], [aria-label]").forEach((elem) => {
        const original = sourceAttributes.get(elem) ?? {
          placeholder: elem.getAttribute("placeholder"),
          title: elem.getAttribute("title"),
          ariaLabel: elem.getAttribute("aria-label"),
        };
        sourceAttributes.set(elem, original);

        if (currentLanguage === "en") {
          if (original.placeholder !== null) elem.setAttribute("placeholder", original.placeholder);
          if (original.title !== null) elem.setAttribute("title", original.title);
          if (original.ariaLabel !== null) elem.setAttribute("aria-label", original.ariaLabel);
        } else {
          if (original.placeholder) elem.setAttribute("placeholder", translate(original.placeholder, currentLanguage));
          if (original.title) elem.setAttribute("title", translate(original.title, currentLanguage));
          if (original.ariaLabel) elem.setAttribute("aria-label", translate(original.ariaLabel, currentLanguage));
        }
      });

      // 3. Translate buttons with type submit or button
      document.querySelectorAll("button, input[type='submit']").forEach((btn) => {
        if (btn.tagName === "INPUT") {
          const orig = sourceAttributes.get(btn)?.value ?? btn.value;
          sourceAttributes.set(btn, { value: orig });
          btn.value = currentLanguage === "en" ? orig : translate(orig, currentLanguage);
        }
      });

      // Synchronize language selector dropdowns
      document.querySelectorAll("#languageSelector, .login-lang-select").forEach((sel) => {
        if (sel.value !== currentLanguage) sel.value = currentLanguage;
      });

      document.documentElement.lang = currentLanguage;
    } finally {
      setTimeout(() => {
        isTranslating = false;
      }, 30);
    }
  }

  function setLanguage(language) {
    currentLanguage = ["en", "hi", "mr"].includes(language) ? language : "en";
    try {
      localStorage.setItem("swasthya-setu-language", currentLanguage);
    } catch (_) {}
    applyTranslations();
  }

  // Automatic observer: translates dynamically created nodes (tab switches, modals, tables)
  let domTimer = null;
  const domObserver = new MutationObserver(() => {
    if (isTranslating || currentLanguage === "en") return;
    clearTimeout(domTimer);
    domTimer = setTimeout(() => {
      applyTranslations();
    }, 40);
  });

  window.addEventListener("DOMContentLoaded", () => {
    try {
      const saved = localStorage.getItem("swasthya-setu-language") || "en";
      currentLanguage = ["en", "hi", "mr"].includes(saved) ? saved : "en";
    } catch (_) {
      currentLanguage = "en";
    }

    applyTranslations();

    if (document.body) {
      domObserver.observe(document.body, { childList: true, subtree: true, characterData: false });
    }
  });

  // Export globally
  window.PulseTranslator = {
    setLanguage,
    applyTranslations,
    translate,
    get currentLanguage() { return currentLanguage; },
    translations
  };

  window.translate = translate;
  window.setLanguage = setLanguage;
  window.applyTranslations = applyTranslations;
})();
