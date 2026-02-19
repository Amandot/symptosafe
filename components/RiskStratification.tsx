'use client';

import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { AIAnalysisResult } from '@/types';

interface RiskStratificationProps {
  analysis: AIAnalysisResult;
}

export default function RiskStratification({ analysis }: RiskStratificationProps) {
  const { t } = useTranslation();

  const riskConfig = {
    critical: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      message: t('seekImmediateCare'),
    },
    high: {
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      message: t('consultDoctor'),
    },
    medium: {
      icon: Info,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      message: t('monitorSymptoms'),
    },
    low: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      message: t('monitorSymptoms'),
    },
  };

  const config = riskConfig[analysis.riskLevel];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl`}>
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5">
        <div className={`${config.bg} p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-md`}>
          <Icon size={28} className={`sm:w-9 sm:h-9 ${config.color}`} />
        </div>
        <div>
          <h3 className="text-base sm:text-xl font-bold text-gray-800">
            {t('riskLevel')}: <span className={config.color}>{t(analysis.riskLevel).toUpperCase()}</span>
          </h3>
          <p className={`text-xs sm:text-sm ${config.color} font-bold mt-0.5 sm:mt-1`}>
            {config.message}
          </p>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 bg-white/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-800 font-bold">{t('recommendation')}:</p>
        <ul className="text-xs sm:text-sm text-gray-700 space-y-1.5 sm:space-y-2">
          {analysis.recommendation && analysis.recommendation.length > 0 ? (
            // Use AI-generated recommendations if available
            analysis.recommendation.map((rec, index) => (
              <li key={index} className="flex items-start gap-1.5 sm:gap-2">
                <span className={`${config.color} font-bold`}>•</span>
                <span className="font-medium">{rec}</span>
              </li>
            ))
          ) : (
            // Fallback to default recommendations based on risk level
            <>
              {analysis.riskLevel === 'critical' && (
                <>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="font-medium">{t('seekEmergencyCareImmediately')}</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="font-medium">{t('doNotDelayTreatment')}</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="font-medium">{t('callEmergencyIfNeeded')}</span>
                  </li>
                </>
              )}
              {analysis.riskLevel === 'high' && (
                <>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span className="font-medium">{t('scheduleDoctor24to48')}</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span className="font-medium">{t('monitorSymptomsClosely')}</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span className="font-medium">{t('seekCareIfWorse')}</span>
                  </li>
                </>
              )}
              {(analysis.riskLevel === 'medium' || analysis.riskLevel === 'low') && (
                <>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className={`${config.color} font-bold`}>•</span>
                    <span className="font-medium">{t('monitorYourSymptoms')}</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className={`${config.color} font-bold`}>•</span>
                    <span className="font-medium">{t('consultIfPersistOrWorse')}</span>
                  </li>
                  <li className="flex items-start gap-1.5 sm:gap-2">
                    <span className={`${config.color} font-bold`}>•</span>
                    <span className="font-medium">{t('maintainSelfCare')}</span>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
