'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { LineChart, Line } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';
import type { SymptomSession } from '@/types';
import { useAppStore } from '@/lib/store/useAppStore';
import { getUserSessions } from '@/lib/firebase/firestore-service';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function SessionTrends() {
  const { user } = useAppStore();
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<SymptomSession[]>([]);

  useEffect(() => {
    if (!user) return;
    getUserSessions(user.uid, 30)
      .then(setSessions)
      .catch(console.error);
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-purple-100 text-xs text-gray-600">
        {t('signInToSeeTrends')}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-purple-100 text-xs text-gray-600">
        {t('completeAnalysesToSeeTrends')}
      </div>
    );
  }

  const riskCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const confidencePoints: { index: number; confidence: number }[] = [];

  sessions
    .slice()
    .reverse()
    .forEach((session, index) => {
      const risk = session.analysis?.riskLevel;
      if (risk && riskCounts[risk] !== undefined) {
        riskCounts[risk] += 1;
      }
      if (session.analysis?.confidenceScore !== undefined) {
        confidencePoints.push({
          index: index + 1,
          confidence: session.analysis.confidenceScore,
        });
      }
    });

  const riskData = Object.entries(riskCounts).map(([key, value]) => ({
    risk: key,
    count: value,
  }));

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-purple-100 h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{t('riskAndConfidenceTrends')}</h3>
            <p className="text-[11px] text-gray-500">
              {t('aggregateViewSubtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-500">
          <Activity size={12} />
          <span>{t('sessionsCount', { count: sessions.length })}</span>
        </div>
      </div>

      <div className="h-32">
        <p className="text-[11px] text-gray-600 mb-1 font-semibold">{t('riskDistribution')}</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={riskData}>
            <XAxis
              dataKey="risk"
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
            />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ fontSize: 11 }}
              labelFormatter={(v) => `${t('riskLabel')}: ${v}`}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-32">
        <p className="text-[11px] text-gray-600 mb-1 font-semibold">{t('confidenceOverSessions')}</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={confidencePoints}>
            <XAxis dataKey="index" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


