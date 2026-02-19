'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Shield, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function TransparencyPanel() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { t } = useTranslation();

  const sections = [
    {
      id: 'how-it-works',
      title: t('howItWorks'),
      icon: Info,
      content: [
        t('transparencyHow1'),
        t('transparencyHow2'),
        t('transparencyHow3'),
        t('transparencyHow4'),
        t('transparencyHow5'),
      ],
    },
    {
      id: 'limitations',
      title: t('limitations'),
      icon: AlertCircle,
      content: [
        t('transparencyLimit1'),
        t('transparencyLimit2'),
        t('transparencyLimit3'),
        t('transparencyLimit4'),
        t('transparencyLimit5'),
        t('transparencyLimit6'),
      ],
    },
    {
      id: 'privacy',
      title: t('dataPrivacy'),
      icon: Shield,
      content: [
        t('transparencyPrivacy1'),
        t('transparencyPrivacy2'),
        t('transparencyPrivacy3'),
        t('transparencyPrivacy4'),
        t('transparencyPrivacy5'),
        t('transparencyPrivacy6'),
      ],
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100">
      <h3 className="text-base sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-5">
        {t('transparencyAndSafety')}
      </h3>

      <div className="space-y-2 sm:space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} className="border-2 border-purple-100 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-purple-50/50 to-transparent">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-purple-50 transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                    <Icon size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
                  </div>
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} className="sm:w-5 sm:h-5 text-indigo-600" />
                ) : (
                  <ChevronDown size={18} className="sm:w-5 sm:h-5 text-indigo-600" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-3 sm:px-5 pb-3 sm:pb-5 pt-1 sm:pt-2 bg-gradient-to-r from-purple-50 to-indigo-50">
                      <ul className="space-y-2 sm:space-y-2.5">
                        {section.content.map((item, index) => (
                          <motion.li 
                            key={index} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 p-2 bg-white/50 rounded-lg"
                          >
                            <span className="text-indigo-600 font-bold text-sm sm:text-base">•</span>
                            <span className="leading-relaxed">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
