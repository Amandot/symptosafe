'use client';

import { motion } from 'framer-motion';
import { Brain, HelpCircle } from 'lucide-react';
import type { AIAnalysisResult } from '@/types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import DualConfidenceGauge from './DualConfidenceGauge';
import RiskStratification from './RiskStratification';

interface ResultsPanelProps {
  analysis: AIAnalysisResult;
}

export default function ResultsPanel({ analysis }: ResultsPanelProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <DualConfidenceGauge
        diagnosticConfidence={analysis.confidenceScore}
        informationCompleteness={analysis.informationCompleteness}
      />

      <RiskStratification analysis={analysis} />

      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-purple-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl">
            <Brain className="text-white" size={22} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {t('possibleConditions')}
          </h3>
        </div>
        <div className="space-y-3">
          {analysis.possibleConditions.map((condition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 hover:shadow-md transition-shadow"
            >
              <span className="text-gray-800 font-semibold">{condition.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-36 bg-gray-200 rounded-full h-2.5 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${condition.probability}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-indigo-600 w-12 text-right">
                  {condition.probability}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-purple-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          {t('reasoning')}
        </h3>
        <ul className="space-y-3">
          {analysis.reasoning.map((reason, index) => (
            <motion.li 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 text-gray-700 p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-xl"
            >
              <span className="text-indigo-600 font-bold text-lg">•</span>
              <span className="leading-relaxed">{reason}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {analysis.followUpQuestions.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-purple-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl">
              <HelpCircle className="text-white" size={22} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {t('followUpQuestions')}
            </h3>
          </div>
          <ul className="space-y-3">
            {analysis.followUpQuestions.map((question, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-gray-700 p-3 bg-gradient-to-r from-amber-50 to-transparent rounded-xl"
              >
                <span className="text-amber-600 font-bold min-w-[24px]">{index + 1}.</span>
                <span className="leading-relaxed">{question}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 shadow-lg">
        <p className="text-sm text-amber-900 text-center font-medium flex items-center justify-center gap-2">
          <span className="text-xl">⚠️</span>
          {t('disclaimer')}
        </p>
      </div>
    </motion.div>
  );
}
