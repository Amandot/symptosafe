'use client';

import { motion } from 'framer-motion';
import { Brain, HelpCircle, AlertTriangle, Heart, Lightbulb, TrendingUp, Stethoscope, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    selfCare: true,
    triggers: false,
    tracking: false,
    clinical: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getTriageColor = (triage: string) => {
    switch (triage) {
      case 'EMERGENCY_ROOM':
        return 'from-red-500 to-red-600';
      case 'URGENT_CARE':
        return 'from-orange-500 to-orange-600';
      case 'ROUTINE_CONSULTATION':
        return 'from-blue-500 to-blue-600';
      case 'SELF_CARE':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTriageLabel = (triage: string) => {
    switch (triage) {
      case 'EMERGENCY_ROOM':
        return 'Emergency Room';
      case 'URGENT_CARE':
        return 'Urgent Care';
      case 'ROUTINE_CONSULTATION':
        return 'Routine Consultation';
      case 'SELF_CARE':
        return 'Self Care';
      default:
        return 'Consult Healthcare Provider';
    }
  };

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

      {/* Triage Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${getTriageColor(analysis.triageRecommendation)} rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-white/20`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-xl">
            <Stethoscope className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-white/90 font-medium mb-1">{t('triageRecommendation') || 'Triage Recommendation'}</p>
            <p className="text-base sm:text-xl font-bold text-white">{getTriageLabel(analysis.triageRecommendation)}</p>
          </div>
        </div>
      </motion.div>

      {/* Red Flags */}
      {analysis.redFlags && analysis.redFlags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-gradient-to-br from-red-500 to-orange-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
              <AlertTriangle className="text-white" size={18} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-red-900">
              {t('redFlags') || 'Red Flags'}
            </h3>
          </div>
          <ul className="space-y-2 sm:space-y-3">
            {analysis.redFlags.map((flag, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 sm:gap-3 text-red-800 p-2.5 sm:p-3 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl text-xs sm:text-sm"
              >
                <span className="text-red-600 font-bold text-base sm:text-lg mt-0.5">⚠</span>
                <span className="leading-relaxed font-medium">{flag}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

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
              className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-purple-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
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
              </div>
              {condition.description && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">{condition.description}</p>
              )}
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

      {/* Self-Care Tips */}
      {analysis.selfCareTips && analysis.selfCareTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100"
        >
          <button
            onClick={() => toggleSection('selfCare')}
            className="flex items-center justify-between w-full mb-3 sm:mb-4"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
                <Lightbulb className="text-white" size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                {t('selfCareTips') || 'Self-Care Tips'}
              </h3>
            </div>
            {expandedSections.selfCare ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
          {expandedSections.selfCare && (
            <ul className="space-y-2 sm:space-y-3">
              {analysis.selfCareTips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 sm:gap-3 text-gray-700 p-2.5 sm:p-3 bg-gradient-to-r from-green-50 to-transparent rounded-lg sm:rounded-xl text-xs sm:text-sm"
                >
                  <span className="text-green-600 font-bold text-base sm:text-lg">•</span>
                  <span className="leading-relaxed">{tip}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      {/* Common Triggers */}
      {analysis.commonTriggers && analysis.commonTriggers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100"
        >
          <button
            onClick={() => toggleSection('triggers')}
            className="flex items-center justify-between w-full mb-3 sm:mb-4"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
                <TrendingUp className="text-white" size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                {t('commonTriggers') || 'Common Triggers'}
              </h3>
            </div>
            {expandedSections.triggers ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
          {expandedSections.triggers && (
            <ul className="space-y-2 sm:space-y-3">
              {analysis.commonTriggers.map((trigger, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 sm:gap-3 text-gray-700 p-2.5 sm:p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg sm:rounded-xl text-xs sm:text-sm"
                >
                  <span className="text-purple-600 font-bold text-base sm:text-lg">•</span>
                  <span className="leading-relaxed">{trigger}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      {/* Tracking Advice */}
      {analysis.trackingAdvice && analysis.trackingAdvice.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100"
        >
          <button
            onClick={() => toggleSection('tracking')}
            className="flex items-center justify-between w-full mb-3 sm:mb-4"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
                <Heart className="text-white" size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                {t('trackingAdvice') || 'Tracking Advice'}
              </h3>
            </div>
            {expandedSections.tracking ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
          {expandedSections.tracking && (
            <ul className="space-y-2 sm:space-y-3">
              {analysis.trackingAdvice.map((advice, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 sm:gap-3 text-gray-700 p-2.5 sm:p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg sm:rounded-xl text-xs sm:text-sm"
                >
                  <span className="text-blue-600 font-bold text-base sm:text-lg">•</span>
                  <span className="leading-relaxed">{advice}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      {/* Clinical Next Steps */}
      {analysis.clinicalNextSteps && analysis.clinicalNextSteps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100"
        >
          <button
            onClick={() => toggleSection('clinical')}
            className="flex items-center justify-between w-full mb-3 sm:mb-4"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl">
                <Stethoscope className="text-white" size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                {t('clinicalNextSteps') || 'Clinical Next Steps'}
              </h3>
            </div>
            {expandedSections.clinical ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
          {expandedSections.clinical && (
            <ul className="space-y-2 sm:space-y-3">
              {analysis.clinicalNextSteps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 sm:gap-3 text-gray-700 p-2.5 sm:p-3 bg-gradient-to-r from-indigo-50 to-transparent rounded-lg sm:rounded-xl text-xs sm:text-sm"
                >
                  <span className="text-indigo-600 font-bold min-w-[20px] sm:min-w-[24px]">{index + 1}.</span>
                  <span className="leading-relaxed">{step}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
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
