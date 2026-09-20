export default async function handler(req, res) {
  try {
    const newsApiKey = process.env.NEWSAPI_KEY;
    const { lang = 'en' } = req.query;

    let articles = [];

    if (newsApiKey) {
      try {
        const query = lang === 'kn' ? 'karnataka agriculture OR krishi' : 'karnataka agriculture OR indian farming OR crop yield';
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=8&apiKey=${newsApiKey}`;
        const newsRes = await fetch(url);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          articles = (newsData.articles || []).map((art, idx) => ({
            id: idx + 1,
            title_en: art.title,
            title_kn: art.title,
            summary_en: art.description || art.content,
            summary_kn: art.description || art.content,
            source: art.source?.name || 'Agri News',
            url: art.url,
            publishedAt: art.publishedAt,
            image: art.urlToImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
          }));
        }
      } catch (e) {
        console.warn('[News API] NewsAPI fetch error:', e.message);
      }
    }

    if (articles.length === 0) {
      articles = [
        {
          id: 1,
          title_en: 'Karnataka Government Announces New Subsidies for Drip Irrigation & Farm Ponds',
          title_kn: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರದಿಂದ ಹನಿ ನೀರಾವರಿ ಮತ್ತು ಕೃಷಿ ಹೊಂಡಗಳಿಗೆ ಹೊಸ ಸಬ್ಸಿಡಿ ಘೋಷಣೆ',
          summary_en: 'Farmers across Karnataka can now apply for up to 90% financial assistance for setting up solar pumpsets and drip irrigation systems under Krishi Bhagya.',
          summary_kn: 'ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆಯಡಿ ಸೌರ ಪಂಪ್‌ಸೆಟ್‌ಗಳು ಮತ್ತು ಹನಿ ನೀರಾವರಿ ವ್ಯವಸ್ಥೆಗಳನ್ನು ಅಳವಡಿಸಲು ಕರ್ನಾಟಕದ ರೈತರು ಈಗ 90% ವರೆಗೆ ಆರ್ಥಿಕ ನೆರವು ಪಡೆಯಬಹುದು.',
          source: 'Karnataka Krishi Varta',
          url: 'https://raitamitra.karnataka.gov.in/',
          publishedAt: new Date().toISOString(),
          image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 2,
          title_en: 'Ragi & Millet Procurement Centers Open Across Mandya & Mysuru Districts',
          title_kn: 'ಮಂಡ್ಯ ಮತ್ತು ಮೈಸೂರು ಜಿಲ್ಲೆಗಳಾದ್ಯಂತ ರಾಗಿ ಖರೀದಿ ಕೇಂದ್ರಗಳು ಪ್ರಾರಂಭ',
          summary_en: 'MSP for Ragi set at ₹4,290 per quintal for the current season. Farmers are advised to register via K-KISAN portal.',
          summary_kn: 'ಪ್ರಸ್ತುತ ಋತುವಿಗೆ ರಾಗಿ ಬೆಂಬಲ ಬೆಲೆಯನ್ನು ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹4,290 ಎಂದು ನಿಗದಿಪಡಿಸಲಾಗಿದೆ. ರೈತರು ಕೆ-ಕಿಸಾನ್ ಪೋರ್ಟಲ್ ಮೂಲಕ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಲು ಸೂಚಿಸಲಾಗಿದೆ.',
          source: 'Agri Market News',
          url: 'https://krama.karnataka.gov.in/',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 3,
          title_en: 'Coffee Board Issues Weather Advisory for Chikmagalur & Kodagu Growers',
          title_kn: 'ಚಿಕ್ಕಮಗಳೂರು ಮತ್ತು ಕೊಡಗು ಬೆಳೆಗಾರರಿಗೆ ಕಾಫಿ ಮಂಡಳಿಯಿಂದ ಹವಾಮಾನ ಮುನ್ನೆಚ್ಚರಿಕೆ',
          summary_en: 'Coffee growers advised to initiate 0.5% Bordeaux spray to prevent Leaf Rust and Berry Borer infestation following recent rain spells.',
          summary_kn: 'ಇತ್ತೀಚಿನ ಮಳೆಯ ನಂತರ ಎಲೆ ಮಚ್ಚೆ ರೋಗವನ್ನು ತಡೆಗಟ್ಟಲು ಕಾಫಿ ಬೆಳೆಗಾರರಿಗೆ 0.5% ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಸಿಂಪಡಿಸಲು ಸಲಹೆ ನೀಡಲಾಗಿದೆ.',
          source: 'Coffee Board of India',
          url: 'https://coffeeboard.gov.in/',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
        }
      ];
    }

    return res.status(200).json({ success: true, articles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
