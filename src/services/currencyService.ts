export interface ExchangeRateData {
  jpyToKrw: number; // e.g. 8.945 (1 JPY = 8.945 KRW)
  rate100Jpy: number; // e.g. 894.5 (100 JPY = 894.5 KRW)
  cashBuyingPrice?: number; // 살 때
  cashSellingPrice?: number; // 팔 때
  lastUpdated: string;
  providerName: string;
  isLive: boolean;
}

const FALLBACK_RATE: ExchangeRateData = {
  jpyToKrw: 8.95,
  rate100Jpy: 895.0,
  lastUpdated: "하나은행 매매기준율 (100엔 = 895원)",
  providerName: "하나은행",
  isLive: false,
};

let cachedRate: ExchangeRateData | null = null;
let lastFetchTime = 0;

export async function fetchLiveJpyExchangeRate(): Promise<ExchangeRateData> {
  const now = Date.now();
  if (cachedRate && now - lastFetchTime < 5 * 60 * 1000) {
    return cachedRate;
  }

  // 1. Try Hana Bank via CORS proxy and direct endpoints
  const hanaEndpoints = [
    "https://api.allorigins.win/raw?url=https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWJPY",
    "/api/hanabank?codes=FRX.KRWJPY",
    "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWJPY",
  ];

  for (const endpoint of hanaEndpoints) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          const basePrice = item.basePrice; // 100엔당 KRW
          if (typeof basePrice === "number" && basePrice > 0) {
            const timeStr = item.time ? `${item.date || ""} ${item.time}` : new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

            cachedRate = {
              jpyToKrw: basePrice / 100,
              rate100Jpy: Number(basePrice.toFixed(2)),
              cashBuyingPrice: item.cashBuyingPrice,
              cashSellingPrice: item.cashSellingPrice,
              lastUpdated: `하나은행 고시 (${timeStr} 기준)`,
              providerName: "하나은행 고시",
              isLive: true,
            };
            lastFetchTime = now;
            return cachedRate;
          }
        }
      }
    } catch {
      // Continue to next endpoint
    }
  }

  // 2. High-precision Open ER-API (open.er-api.com)
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/JPY");
    if (res.ok) {
      const data = await res.json();
      const krwRate = data.rates?.KRW; // e.g. 8.877192
      if (typeof krwRate === "number" && krwRate > 0) {
        const timeStr = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
        const rate100 = Number((krwRate * 100).toFixed(2));
        cachedRate = {
          jpyToKrw: krwRate,
          rate100Jpy: rate100,
          lastUpdated: `실시간 API (${timeStr} 기준)`,
          providerName: "실시간 환율 API",
          isLive: true,
        };
        lastFetchTime = now;
        return cachedRate;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch exchange rate, using fallback:", err);
  }

  return FALLBACK_RATE;
}
