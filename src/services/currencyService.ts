export interface ExchangeRateData {
  jpyToKrw: number; // e.g. 8.95 (1 JPY = 8.95 KRW)
  rate100Jpy: number; // e.g. 895.0 (100 JPY = 895.0 KRW)
  lastUpdated: string;
  isLive: boolean;
}

const FALLBACK_RATE: ExchangeRateData = {
  jpyToKrw: 8.95,
  rate100Jpy: 895.0,
  lastUpdated: "기본 환율 (100엔 = 895원)",
  isLive: false,
};

let cachedRate: ExchangeRateData | null = null;
let lastFetchTime = 0;

export async function fetchLiveJpyExchangeRate(): Promise<ExchangeRateData> {
  const now = Date.now();
  // Cache for 10 minutes to avoid unnecessary API calls
  if (cachedRate && now - lastFetchTime < 10 * 60 * 1000) {
    return cachedRate;
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/JPY");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    const krwRate = data.rates?.KRW;
    if (typeof krwRate === "number" && krwRate > 0) {
      const timeStr = new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      cachedRate = {
        jpyToKrw: krwRate,
        rate100Jpy: Math.round(krwRate * 100 * 10) / 10,
        lastUpdated: `실시간 API (${timeStr} 기준)`,
        isLive: true,
      };
      lastFetchTime = now;
      return cachedRate;
    }
  } catch (err) {
    console.warn("Failed to fetch live JPY exchange rate, using fallback:", err);
  }

  return FALLBACK_RATE;
}
