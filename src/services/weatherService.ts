export interface CityWeather {
  cityName: string;
  temp: number; // current temp °C
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  weatherText: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  clothingTip: string;
}

// Major cities mapping with lat/lng
const CITY_COORDS: Record<number, { name: string; lat: number; lng: number }> = {
  1: { name: "삿포로 (홋카이도)", lat: 43.062, lng: 141.354 },
  2: { name: "아오모리", lat: 40.824, lng: 140.740 },
  4: { name: "센다이 (미야기)", lat: 38.268, lng: 140.872 },
  13: { name: "도쿄", lat: 35.689, lng: 139.692 },
  14: { name: "요코하마 (가나가와)", lat: 35.443, lng: 139.638 },
  17: { name: "가나자와 (이시카와)", lat: 36.561, lng: 136.656 },
  23: { name: "나고야 (아이치)", lat: 35.181, lng: 136.906 },
  26: { name: "교토", lat: 35.011, lng: 135.768 },
  27: { name: "오사카", lat: 34.693, lng: 135.502 },
  28: { name: "고베 (효고)", lat: 34.691, lng: 135.183 },
  34: { name: "히로시마", lat: 34.396, lng: 132.459 },
  40: { name: "후쿠오카", lat: 33.590, lng: 130.401 },
  46: { name: "가고시마", lat: 31.560, lng: 130.558 },
  47: { name: "나하 (오키나와)", lat: 26.212, lng: 127.681 },
};

function getWeatherInfo(code: number): { text: string; icon: string } {
  if (code === 0) return { text: "맑음 ☀️", icon: "☀️" };
  if (code === 1 || code === 2) return { text: "구름 조금 ⛅", icon: "⛅" };
  if (code === 3) return { text: "흐림 ☁️", icon: "☁️" };
  if (code >= 45 && code <= 48) return { text: "안개 🌫️", icon: "🌫️" };
  if (code >= 51 && code <= 67) return { text: "비 🌧️", icon: "🌧️" };
  if (code >= 71 && code <= 77) return { text: "눈 ❄️", icon: "❄️" };
  if (code >= 80 && code <= 82) return { text: "소나기 🌦️", icon: "🌦️" };
  if (code >= 95) return { text: "뇌우 ⛈️", icon: "⛈️" };
  return { text: "쾌청", icon: "☀️" };
}

function getClothingTip(temp: number): string {
  if (temp >= 28) return "👕 얇은 반팔과 통풍이 잘 되는 시원한 복장 추천!";
  if (temp >= 23) return "👔 얇은 셔츠나 얇은 가디건을 준비하세요.";
  if (temp >= 17) return "🧥 겉옷(자켓/가디건)을 챙기기 좋은 날씨입니다.";
  if (temp >= 12) return "🧥 트렌치코트나 꽤 두꺼운 자켓이 필요합니다.";
  if (temp >= 6) return "🧣 코트나 가벼운 패딩, 목도리를 챙기세요.";
  return "❄️ 패딩 점퍼와 장갑, 핫팩 필수 추위 대비!";
}

const weatherCache: Record<number, { data: CityWeather; time: number }> = {};

export async function fetchCityWeather(prefectureCode: number = 13): Promise<CityWeather> {
  const city = CITY_COORDS[prefectureCode] || CITY_COORDS[13]; // Default to Tokyo
  const now = Date.now();

  if (weatherCache[prefectureCode] && now - weatherCache[prefectureCode].time < 15 * 60 * 1000) {
    return weatherCache[prefectureCode].data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const temp = Math.round(current.temperature_2m);
    const tempMax = Math.round(daily.temperature_2m_max[0]);
    const tempMin = Math.round(daily.temperature_2m_min[0]);
    const code = current.weather_code;
    const { text, icon } = getWeatherInfo(code);

    const result: CityWeather = {
      cityName: city.name,
      temp,
      tempMax,
      tempMin,
      weatherCode: code,
      weatherText: text,
      icon,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      clothingTip: getClothingTip(temp),
    };

    weatherCache[prefectureCode] = { data: result, time: now };
    return result;
  } catch (err) {
    console.warn("Failed to fetch weather data, fallback used:", err);
    return {
      cityName: city.name,
      temp: 22,
      tempMax: 25,
      tempMin: 18,
      weatherCode: 0,
      weatherText: "맑음 ☀️",
      icon: "☀️",
      humidity: 55,
      windSpeed: 3,
      clothingTip: "👔 쾌적한 여행 날씨! 얇은 겉옷을 챙겨보세요.",
    };
  }
}
