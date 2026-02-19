'use client';

import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, MapPin, User } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { useTranslation } from '@/lib/i18n/useTranslation';

const tabs = [
  { id: 'checker', icon: MessageSquare },
  { id: 'insights', icon: TrendingUp },
  { id: 'hospitals', icon: MapPin },
  { id: 'profile', icon: User },
] as const;

export default function Navbar() {
  const { activeTab, setActiveTab } = useAppStore();
  const { t } = useTranslation();

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-auto max-w-lg px-4 pb-4">
        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-2">
          <div className="flex items-center justify-around relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative z-10 flex flex-col items-center gap-1 px-6 py-2 transition-colors duration-200 flex-1"
                >
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {t(tab.id)}
                  </span>
                </button>
              );
            })}

            <motion.div
              className="absolute inset-y-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg"
              initial={false}
              animate={{
                left: `${(activeIndex / tabs.length) * 100}%`,
                width: `${100 / tabs.length}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
