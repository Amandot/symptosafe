'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, User, Bot, Image as ImageIcon, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useAppStore } from '@/lib/store/useAppStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { Message } from '@/types';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  
  const {
    messages,
    addMessage,
    setAnalysis,
    setEmergency,
    isLoading,
    setIsLoading,
    language,
  } = useAppStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('selectImageFile'));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('imageSizeLimit'));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!input.trim() && !imageBase64) || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim() || t('pleaseAnalyzeThisImage'),
      timestamp: new Date(),
      imageUrl: imageBase64 || undefined,
    };

    addMessage(userMessage);
    setInput('');
    const currentImage = imageBase64;
    removeImage();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/analyze', {
        messages: [...messages, userMessage],
        image: currentImage,
        language,
      });

      const { emergency, analysis } = response.data;

      if (emergency) {
        setEmergency(emergency);
      }

      if (analysis) {
        setAnalysis(analysis);

        const top = analysis.possibleConditions?.[0];
        const conditionLine = top?.name
          ? `${t('mostLikelyCondition')}: ${top.name}${
              typeof top.probability === 'number' ? ` ${t('approxPercent', { percent: top.probability })}` : ''
            }`
          : `${t('mostLikelyCondition')}: ${t('notEnoughInfoYet')}`;

        const advice =
          Array.isArray(analysis.recommendation) && analysis.recommendation.length > 0
            ? `\n\n${t('whatYouCanDoNow')}:\n${analysis.recommendation
                .slice(0, 3)
                .map((r: string) => `- ${r}`)
                .join('\n')}`
            : '';
        
        const assistantMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `${conditionLine}${advice}`,
          timestamp: new Date(),
        };
        addMessage(assistantMessage);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: t('analysisErrorTryAgain'),
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50/30 to-transparent">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-3 sm:px-6 py-3 sm:py-4 border-b border-purple-200">
        <h2 className="text-sm sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2">
          <Bot size={18} className="sm:w-[22px] sm:h-[22px]" />
          {t('aiSymptomAnalyzer')}
        </h2>
        <p className="text-[10px] sm:text-xs text-purple-100 mt-0.5 sm:mt-1 hidden xs:block">{t('chatSubtitle')}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-3 sm:px-4">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 sm:p-6 rounded-full mb-3 sm:mb-4">
              <Bot size={36} className="sm:w-12 sm:h-12 text-indigo-600" />
            </div>
            <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1.5 sm:mb-2">{t('welcomeTitle')}</h3>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md">
              {t('welcomeBody')}
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
              className={`flex gap-2 sm:gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot size={18} className="sm:w-[22px] sm:h-[22px] text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-5 sm:py-3.5 shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    : 'bg-white text-gray-800 border border-purple-100'
                }`}
              >
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt={t('symptomVisual')}
                    className="rounded-lg mb-2 max-w-full h-auto max-h-48 object-cover"
                  />
                )}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 block ${message.role === 'user' ? 'text-purple-100' : 'text-gray-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User size={18} className="sm:w-[22px] sm:h-[22px] text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 sm:gap-3 justify-start"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Bot size={18} className="sm:w-[22px] sm:h-[22px] text-white" />
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-5 sm:py-3.5 shadow-lg border border-purple-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <Loader2 size={16} className="sm:w-[18px] sm:h-[18px] animate-spin text-indigo-600" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('analyzing')}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-5 bg-white/80 backdrop-blur-md border-t border-purple-200">
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img
              src={imagePreview}
              alt={t('preview')}
              className="h-20 w-20 object-cover rounded-lg border-2 border-purple-300"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <div className="flex gap-2 sm:gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center gap-1.5 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            <ImageIcon size={18} className="sm:w-5 sm:h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('typeSymptoms')}
            className="flex-1 px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 text-xs sm:text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !imageBase64)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl font-medium"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{t('send')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
