// Free Open-Meteo Weather API Service for Karnataka Districts

const districtCoords = {
  'Mandya': { lat: 12.5238, lon: 76.8967 },
  'Bengaluru Urban': { lat: 12.9716, lon: 77.5946 },
  'Mysuru': { lat: 12.2958, lon: 76.6394 },
  'Hassan': { lat: 13.0072, lon: 76.1017 },
  'Shivamogga': { lat: 13.9299, lon: 75.5681 },
  'Chikmagalur': { lat: 13.3161, lon: 75.7720 },
  'Kodagu': { lat: 12.4244, lon: 75.7382 },
  'Belagavi': { lat: 15.8497, lon: 74.4977 },
  'Raichur': { lat: 16.2076, lon: 77.3463 },
  'Davangere': { lat: 14.4644, lon: 75.9218 },
  'Tumakuru': { lat: 13.3379, lon: 77.1173 },
  'Ballari': { lat: 15.1394, lon: 76.9214 },
  'Dharwad': { lat: 15.4589, lon: 75.0078 },
  'Kalaburagi': { lat: 17.3297, lon: 76.8343 }
};

export async function fetchDistrictWeather(districtName = 'Mandya') {
  const coords = districtCoords[districtName] || districtCoords['Mandya'];
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FKolkata`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();
    return {
      success: true,
      district: districtName,
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      daily: data.daily
    };
  } catch (err) {
    console.warn('[WeatherService] Open-Meteo fallback:', err.message);
    return {
      success: false,
      district: districtName,
      temperature: 28,
      humidity: 68,
      precipitation: 0.0,
      windSpeed: 12,
      weatherCode: 1
    };
  }
}
