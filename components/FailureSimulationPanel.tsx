'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function FailureSimulationPanel() {
  const [showPanel, setShowPanel] = useState(false);

  const testScenarios = [
    { label: 'Test: Headache & Fever', input: 'I have headache and fever' },
    { label: 'Test: Chest Pain (Emergency)', input: 'Severe chest pain and breathing problem' },
    { label: 'Test: Vague Symptoms', input: "I don't feel well" },
  ];

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors shadow-lg"
      >
        Test Scenarios
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl p-4 w-80 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-orange-500" />
          <h3 className="font-semibold text-gray-800">Test Scenarios</h3>
        </div>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {testScenarios.map((scenario, index) => (
          <button
            key={index}
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input) {
                input.value = scenario.input;
                input.focus();
              }
            }}
            className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
          >
            {scenario.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Click to populate input field with test scenarios
      </p>
    </div>
  );
}
