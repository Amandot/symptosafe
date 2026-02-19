'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, LogOut, LogIn, Shield, Sparkles, HeartPulse } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { onAuthChange, logout } from '@/lib/firebase/auth-service';
import { saveSession } from '@/lib/firebase/firestore-service';
import { useTranslation } from '@/lib/i18n/useTranslation';
import ChatInterface from '@/components/ChatInterface';
import ResultsPanel from '@/components/ResultsPanel';
import EmergencyAlert from '@/components/EmergencyAlert';
import AuthModal from '@/components/AuthModal';
import LanguageSelector from '@/components/LanguageSelector';
import TransparencyPanel from '@/components/TransparencyPanel';
import CaregiverModePanel from '@/components/CaregiverModePanel';
import HospitalFinder from '@/components/HospitalFinder';
import FailureSimulationPanel from '@/components/FailureSimulationPanel';
import SessionDashboard from '@/components/SessionDashboard';
import SessionTrends from '@/components/SessionTrends';
import SymptomWizard from '@/components/SymptomWizard';
import FaqPanel from '@/components/FaqPanel';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const { t } = useTranslation();
  
  const {
    user,
    setUser,
    messages,
    analysis,
    emergency,
    language,
    resetSession,
  } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (user && messages.length > 0 && (analysis || emergency)) {
      const session = {
        id: uuidv4(),
        userId: user.uid,
        messages,
        analysis: analysis || undefined,
        emergency: emergency || undefined,
        timestamp: new Date(),
        language,
      };

      saveSession(session).catch(console.error);
    }
  }, [user, messages, analysis, emergency, language]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      resetSession();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {emergency?.isEmergency && <EmergencyAlert emergency={emergency} />}

      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('appName')}
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-600 font-medium hidden xs:block">{t('tagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full ring-2 ring-purple-200 shadow-md"
                  />
                )}
                <span className="text-xs sm:text-sm text-gray-700 font-medium hidden md:inline">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm"
                >
                  <LogOut size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{t('signOut')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl"
              >
                <LogIn size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{t('signIn')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {showDashboard ? (
            <motion.section
              key="dashboard"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-4 sm:space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
                <motion.div
                  className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-purple-100 p-4 sm:p-8 relative overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="absolute -right-24 -top-24 w-72 h-72 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-indigo-50 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-medium text-indigo-700 border border-indigo-100">
                      <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span className="hidden xs:inline">Safety-first AI symptom dashboard</span>
                      <span className="xs:hidden">AI Dashboard</span>
                    </div>
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900">
                      Understand your health with{' '}
                      <span className="gradient-text">transparent AI</span>
                    </h2>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-xl">
                      SymptoSafe analyzes your symptoms with dual confidence scoring, risk
                      stratification, and instant emergency detection — all wrapped in a
                      transparent, safety-focused experience.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 text-indigo-600 font-semibold text-xs sm:text-sm">
                          <Shield size={16} className="sm:w-[18px] sm:h-[18px]" />
                          Safety Engine
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-600">
                          Detects life‑threatening emergencies before any AI analysis and
                          pushes clear call‑to‑action guidance.
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -4 }}
                        className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 text-purple-600 font-semibold text-xs sm:text-sm">
                          <HeartPulse size={16} className="sm:w-[18px] sm:h-[18px]" />
                          Dual Confidence
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-600">
                          Visual gauges for diagnostic confidence and information
                          completeness so users see how certain the AI really is.
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -4 }}
                        className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 text-pink-600 font-semibold text-xs sm:text-sm">
                          <Activity size={16} className="sm:w-[18px] sm:h-[18px]" />
                          Explainable Results
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-600">
                          Clear reasoning, follow‑up questions, and risk‑based
                          recommendations powered by GPT‑4.
                        </p>
                      </motion.div>
                    </div>

                    <div className="mt-4 sm:mt-6 flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-3 items-start xs:items-center">
                      <motion.button
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDashboard(false)}
                        className="w-full xs:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        Start symptom analysis
                      </motion.button>

                      <span className="text-[10px] sm:text-xs text-gray-500">
                        No login required · This is not a medical diagnosis
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <SessionDashboard />
                  <SessionTrends />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg"
              >
                <p className="text-center text-xs sm:text-sm text-amber-900 font-medium flex items-center justify-center gap-2">
                  <span className="text-lg sm:text-2xl">⚠️</span>
                  <span>{t('disclaimer')}</span>
                </p>
              </motion.div>
            </motion.section>
          ) : (
            <motion.section
              key="app"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-purple-100"
                    style={{ height: '500px', minHeight: '400px' }}
                  >
                    <ChatInterface />
                  </motion.div>

                  {analysis && <ResultsPanel analysis={analysis} />}
                </div>

                <div className="space-y-3 sm:space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <CaregiverModePanel />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <SymptomWizard />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <HospitalFinder />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <TransparencyPanel />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <FaqPanel />
                  </motion.div>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 sm:mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg"
              >
                <p className="text-center text-xs sm:text-sm text-amber-900 font-medium flex items-center justify-center gap-2">
                  <span className="text-lg sm:text-2xl">⚠️</span>
                  <span>{t('disclaimer')}</span>
                </p>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <FailureSimulationPanel />
    </div>
  );
}
