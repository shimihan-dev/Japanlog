import React, { useState, useEffect, useCallback } from "react";
import { fetchLiveJpyExchangeRate, type ExchangeRateData } from "../services/currencyService";
import { fetchCityWeather, type CityWeather } from "../services/weatherService";
import { RefreshCw, Calculator, CloudSun, Sparkles, Wind, Droplets, Landmark } from "lucide-react";

interface TravelUtilityWidgetProps {
  selectedCode?: number | null;
}

export const TravelUtilityWidget: React.FC<TravelUtilityWidgetProps> = ({ selectedCode }) => {
  // Currency State
  const [rateData, setRateData] = useState<ExchangeRateData | null>(null);
  const [jpyInput, setJpyInput] = useState<string>("1000");
  const [krwInput, setKrwInput] = useState<string>("");
  const [loadingRate, setLoadingRate] = useState<boolean>(false);

  // Weather State
  const [weatherData, setWeatherData] = useState<CityWeather | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);

  // Load Currency Exchange Rate (Hana Bank)
  const loadExchangeRate = useCallback(async () => {
    setLoadingRate(true);
    const data = await fetchLiveJpyExchangeRate();
    setRateData(data);
    setLoadingRate(false);

    // Initial calculation
    const numJpy = parseFloat("1000");
    if (!isNaN(numJpy)) {
      setKrwInput(Math.round(numJpy * data.jpyToKrw).toLocaleString("ko-KR"));
    }
  }, []);

  // Load Weather Data
  const loadWeather = useCallback(async () => {
    setLoadingWeather(true);
    const data = await fetchCityWeather(selectedCode || 13);
    setWeatherData(data);
    setLoadingWeather(false);
  }, [selectedCode]);

  useEffect(() => {
    loadExchangeRate();
  }, [loadExchangeRate]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  // Handle JPY Input Change
  const handleJpyChange = (val: string) => {
    setJpyInput(val);
    const num = parseFloat(val.replace(/,/g, ""));
    if (isNaN(num) || !rateData) {
      setKrwInput("");
      return;
    }

    const convertedKrw = Math.round(num * rateData.jpyToKrw);
    setKrwInput(convertedKrw.toLocaleString("ko-KR"));
  };

  // Handle KRW Input Change
  const handleKrwChange = (val: string) => {
    setKrwInput(val);
    const num = parseFloat(val.replace(/,/g, ""));
    if (isNaN(num) || !rateData || rateData.jpyToKrw === 0) {
      setJpyInput("");
      return;
    }

    const convertedJpy = Math.round(num / rateData.jpyToKrw);
    setJpyInput(convertedJpy.toString());
  };

  // Handle Quick Presets
  const applyJpyPreset = (amount: number) => {
    handleJpyChange(amount.toString());
  };

  return (
    <div className="space-y-4">
      {/* SECTION 1: Hana Bank JPY Exchange Rate Converter */}
      <div className="bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 shadow-2xs p-4 transition-colors duration-250 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2 text-[#E63946] dark:text-[#FF5A65] font-extrabold text-xs font-serif-jp">
            <Calculator className="w-4 h-4" />
            <span className="text-slate-900 dark:text-slate-100">엔화 환율 계산기</span>
            <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-[#E63946] dark:text-[#FF5A65] text-[10px] font-bold border border-red-200/60 dark:border-red-900/60 flex items-center space-x-1 font-sans">
              <Landmark className="w-3 h-3" />
              <span>{rateData?.providerName || "하나은행 고시"}</span>
            </span>
          </div>

          <button
            onClick={loadExchangeRate}
            disabled={loadingRate}
            className="p-1.5 text-slate-400 hover:text-[#E63946] rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="환율 새로고침"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingRate ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Rate Display Badge */}
        <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <span className="font-bold text-slate-800 dark:text-slate-200 font-serif-jp">
            매매기준율: 100 JPY ➔ <span className="text-[#E63946] dark:text-[#FF5A65] font-black font-sans-outfit">{rateData ? rateData.rate100Jpy.toFixed(2) : "895.00"} KRW</span>
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">
            {rateData?.lastUpdated}
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold font-sans">
          <span className="text-slate-400 mr-1">자주 쓰는 금액:</span>
          {[1000, 5000, 10000, 30000, 50000].map((amt) => (
            <button
              key={amt}
              onClick={() => applyJpyPreset(amt)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#E63946] transition-colors border border-slate-200/70 dark:border-slate-800 cursor-pointer font-sans-outfit"
            >
              {amt.toLocaleString()}엔
            </button>
          ))}
        </div>

        {/* Input Converter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center font-sans">
          {/* JPY Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between font-serif-jp">
              <span>일본 엔화 (JPY)</span>
              <span>¥</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={jpyInput}
                onChange={(e) => handleJpyChange(e.target.value)}
                placeholder="0"
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#E63946]/40 outline-none font-sans-outfit"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-serif-jp">엔</span>
            </div>
          </div>

          {/* KRW Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between font-serif-jp">
              <span>한국 원화 (KRW)</span>
              <span>₩</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={krwInput}
                onChange={(e) => handleKrwChange(e.target.value)}
                placeholder="0"
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-bold text-sm text-[#E63946] dark:text-[#FF5A65] focus:ring-2 focus:ring-[#E63946]/40 outline-none font-sans-outfit"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold font-serif-jp">원</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Dedicated Real-Time City Weather & Outfit Tips Card */}
      <div className="bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 shadow-2xs p-4 transition-colors duration-250 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs font-serif-jp">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span className="text-slate-900 dark:text-slate-100">현지 실시간 날씨 & 여행 옷차림</span>
          </div>

          <button
            onClick={loadWeather}
            disabled={loadingWeather}
            className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="날씨 정보 새로고침"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingWeather ? "animate-spin" : ""}`} />
          </button>
        </div>

        {weatherData ? (
          <div className="space-y-2.5">
            {/* Main Weather Card */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 font-serif-jp">
                    📍 {weatherData.cityName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold font-sans">
                    {weatherData.weatherText}
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-sans-outfit">
                    {weatherData.temp}°C
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">
                    최고 {weatherData.tempMax}° / 최저 {weatherData.tempMin}°
                  </span>
                </div>
              </div>

              <div className="text-4xl select-none">
                {weatherData.icon}
              </div>
            </div>

            {/* Weather Details (Humidity & Wind) */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold font-sans">
              <div className="flex items-center space-x-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">습도</span>
                  <span className="text-slate-800 dark:text-slate-200 font-sans-outfit">{weatherData.humidity}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                <Wind className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">풍속</span>
                  <span className="text-slate-800 dark:text-slate-200 font-sans-outfit">{weatherData.windSpeed} m/s</span>
                </div>
              </div>
            </div>

            {/* Clothing Tip Banner */}
            <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-2 font-serif-jp">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{weatherData.clothingTip}</span>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 font-sans">
            실시간 날씨 정보를 불러오는 중입니다...
          </div>
        )}
      </div>
    </div>
  );
};
