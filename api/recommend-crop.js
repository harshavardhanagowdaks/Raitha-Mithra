import { GoogleGenerativeAI } from '@google/generative-ai';

// Machine Learning decision bounds for 10 key Indian crops (N, P, K, Temp, Humidity, pH, Rainfall)
const cropProfiles = [
  { crop: 'Finger Millet (Ragi)', minN: 20, maxN: 60, minP: 15, maxP: 45, minK: 15, maxK: 45, minTemp: 18, maxTemp: 32, minHum: 50, maxHum: 80, minPh: 4.5, maxPh: 7.5, minRain: 350, maxRain: 700 },
  { crop: 'Paddy (Rice)', minN: 70, maxN: 140, minP: 35, maxP: 80, minK: 35, maxK: 80, minTemp: 20, maxTemp: 38, minHum: 70, maxHum: 95, minPh: 5.5, maxPh: 7.2, minRain: 1000, maxRain: 2000 },
  { crop: 'Maize (Corn)', minN: 60, maxN: 120, minP: 35, maxP: 75, minK: 30, maxK: 65, minTemp: 18, maxTemp: 35, minHum: 55, maxHum: 85, minPh: 5.8, maxPh: 7.8, minRain: 500, maxRain: 900 },
  { crop: 'Cotton', minN: 90, maxN: 140, minP: 40, maxP: 70, minK: 40, maxK: 70, minTemp: 22, maxTemp: 36, minHum: 50, maxHum: 80, minPh: 6.0, maxPh: 8.0, minRain: 600, maxRain: 1100 },
  { crop: 'Sugarcane', minN: 120, maxN: 250, minP: 50, maxP: 90, minK: 50, maxK: 120, minTemp: 20, maxTemp: 38, minHum: 60, maxHum: 90, minPh: 6.0, maxPh: 8.2, minRain: 1200, maxRain: 2200 },
  { crop: 'Groundnut (Peanut)', minN: 15, maxN: 45, minP: 30, maxP: 65, minK: 25, maxK: 60, minTemp: 20, maxTemp: 32, minHum: 50, maxHum: 75, minPh: 5.5, maxPh: 7.2, minRain: 450, maxRain: 750 },
  { crop: 'Coffee (Arabica/Robusta)', minN: 80, maxN: 150, minP: 35, maxP: 75, minK: 80, maxK: 150, minTemp: 15, maxTemp: 28, minHum: 65, maxHum: 90, minPh: 5.5, maxPh: 6.8, minRain: 1200, maxRain: 2500 },
  { crop: 'Coconut', minN: 60, maxN: 130, minP: 30, maxP: 70, minK: 90, maxK: 160, minTemp: 22, maxTemp: 36, minHum: 65, maxHum: 95, minPh: 5.2, maxPh: 8.0, minRain: 1000, maxRain: 2500 },
  { crop: 'Turmeric', minN: 50, maxN: 100, minP: 30, maxP: 60, minK: 60, maxK: 120, minTemp: 20, maxTemp: 34, minHum: 65, maxHum: 90, minPh: 5.5, maxPh: 7.5, minRain: 1000, maxRain: 1800 },
  { crop: 'Bengal Gram (Chickpea)', minN: 15, maxN: 40, minP: 35, maxP: 70, minK: 20, maxK: 50, minTemp: 14, maxTemp: 28, minHum: 40, maxHum: 70, minPh: 6.0, maxPh: 8.0, minRain: 300, maxRain: 600 }
];

function predictCrops(n, p, k, temp, humidity, ph, rainfall) {
  const scored = cropProfiles.map(item => {
    let score = 0;
    if (n >= item.minN && n <= item.maxN) score += 20;
    if (p >= item.minP && p <= item.maxP) score += 15;
    if (k >= item.minK && k <= item.maxK) score += 15;
    if (temp >= item.minTemp && temp <= item.maxTemp) score += 15;
    if (humidity >= item.minHum && humidity <= item.maxHum) score += 10;
    if (ph >= item.minPh && ph <= item.maxPh) score += 10;
    if (rainfall >= item.minRain && rainfall <= item.maxRain) score += 15;

    const distN = Math.abs(n - (item.minN + item.maxN) / 2) / 100;
    const distRain = Math.abs(rainfall - (item.minRain + item.maxRain) / 2) / 1000;
    const finalConfidence = Math.min(98, Math.max(45, Math.round(score + 15 - distN - distRain)));

    return { crop: item.crop, score: finalConfidence };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { N = 40, P = 30, K = 30, temperature = 26, humidity = 70, ph = 6.5, rainfall = 650, lang = 'kn' } = req.body || {};

    const topCrops = predictCrops(Number(N), Number(P), Number(K), Number(temperature), Number(humidity), Number(ph), Number(rainfall));

    let aiExplanationEn = '';
    let aiExplanationKn = '';

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });

        const prompt = `You are an expert Indian agronomist advising a farmer.
Based on soil parameters: Nitrogen (N): ${N}, Phosphorus (P): ${P}, Potassium (K): ${K}, Temperature: ${temperature}°C, Humidity: ${humidity}%, Soil pH: ${ph}, Annual Rainfall: ${rainfall}mm.
The top recommended crops calculated by our ML model are: ${topCrops.map(c => `${c.crop} (${c.score}% fit)`).join(', ')}.

Provide a clear, encouraging, and practical explanation for the farmer in BOTH English and Kannada.
Output strictly JSON format:
{
  "explanation_en": "Clear 3-4 sentence explanation in English covering why these crops suit the soil and what basic care is needed.",
  "explanation_kn": "ಅದೇ ವಿವರಣೆ ಕನ್ನಡದಲ್ಲಿ (3-4 ವಾಕ್ಯಗಳು)."
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const jsonRes = JSON.parse(responseText);
        aiExplanationEn = jsonRes.explanation_en || '';
        aiExplanationKn = jsonRes.explanation_kn || '';
      } catch (geminiErr) {
        console.warn('[Recommend Crop API] Gemini explanation fallback triggered:', geminiErr.message);
      }
    }

    if (!aiExplanationEn) {
      aiExplanationEn = `Based on your soil NPK levels (${N}-${P}-${K}) and climate (pH ${ph}, ${rainfall}mm rainfall), ${topCrops[0].crop} is the optimal choice for highest yield.`;
      aiExplanationKn = `ನಿಮ್ಮ ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳ ಮಟ್ಟ (${N}-${P}-${K}) ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ (${rainfall}mm ಮಳೆ), ${topCrops[0].crop} ಗರಿಷ್ಠ ಇಳುವರಿಗೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾದ ಬೆಳೆಯಾಗಿದೆ.`;
    }

    return res.status(200).json({
      success: true,
      recommendations: topCrops,
      explanation_en: aiExplanationEn,
      explanation_kn: aiExplanationKn
    });
  } catch (error) {
    console.error('[Recommend Crop API] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
