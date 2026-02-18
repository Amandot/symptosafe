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
        'Safety-first approach: Emergency keywords are detected instantly before AI analysis',
        'AI-powered analysis using OpenAI GPT-4 to evaluate symptoms',
        'Dual confidence scoring: Diagnostic confidence and information completeness',
        'Risk stratification based on symptom severity',
        'Follow-up questions to gather more information',
      ],
    },
    {
      id: 'limitations',
      title: t('limitations'),
      icon: AlertCircle,
      content: [
        'This tool cannot replace professional medical diagnosis',
        'AI may not detect rare or complex conditions',
        'Accuracy depends on the quality and completeness of information provided',
        'Cannot perform physical examinations or diagnostic tests',
        'Should not be used for emergency situations - call emergency services',
        'Confidence scores below 50% indicate high uncertainty',
      ],
    },
    {
      id: 'privacy',
      title: t('dataPrivacy'),
      icon: Shield,
      content: [
        'Anonymous users: No data is stored permanently',
        'Logged-in users: Symptom history saved securely in Firebase',
        'Data is encrypted in transit and at rest',
        'No personal health information is shared with third parties',
        'You can delete your account and data at any time',
        'OpenAI API processes symptoms but does not retain data',
      ],
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-purple-100">
      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-5">
        Transparency & Safety
      </h3>

      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} className="border-2 border-purple-100 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-50/50 to-transparent">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="font-bold text-gray-800">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp size={20} className="text-indigo-600" />
                ) : (
                  <ChevronDown size={20} className="text-indigo-600" />
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
                    <div className="px-5 pb-5 pt-2 bg-gradient-to-r from-purple-50 to-indigo-50">
                      <ul className="space-y-2.5">
                        {section.content.map((item, index) => (
                          <motion.li 
                            key={index} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 text-sm text-gray-700 p-2 bg-white/50 rounded-lg"
                          >
                            <span className="text-indigo-600 font-bold text-base">•</span>
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
