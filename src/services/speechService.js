// Free browser-native Web Speech API service for STT & TTS (Kannada + English)

export const isSpeechSupported = () => {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

export const isTTSSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const startListening = ({ lang = 'kn', onResult, onError, onEnd }) => {
  if (!isSpeechSupported()) {
    onError && onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult && onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.warn('[SpeechService] Recognition error:', event.error);
    onError && onError(event.error);
  };

  recognition.onend = () => {
    onEnd && onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    onError && onError(err.message);
    return null;
  }
};

export const speakText = (text, lang = 'kn') => {
  if (!isTTSSupported() || !text) return;

  window.speechSynthesis.cancel(); // Stop any current speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
  utterance.rate = 0.95; // Slightly calmer speaking rate for clarity
  utterance.pitch = 1.0;

  // Attempt to select a native voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetLang = lang === 'kn' ? 'kn' : 'en';
  const matchedVoice = voices.find(v => v.lang.startsWith(targetLang));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel();
  }
};
