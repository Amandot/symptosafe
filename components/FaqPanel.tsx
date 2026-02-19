'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function FaqPanel() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { t } = useTranslation();

  const FAQ_ITEMS = [
    {
      id: 'when-to-use',
      question: t('faqWhenToUseQ'),
      answer: t('faqWhenToUseA'),
    },
    {
      id: 'not-for',
      question: t('faqNotForQ'),
      answer: t('faqNotForA'),
    },
    {
      id: 'how-ai',
      question: t('faqHowAiQ'),
      answer: t('faqHowAiA'),
    },
    {
      id: 'doctor-role',
      question: t('faqDoctorQ'),
      answer: t('faqDoctorA'),
    },
  ];

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl border border-purple-100 h-full">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
          <HelpCircle size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900">{t('faqTitle')}</h3>
          <p className="text-[10px] sm:text-[11px] text-gray-500 hidden xs:block">
            {t('faqSubtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="border border-amber-100 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-50/70 to-transparent"
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between px-2.5 sm:px-3 py-2 text-left"
              >
                <span className="text-[11px] sm:text-xs font-semibold text-gray-800">
                  {item.question}
                </span>
                {isOpen ? (
                  <ChevronUp size={14} className="sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                ) : (
                  <ChevronDown size={14} className="sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-2.5 sm:px-3 pb-2 sm:pb-3 text-[10px] sm:text-[11px] text-gray-700">
                      {item.answer}
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


