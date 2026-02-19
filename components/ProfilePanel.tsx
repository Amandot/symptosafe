'use client';

import { motion } from 'framer-motion';
import { User, LogOut, LogIn, Shield, Activity, Calendar } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { logout } from '@/lib/firebase/auth-service';
import { useState } from 'react';
import AuthModal from './AuthModal';
import CaregiverModePanel from './CaregiverModePanel';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ProfilePanel() {
  const { user, setUser, resetSession, caregiverMode, setCaregiverMode } = useAppStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      resetSession();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <>
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 p-8 text-center">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <User size={48} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('signInToSymptoSafe')}</h2>
          <p className="text-gray-600 mb-6">
            {t('profileSignInSubtitle')}
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl mx-auto"
          >
            <LogIn size={20} />
            {t('signIn')}
          </button>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || t('user')}
              className="w-20 h-20 rounded-full ring-4 ring-purple-200 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.displayName || t('user')}
            </h2>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Activity size={20} />
              <span className="font-semibold text-sm">{t('accountStatus')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{t('active')}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Calendar size={20} />
              <span className="font-semibold text-sm">{t('memberSince')}</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {new Date(user.uid).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-pink-600 mb-2">
              <Shield size={20} />
              <span className="font-semibold text-sm">{t('privacy')}</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{t('protected')}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl transition-all duration-200 font-semibold shadow-sm"
        >
          <LogOut size={20} />
          {t('signOut')}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CaregiverModePanel />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5"
      >
        <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Shield size={20} />
          {t('privacyAndData')}
        </h3>
        <p className="text-sm text-amber-800">
          {t('privacyAndDataBody')}
        </p>
      </motion.div>
    </div>
  );
}
