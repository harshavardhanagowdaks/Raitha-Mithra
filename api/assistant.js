import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { query, language = 'kn', history = [] } = req.body || {};

    if (!query) {
      return res.status(400).json({ error: 'Query text is required.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    let ragContext = '';

    // RAG-lite context grounding
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const searchPattern = keywords.length > 0 ? keywords[0] : 'ragi';

        const { data: schemesData } = await supabase
          .from('schemes')
          .select('name_en, name_kn, description_en, description_kn, eligibility_en, benefit_en')
          .or(`name_en.ilike.%${searchPattern}%,description_en.ilike.%${searchPattern}%,name_kn.ilike.%${searchPattern}%`)
          .limit(3);

        const { data: cropData } = await supabase
          .from('crop_guides')
          .select('crop_name_en, crop_name_kn, season, fertilizer_schedule, content_en, content_kn')
          .or(`crop_name_en.ilike.%${searchPattern}%,crop_name_kn.ilike.%${searchPattern}%,content_en.ilike.%${searchPattern}%`)
          .limit(3);

        if (schemesData && schemesData.length > 0) {
          ragContext += `\nGrounding Government Schemes:\n` + schemesData.map(s => `- ${s.name_en} (${s.name_kn}): ${s.description_en}. Benefit: ${s.benefit_en}`).join('\n');
        }

        if (cropData && cropData.length > 0) {
          ragContext += `\nGrounding Crop Guides:\n` + cropData.map(c => `- ${c.crop_name_en} (${c.crop_name_kn}): Season ${c.season}. Fertilizer: ${c.fertilizer_schedule}. Guide: ${c.content_en}`).join('\n');
        }
      } catch (dbErr) {
        console.warn('[Assistant API] RAG DB fetch warning:', dbErr.message);
      }
    }

    let botResponse = '';
    let isRateLimited = false;

    if (apiKey) {
      let retries = 2;
      while (retries > 0) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: `You are "Raitha Mithra AI Assistant" (ರೈತ ಮಿತ್ರ ಸಹಾಯಕ), an open-ended, empathetic, and highly intelligent agricultural companion for Indian farmers.

CORE INSTRUCTIONS:
- You are a genuine, open-ended Gemini AI assistant.
- Respond in the language matching the user's message (Kannada or English or code-switched).
- If the provided GROUNDING CONTEXT is relevant to the query, use it to ensure precise government scheme/crop facts.
- IF THE QUERY IS GENERAL (e.g., weather, general farming, mathematics, general knowledge, or casual chit-chat), ANSWER FREELY AND INTELLIGENTLY using your vast internal knowledge.
- Do NOT restrict yourself to only scheme or market topics.
- Keep language warm, practical, polite, and encouraging (e.g., "ನಮಸ್ಕಾರ ರೈತ ಬಂಧುವೇ").

GROUNDING CONTEXT FROM DATABASE:
${ragContext || 'No specific database rows retrieved. Rely on standard ICAR / Krishi Vigyan Kendra agricultural best practices.'}`
          });

          // Format multi-turn conversation history
          const contents = [];
          if (Array.isArray(history) && history.length > 0) {
            history.forEach(msg => {
              if (msg.text) {
                contents.push({
                  role: msg.sender === 'user' ? 'user' : 'model',
                  parts: [{ text: msg.text }]
                });
              }
            });
          }

          // Add current turn
          contents.push({
            role: 'user',
            parts: [{ text: query }]
          });

          const result = await model.generateContent({ contents });
          botResponse = result.response.text();
          break;
        } catch (geminiErr) {
          console.warn(`[Assistant API] Gemini call attempt failed: ${geminiErr.message}. Retries remaining: ${retries - 1}`);
          if (geminiErr.message?.includes('429') || geminiErr.message?.includes('quota')) {
            isRateLimited = true;
          }
          retries--;
          if (retries > 0) await new Promise(r => setTimeout(r, 1500));
        }
      }
    }

    if (!botResponse) {
      if (isRateLimited) {
        botResponse = language === 'kn'
          ? 'ಸಹಾಯಕ ಪ್ರಸ್ತುತ ವ್ಯಸ್ತವಾಗಿದೆ, ದಯವಿಟ್ಟು ಕ್ಷಣಕಾಲದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ (Assistant is busy, try again in a moment).'
          : 'The AI assistant is busy processing high traffic, please try again in a moment.';
      } else if (language === 'kn') {
        botResponse = `ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ: "${query}". ಕೃಷಿ ಇಲಾಖೆಯ ಸಲಹೆಯಂತೆ ಸೂಕ್ತ ಗೊಬ್ಬರ ಮತ್ತು ಸರಿಯಾದ ಸಮಯದಲ್ಲಿ ನೀರಾವರಿ ನೀಡುವುದು ಮುಖ್ಯ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`;
      } else {
        botResponse = `Hello! Regarding your query: "${query}". Following ICAR Krishi Vigyan Kendra guidelines, ensure balanced fertilization and timely management.`;
      }
    }

    return res.status(200).json({
      success: true,
      response: botResponse,
      rag_grounded: Boolean(ragContext),
      rate_limited: isRateLimited
    });
  } catch (error) {
    console.error('[Assistant API] Server Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
