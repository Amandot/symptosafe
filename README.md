# SymptoSafe - AI-Powered Symptom Checker

A production-grade, failure-aware AI symptom checker built with Next.js 14, TypeScript, and OpenAI.

## 🌟 Features

### Safety-First Architecture
- **Rule-Based Emergency Detection**: Instant detection of critical symptoms before AI analysis
- **Dual Confidence Scoring**: Transparent diagnostic confidence and information completeness metrics
- **Risk Stratification**: Clear risk levels (Critical, High, Medium, Low) with actionable recommendations
- **Emergency Escalation**: Full-screen alerts with direct links to emergency services

### AI-Powered Analysis
- **OpenAI GPT-4 Integration**: Advanced symptom analysis with structured responses
- **Differential Diagnosis**: Multiple possible conditions with probability estimates
- **Follow-up Questions**: Intelligent questioning to gather more information
- **Uncertainty Transparency**: Always expresses limitations and recommends professional care

### Privacy & Security
- **Firebase Authentication**: Secure Google Sign-In and Email/Password authentication
- **Conditional Data Storage**: Anonymous users have no data stored; logged-in users can save history
- **Encrypted Storage**: All data encrypted in transit and at rest
- **No Third-Party Sharing**: Health information stays private

### User Experience
- **Multi-Language Support**: English, Hindi, and Marathi
- **Caregiver Mode**: Describe symptoms for someone else
- **Hospital Finder**: Quick access to nearby hospitals
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Glass Morphism UI**: Modern, accessible design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- Firebase project (optional, for authentication)

### Installation

1. Clone and navigate to the project:
```bash
cd symptosafe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your keys:
```env
OPENAI_API_KEY=your_openai_api_key_here

# Firebase (optional - app works without auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Try these test scenarios:

1. **Normal Symptoms**: "I have headache and fever"
2. **Emergency**: "Severe chest pain and breathing problem"
3. **Vague Symptoms**: "I don't feel well"

Use the "Test Scenarios" button in the bottom-right corner for quick testing.

## 🏗️ Architecture

### Safety Engine (`lib/safety-engine.ts`)
- Runs BEFORE AI analysis
- Detects emergency keywords instantly
- Returns structured emergency results
- Covers: chest pain, stroke, breathing issues, bleeding, suicide, seizures, overdose, burns

### AI Engine (`lib/ai-engine.ts`)
- OpenAI GPT-4 integration
- Structured JSON responses
- Confidence scoring (0-100)
- Information completeness tracking
- Risk level assessment
- Follow-up question generation

### State Management (`lib/store/useAppStore.ts`)
- Zustand for global state
- User authentication state
- Message history
- Analysis results
- Emergency status
- Language preferences

### Firebase Integration
- `lib/firebase/config.ts`: Firebase initialization
- `lib/firebase/auth-service.ts`: Authentication methods
- `lib/firebase/firestore-service.ts`: Data persistence

### API Routes
- `app/api/analyze/route.ts`: Main analysis endpoint
  1. Validates request
  2. Runs safety check
  3. Performs AI analysis if safe
  4. Returns structured response

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **State Management**: Zustand
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🔒 Security Best Practices

1. **API Key Protection**: OpenAI key stored server-side only
2. **Input Validation**: All user inputs validated
3. **Error Handling**: Graceful error messages without exposing internals
4. **Rate Limiting**: Consider implementing rate limiting in production
5. **HTTPS Only**: Always use HTTPS in production
6. **Firebase Rules**: Configure Firestore security rules

## 🌍 Internationalization

Supported languages:
- English (en)
- Hindi (hi)
- Marathi (mr)

Add more languages in `lib/i18n/translations.ts`

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the production bundle:
```bash
npm run build
npm start
```

## ⚠️ Important Disclaimers

1. **Not Medical Advice**: This tool is for informational purposes only
2. **Emergency Situations**: Always call emergency services for serious symptoms
3. **Professional Care**: Always consult healthcare professionals for diagnosis
4. **AI Limitations**: AI can make mistakes and miss rare conditions
5. **Data Accuracy**: Results depend on information quality provided

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

Contributions welcome! Please ensure:
- Code follows TypeScript best practices
- All features are tested
- Documentation is updated
- Security best practices are maintained

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review test scenarios
3. Verify environment variables
4. Check browser console for errors

## 🎯 Future Enhancements

- [ ] Voice input for symptoms
- [ ] Image upload for visual symptoms
- [ ] Integration with telemedicine platforms
- [ ] Symptom tracking over time
- [ ] Family health profiles
- [ ] Medication interaction checker
- [ ] Health tips and preventive care

---

Built with ❤️ for better healthcare accessibility
