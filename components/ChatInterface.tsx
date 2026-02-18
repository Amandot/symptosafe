'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useAppStore } from '@/lib/store/useAppStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { Message } from '@/types';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  
  const {
    messages,
    addMessage,
    setAnalysis,
    setEmergency,
    isLoading,
    setIsLoading,
  } = useAppStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/analyze', {
        messages: [...messages, userMessage],
      });

      const { emergency, analysis } = response.data;

      if (emergency) {
        setEmergency(emergency);
      }

      if (analysis) {
        setAnalysis(analysis);
        
        const assistantMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `I've analyzed your symptoms. Please review the detailed analysis below.`,
          timestamp: new Date(),
        };
        addMessage(assistantMessage);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error analyzing your symptoms. Please try again.',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50/30 to-transparent">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 border-b border-purple-200">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Bot size={22} />
          AI Symptom Analyzer
        </h2>
        <p className="text-xs text-purple-100 mt-1">Describe your symptoms in detail for accurate analysis</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-full mb-4">
              <Bot size={48} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to SymptoSafe</h3>
            <p className="text-gray-600 text-sm max-w-md">
              Start by describing your symptoms. I'll analyze them and provide insights with confidence scores.
            </p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot size={22} className="text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    : 'bg-white text-gray-800 border border-purple-100'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className={`text-xs mt-2 block ${message.role === 'user' ? 'text-purple-100' : 'text-gray-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User size={22} className="text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Bot size={22} className="text-white" />
            </div>
            <div className="bg-white rounded-2xl px-5 py-3.5 shadow-lg border border-purple-100">
              <div className="flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                <span className="text-sm text-gray-700 font-medium">{t('analyzing')}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-5 bg-white/80 backdrop-blur-md border-t border-purple-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('typeSymptoms')}
            className="flex-1 px-5 py-3.5 rounded-2xl border-2 border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-7 py-3.5 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
          >
            <Send size={20} />
            <span className="hidden sm:inline">{t('send')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
