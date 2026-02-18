'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Activity, AlertTriangle, History } from 'lucide-react';
import type { SymptomSession } from '@/types';
import { useAppStore } from '@/lib/store/useAppStore';
import { getUserSessions } from '@/lib/firebase/firestore-service';

interface SessionDashboardProps {
  onSelectSession?: (session: SymptomSession) => void;
}

export default function SessionDashboard({ onSelectSession }: SessionDashboardProps) {
  const { user } = useAppStore();
  const [sessions, setSessions] = useState<SymptomSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    getUserSessions(user.uid, 8)
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const getRiskTag = (risk?: string) => {
    if (!risk) return null;
    const base =
      'px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border';
    switch (risk) {
      case 'critical':
        return (
          <span className={`${base} bg-red-50 text-red-700 border-red-200`}>
            Critical
          </span>
        );
      case 'high':
        return (
          <span className={`${base} bg-orange-50 text-orange-700 border-orange-200`}>
            High
          </span>
        );
      case 'medium':
        return (
          <span className={`${base} bg-yellow-50 text-yellow-700 border-yellow-200`}>
            Medium
          </span>
        );
      case 'low':
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-purple-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
            <History size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Recent sessions</h3>
            <p className="text-[11px] text-gray-500">
              Overview of your last symptom checks
            </p>
          </div>
        </div>
        {loading && (
          <span className="text-[11px] text-indigo-600 font-medium">Loading…</span>
        )}
      </div>

      {!user && (
        <div className="text-xs text-gray-600 bg-purple-50 border border-dashed border-purple-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={14} className="text-purple-500 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800 mb-1">Sign in to see history</p>
            <p>
              Session history and trends are available when you create an account and use
              SymptoSafe while logged in.
            </p>
          </div>
        </div>
      )}

      {user && sessions.length === 0 && !loading && (
        <div className="text-xs text-gray-600 bg-purple-50 border border-purple-100 rounded-2xl p-4">
          Your recent symptom sessions will appear here after you complete a few
          analyses.
        </div>
      )}

      {user && sessions.length > 0 && (
        <div className="mt-2 space-y-2 overflow-y-auto scrollbar-thin pr-1">
          {sessions.map((session) => {
            const firstMessage = session.messages[0]?.content ?? 'Symptom description';
            const risk = session.analysis?.riskLevel;
            const ts = new Date(session.timestamp);
            return (
              <motion.button
                key={session.id}
                whileHover={{ y: -2 }}
                className="w-full text-left bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl px-3 py-2.5 flex items-start gap-3 shadow-sm hover:shadow-md transition-all"
                onClick={() => onSelectSession?.(session)}
              >
                <div className="mt-0.5">
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                    <Activity size={16} className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[12px] font-semibold text-gray-900 truncate">
                      {firstMessage}
                    </p>
                    {getRiskTag(risk)}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <CalendarClock size={12} />
                    <span>
                      {ts.toLocaleDateString()} ·{' '}
                      {ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}


