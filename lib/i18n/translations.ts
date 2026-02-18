import type { Language } from '@/types';

export const translations = {
  en: {
    appName: 'SymptoSafe',
    tagline: 'AI-Powered Symptom Analysis',
    disclaimer: 'This is not a substitute for professional medical advice',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    signInWithGoogle: 'Sign in with Google',
    
    // Chat
    typeSymptoms: 'Describe your symptoms...',
    send: 'Send',
    analyzing: 'Analyzing...',
    
    // Emergency
    emergency: 'EMERGENCY DETECTED',
    callEmergency: 'Call Emergency Services',
    findHospital: 'Find Nearest Hospital',
    
    // Results
    possibleConditions: 'Possible Conditions',
    reasoning: 'Reasoning',
    followUpQuestions: 'Follow-up Questions',
    diagnosticConfidence: 'Diagnostic Confidence',
    informationCompleteness: 'Information Completeness',
    riskLevel: 'Risk Level',
    
    // Risk Levels
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Recommendations
    seekImmediateCare: 'Seek immediate medical care',
    consultDoctor: 'Consult a doctor soon',
    monitorSymptoms: 'Monitor symptoms',
    
    // Transparency / Dashboard / Extras
    howItWorks: 'How It Works',
    limitations: 'Limitations',
    dataPrivacy: 'Data Privacy',
    dashboardSubtitle: 'Safety-first AI symptom dashboard',
    projectAtGlance: 'Project at a glance',
    flowTitle: 'How the experience flows',
    faqTitle: 'Using SymptoSafe safely',
    
    // Language
    selectLanguage: 'Select Language',
    
    // Caregiver
    caregiverMode: 'Caregiver Mode',
    describeForSomeone: 'Describing symptoms for someone else',
  },
  hi: {
    appName: 'सिम्प्टोसेफ',
    tagline: 'एआई-संचालित लक्षण विश्लेषण',
    disclaimer: 'यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है',
    
    signIn: 'साइन इन करें',
    signUp: 'साइन अप करें',
    signOut: 'साइन आउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    signInWithGoogle: 'Google से साइन इन करें',
    
    typeSymptoms: 'अपने लक्षणों का वर्णन करें...',
    send: 'भेजें',
    analyzing: 'विश्लेषण कर रहे हैं...',
    
    emergency: 'आपातकाल का पता चला',
    callEmergency: 'आपातकालीन सेवाएं कॉल करें',
    findHospital: 'निकटतम अस्पताल खोजें',
    
    possibleConditions: 'संभावित स्थितियां',
    reasoning: 'तर्क',
    followUpQuestions: 'अनुवर्ती प्रश्न',
    diagnosticConfidence: 'निदान विश्वास',
    informationCompleteness: 'जानकारी पूर्णता',
    riskLevel: 'जोखिम स्तर',
    
    critical: 'गंभीर',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कम',
    
    seekImmediateCare: 'तत्काल चिकित्सा देखभाल लें',
    consultDoctor: 'जल्द ही डॉक्टर से परामर्श करें',
    monitorSymptoms: 'लक्षणों की निगरानी करें',
    
    howItWorks: 'यह कैसे काम करता है',
    limitations: 'सीमाएं',
    dataPrivacy: 'डेटा गोपनीयता',
    dashboardSubtitle: 'सुरक्षा-प्रथम एआई लक्षण डैशबोर्ड',
    projectAtGlance: 'परियोजना एक नज़र में',
    flowTitle: 'अनुभव कैसे चलता है',
    faqTitle: 'सिम्प्टोसेफ का सुरक्षित उपयोग',
    
    selectLanguage: 'भाषा चुनें',
    
    caregiverMode: 'देखभालकर्ता मोड',
    describeForSomeone: 'किसी और के लिए लक्षणों का वर्णन',
  },
  mr: {
    appName: 'सिम्प्टोसेफ',
    tagline: 'एआय-चालित लक्षण विश्लेषण',
    disclaimer: 'हे व्यावसायिक वैद्यकीय सल्ल्याचा पर्याय नाही',
    
    signIn: 'साइन इन करा',
    signUp: 'साइन अप करा',
    signOut: 'साइन आउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    signInWithGoogle: 'Google सह साइन इन करा',
    
    typeSymptoms: 'तुमच्या लक्षणांचे वर्णन करा...',
    send: 'पाठवा',
    analyzing: 'विश्लेषण करत आहे...',
    
    emergency: 'आणीबाणी आढळली',
    callEmergency: 'आणीबाणी सेवा कॉल करा',
    findHospital: 'जवळचे रुग्णालय शोधा',
    
    possibleConditions: 'संभाव्य परिस्थिती',
    reasoning: 'तर्क',
    followUpQuestions: 'पाठपुरावा प्रश्न',
    diagnosticConfidence: 'निदान आत्मविश्वास',
    informationCompleteness: 'माहिती पूर्णता',
    riskLevel: 'जोखीम पातळी',
    
    critical: 'गंभीर',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कमी',
    
    seekImmediateCare: 'तात्काळ वैद्यकीय सेवा घ्या',
    consultDoctor: 'लवकरच डॉक्टरांचा सल्ला घ्या',
    monitorSymptoms: 'लक्षणांचे निरीक्षण करा',
    
    howItWorks: 'हे कसे कार्य करते',
    limitations: 'मर्यादा',
    dataPrivacy: 'डेटा गोपनीयता',
    dashboardSubtitle: 'सेफ्टी-फर्स्ट एआय लक्षण डॅशबोर्ड',
    projectAtGlance: 'प्रकल्प झटपट दृष्टीक्षेपात',
    flowTitle: 'अनुभव कसा वाहतो',
    faqTitle: 'सिम्प्टोसेफ सुरक्षितपणे वापरणे',
    
    selectLanguage: 'भाषा निवडा',
    
    caregiverMode: 'काळजीवाहक मोड',
    describeForSomeone: 'दुसऱ्या कोणासाठी लक्षणांचे वर्णन',
  }
};
