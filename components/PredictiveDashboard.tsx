'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Activity, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '@/lib/store/useAppStore';
import { getUserSessions } from '@/lib/firebase/firestore-service';
import { useTranslation } from '@/lib/i18n/useTranslation';
import axios from 'axios';

interface HealthTrend {
  date: string;
  severity: number;
  frequency: number;
}

interface PredictiveInsight {
  pattern: string;
  riskScore: number;
  recommendation: string;
  confidence: number;
}

export default function PredictiveDashboard() {
  const { user, historyLogs, setHistoryLogs, currentRiskScore, setCurrentRiskScore } = useAppStore();
  const { t } = useTranslation();
  const [trends, setTrends] = useState<HealthTrend[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadHealthHistory();
    }
  }, [user]);

  const loadHealthHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const sessions = await getUserSessions(user.uid, 30);
      setHistoryLogs(sessions);

      // Process sessions into trend data
      const trendData = processTrendData(sessions);
      setTrends(trendData);

      // Get AI predictions
      if (sessions.length > 0) {
        await fetchPredictiveInsights(sessions);
      }
    } catch (error) {
      console.error('Error loading health history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processTrendData = (sessions: any[]): HealthTrend[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((date) => {
      const daySessions = sessions.filter(
        (s) => new Date(s.timestamp).toISOString().split('T')[0] === date
      );

      const avgSeverity =
        daySessions.length > 0
          ? daySessions.reduce((sum, s) => {
              const riskMap: Record<'critical' | 'high' | 'medium' | 'low', number> = {
                critical: 100,
                high: 75,
                medium: 50,
                low: 25,
              };

              const level = s.analysis?.riskLevel as 'critical' | 'high' | 'medium' | 'low' | undefined;
              const value = level ? riskMap[level] : 25;

              return sum + value;
            }, 0) / daySessions.length
          : 0;

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        severity: Math.round(avgSeverity),
        frequency: daySessions.length,
      };
    });
  };

  const fetchPredictiveInsights = async (sessions: any[]) => {
    try {
      const response = await axios.post('/api/predict', { sessions });
      setInsights(response.data.insights);
      setCurrentRiskScore(response.data.riskScore);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 75) return 'from-red-500 to-red-600';
    if (score >= 50) return 'from-orange-500 to-orange-600';
    if (score >= 25) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  if (!user) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 p-8">
        <div className="text-center">
          <Activity size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t('signInToViewInsights')}</h3>
          <p className="text-gray-600 text-sm">
            {t('trackPatternsSubtitle')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('predictiveHealthInsights')}</h2>
            <p className="text-sm text-gray-600">{t('aiPoweredPatternAnalysis')}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Risk Score Dial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={20} className="text-indigo-600" />
                  <h3 className="font-bold text-gray-900">{t('riskScore30Day')}</h3>
                </div>
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(currentRiskScore / 100) * 502.4} 502.4`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className="text-indigo-500" stopColor="currentColor" />
                        <stop offset="100%" className="text-purple-600" stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${getRiskColor(currentRiskScore)}`}>
                      {currentRiskScore}%
                    </span>
                    <span className="text-sm text-gray-600 mt-1">{t('riskLevel')}</span>
                  </div>
                </div>
              </div>

              {insights && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity size={20} className="text-purple-600" />
                    <h3 className="font-bold text-gray-900">{t('aiPatternDetection')}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">{t('identifiedPattern')}</p>
                      <p className="text-sm text-gray-900 bg-white/60 rounded-lg p-3">
                        {insights.pattern}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">{t('recommendation')}:</p>
                      <p className="text-sm text-gray-900 bg-white/60 rounded-lg p-3">
                        {insights.recommendation}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{t('confidenceLabel', { percent: insights.confidence })}</span>
                      <span className={`font-semibold ${getRiskColor(insights.riskScore)}`}>
                        {t('riskLabel')}: {insights.riskScore}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Health Trend Chart */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-purple-600" />
                <h3 className="font-bold text-gray-900">{t('healthTrend7Day')}</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '8px 12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="severity"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="frequency"
                    stroke="#6366f1"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#6366f1', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-gray-600">{t('severity')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-gray-600">{t('frequency')}</span>
                </div>
              </div>
            </div>

            {historyLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">{t('noHealthDataYet')}</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
