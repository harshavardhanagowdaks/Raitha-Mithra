export default async function handler(req, res) {
  try {
    const youtubeKey = process.env.YOUTUBE_API_KEY;

    let videos = [];

    if (youtubeKey) {
      try {
        const query = 'karnataka krishi farming techniques';
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=6&type=video&key=${youtubeKey}`;
        const ytRes = await fetch(url);
        if (ytRes.ok) {
          const ytData = await ytRes.json();
          videos = (ytData.items || []).map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`
          }));
        }
      } catch (e) {
        console.warn('[YouTube API] Fetch error:', e.message);
      }
    }

    if (videos.length === 0) {
      videos = [
        {
          id: 'v1_ragi_guide',
          title: 'ಉತ್ತಮ ರಾಗಿ ಇಳುವರಿಗಾಗಿ ಕೃಷಿ ಪದ್ಧತಿಗಳು | Scientific Ragi Cultivation Guide in Kannada',
          channel: 'Krishi Darshana Kannada',
          thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
          url: 'https://www.youtube.com/results?search_query=karnataka+ragi+krishi'
        },
        {
          id: 'v2_drip_irrig',
          title: 'ಹನಿ ನೀರಾವರಿ ಸ್ಥಾಪನೆ ಮತ್ತು ಸಬ್ಸಿಡಿ ಮಾಹಿತಿ | Drip Irrigation Setup & Subsidy Guide',
          channel: 'Karnataka Farmers Channel',
          thumbnail: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&w=600&q=80',
          url: 'https://www.youtube.com/results?search_query=karnataka+drip+irrigation'
        },
        {
          id: 'v3_areca_care',
          title: 'ಅಡಿಕೆ ತೋಟ ನಿರ್ವಹಣೆ ಮತ್ತು ಕೊಳೆ ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆ | Arecanut Plantation Care',
          channel: 'Malnad Krishi Varta',
          thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
          url: 'https://www.youtube.com/results?search_query=arecanut+kole+roga+treatment'
        },
        {
          id: 'v4_organic_manure',
          title: 'ಜೀವಾಮೃತ ಮತ್ತು ಸಾವಯವ ಗೊಬ್ಬರ ತಯಾರಿಕೆ | Organic Jeevamrutha Preparation',
          channel: 'Natural Farming Karnataka',
          thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
          url: 'https://www.youtube.com/results?search_query=jeevamrutha+preparation+kannada'
        }
      ];
    }

    return res.status(200).json({ success: true, videos });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
