import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { startListening, isSpeechSupported } from '../services/speechService';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceButton({ onTranscript, className = '' }) {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    if (!isSpeechSupported()) {
      alert('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    startListening({
      lang: language,
      onResult: (text) => {
        onTranscript(text);
        setIsListening(false);
      },
      onError: (err) => {
        console.warn('Voice error:', err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleMicClick}
      className={`relative p-3 rounded-full flex items-center justify-center transition-all shadow-md ${
        isListening
          ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
      } ${className}`}
      title={isListening ? 'Listening...' : t('assistant.speakBtn', 'Voice Input')}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
}
