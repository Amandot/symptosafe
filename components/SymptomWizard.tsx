'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

const steps = [
  {
    id: 'location',
    label: 'Where is the main problem in your body?',
    placeholder: 'e.g. chest, head, stomach, throat, whole body',
  },
  {
    id: 'duration',
    label: 'How long has this been going on?',
    placeholder: 'e.g. started today, 3 days, 2 weeks, several months',
  },
  {
    id: 'severity',
    label: 'How severe is it on a scale of 1–10?',
    placeholder: 'e.g. 3/10 mild, 6/10 moderate, 9/10 very severe',
  },
  {
    id: 'context',
    label: 'Anything that makes it better or worse?',
    placeholder: 'e.g. worse when walking, better with rest, after eating, at night',
  },
];

export default function SymptomWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { messages } = useAppStore();

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      const summary = steps
        .map((s) => `${s.label} ${answers[s.id] || ''}`.trim())
        .join('. ');

      const input =
        summary ||
        (messages[0]?.content ??
          'I want to describe my symptoms but I have not added details yet.');

      const nativeInput = document.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement | null;

      if (nativeInput) {
        nativeInput.value = input;
        nativeInput.focus();
      }
    }
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const step = steps[currentStep];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-purple-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Guided symptom wizard</h3>
            <p className="text-[11px] text-gray-500">
              Optional helper before you type or paste your symptoms
            </p>
          </div>
        </div>
        <span className="text-[11px] text-gray-500 font-medium">
          Step {currentStep + 1} / {steps.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-gray-800">{step.label}</p>
          <textarea
            rows={3}
            value={answers[step.id] || ''}
            onChange={(e) => handleChange(step.id, e.target.value)}
            placeholder={step.placeholder}
            className="w-full rounded-2xl border-2 border-purple-200 bg-white/80 px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none shadow-sm"
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={goBack}
          disabled={currentStep === 0}
          className="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={12} />
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex items-center gap-1 text-[11px] px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg"
        >
          {currentStep === steps.length - 1 ? 'Fill input & analyze' : 'Next question'}
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}


