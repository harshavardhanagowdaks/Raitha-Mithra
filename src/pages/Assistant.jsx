import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import VoiceButton from '../components/VoiceButton';
import { speakText, stopSpeech } from '../services/speechService';
import { Bot, Send, Volume2, Sparkles, User, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Assistant() {
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: language === 'kn'
        ? 'ನಮಸ್ಕಾರ ರೈತ ಬಂಧುವೇ! ನಾನು ನಿಮ್ಮ ಮುಕ್ತ ಕೃಷಿ ಎಐ ಸಹಾಯಕ. ಬೆಳೆಗಳು, ಹವಾಮಾನ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಅಥವಾ ಯಾವುದೇ ಸಾಮಾನ್ಯ ವಿಷಯದ ಕುರಿತು ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.'
        : 'Hello Raitha! I am your open-ended Krishi AI Assistant. Ask me anything about farming, weather, government schemes, or general knowledge.',
      grounded: true
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language,
          history: updatedMessages
        })
      });

      if (res.ok) {
        const json = await res.json();
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: json.response,
          grounded: json.rag_grounded,
          rate_limited: json.rate_limited
        };
        setMessages(prev => [...prev, botMsg]);
        speakText(json.response, language);
      } else {
        throw new Error('Assistant API error');
      }
    } catch (err) {
      console.warn('[Assistant Page] Fallback triggered:', err.message);
      const fallbackText = language === 'kn'
        ? `ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ: "${query}". ಕೃಷಿ ಸಲಹೆಯಂತೆ ಬೆಳೆ ರಕ್ಷಣೆಗಾಗಿ ಸೂಕ್ತ ಗೊಬ್ಬರ ಮತ್ತು ಸರಿಯಾದ ಸಮಯದಲ್ಲಿ ನೀರಾವರಿ ನೀಡುವುದು ಮುಖ್ಯ.`
        : `Regarding your query: "${query}". Following ICAR Krishi Vigyan Kendra guidelines, ensure balanced fertilization and timely management.`;
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: fallbackText, grounded: false }]);
      speakText(fallbackText, language);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Assistant Header */}
      <div className="bg-emerald-900 text-white p-4 flex items-center justify-between shadow">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md text-amber-300">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">{t('assistant.title')}</h3>
            <p className="text-[11px] text-emerald-200 flex items-center space-x-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Full Gemini AI + RAG Context</span>
            </p>
          </div>
        </div>

        <button
          onClick={stopSpeech}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-amber-200"
          title="Mute Speech"
        >
          Mute
        </button>
      </div>

      {/* Suggested Questions Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto flex items-center space-x-2 text-xs">
        <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
          {t('assistant.sampleQuestions')}
        </span>
        {[
          t('assistant.q1'),
          t('assistant.q2'),
          t('assistant.q3')
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-full font-medium whitespace-nowrap shadow-xs transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'bot' && (
              <div className="p-2 bg-emerald-800 text-amber-300 rounded-2xl flex-shrink-0 shadow-sm mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] p-4 rounded-3xl text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white font-medium rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.sender === 'bot' && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Gemini 1.5 Flash</span>
                  </span>
                  <button
                    onClick={() => speakText(msg.text, language)}
                    className="p-1 hover:text-emerald-700 rounded transition-all"
                    title="Speak message"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="p-2 bg-slate-700 text-white rounded-2xl flex-shrink-0 shadow-sm mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
            <div className="p-2 bg-emerald-800 text-amber-300 rounded-2xl">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <span>Krishi AI is thinking...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2"
      >
        <VoiceButton
          onTranscript={(text) => handleSend(text)}
        />

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t('assistant.inputPlaceholder')}
          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="p-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-2xl shadow-md transition-all flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
