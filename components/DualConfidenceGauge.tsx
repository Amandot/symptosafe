'use client';

import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface DualConfidenceGaugeProps {
  diagnosticConfidence: number;
  informationCompleteness: number;
}

export default function DualConfidenceGauge({
  diagnosticConfidence,
  informationCompleteness,
}: DualConfidenceGaugeProps) {
  const { t } = useTranslation();

  const getColor = (value: number) => {
    if (value >= 70) return '#10b981';
    if (value >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const data = [
    {
      name: t('informationCompleteness'),
      value: informationCompleteness,
      fill: getColor(informationCompleteness),
    },
    {
      name: t('diagnosticConfidence'),
      value: diagnosticConfidence,
      fill: getColor(diagnosticConfidence),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-200">
      <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-5">
        Confidence Metrics
      </h3>
      
      <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: '11px', fontWeight: '600' }}
            className="sm:text-[13px]"
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
        <div className="text-center p-3 sm:p-4 bg-white/70 rounded-xl sm:rounded-2xl shadow-sm">
          <div className="text-2xl sm:text-4xl font-black mb-0.5 sm:mb-1" style={{ color: getColor(diagnosticConfidence) }}>
            {diagnosticConfidence}%
          </div>
          <div className="text-[10px] sm:text-xs text-gray-600 font-semibold">{t('diagnosticConfidence')}</div>
        </div>
        <div className="text-center p-3 sm:p-4 bg-white/70 rounded-xl sm:rounded-2xl shadow-sm">
          <div className="text-2xl sm:text-4xl font-black mb-0.5 sm:mb-1" style={{ color: getColor(informationCompleteness) }}>
            {informationCompleteness}%
          </div>
          <div className="text-[10px] sm:text-xs text-gray-600 font-semibold">{t('informationCompleteness')}</div>
        </div>
      </div>

      {diagnosticConfidence < 50 && (
        <div className="mt-3 sm:mt-5 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl sm:rounded-2xl">
          <p className="text-xs sm:text-sm text-red-800 font-bold flex items-center gap-2">
            <span className="text-base sm:text-xl">⚠️</span>
            <span>Low confidence - Please consult a healthcare professional</span>
          </p>
        </div>
      )}
    </div>
  );
}
