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
  const primaryCondition = analysis.possibleConditions[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 sm:space-y-5"
    >
      {primaryCondition && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl border border-indigo-100">
          <p className="text-xs sm:text-sm text-gray-700">
            <span className="font-semibold text-gray-900">
              {t('basedOnSymptomsYouMayBeExperiencing')}
            </span>{' '}
            <span className="font-semibold text-indigo-700">
              {primaryCondition.name}
            </span>
            {primaryCondition.probability != null && (
              <span className="text-gray-600">
                {t('approxLikelihood', { percent: primaryCondition.probability })}
              </span>
            )}
          </p>
        </div>
      )}

      <DualConfidenceGauge
        diagnosticConfidence={analysis.confidenceScore}
        informationCompleteness={analysis.informationCompleteness}
      />

      <RiskStratification analysis={analysis} />

      <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
            <Brain className="text-white" size={18} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            {t('possibleConditions')}
          </h3>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {analysis.possibleConditions.map((condition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-purple-100 hover:shadow-md transition-shadow"
            >
              <span className="text-sm sm:text-base text-gray-800 font-semibold">{condition.name}</span>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-24 sm:w-36 bg-gray-200 rounded-full h-2 sm:h-2.5 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${condition.probability}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-indigo-600 w-10 sm:w-12 text-right">
                  {condition.probability}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🧠</span>
          {t('reasoning')}
        </h3>
        <ul className="space-y-2 sm:space-y-3">
          {analysis.reasoning.map((reason, index) => (
            <motion.li 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 sm:gap-3 text-gray-700 p-2.5 sm:p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg sm:rounded-xl text-xs sm:text-sm"
            >
              <span className="text-indigo-600 font-bold text-base sm:text-lg">•</span>
              <span className="leading-relaxed">{reason}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {analysis.followUpQuestions.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
              <HelpCircle className="text-white" size={18} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              {t('followUpQuestions')}
            </h3>
          </div>
          <ul className="space-y-2 sm:space-y-3">
            {analysis.followUpQuestions.map((question, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 sm:gap-3 text-gray-700 p-2.5 sm:p-3 bg-gradient-to-r from-amber-50 to-transparent rounded-lg sm:rounded-xl text-xs sm:text-sm"
              >
                <span className="text-amber-600 font-bold min-w-[20px] sm:min-w-[24px]">{index + 1}.</span>
                <span className="leading-relaxed">{question}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg">
        <p className="text-xs sm:text-sm text-amber-900 text-center font-medium flex items-center justify-center gap-2">
          <span className="text-lg sm:text-xl">⚠️</span>
          {t('disclaimer')}
        </p>
      </div>
    </motion.div>
  );
}
