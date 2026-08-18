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
  if (cachedRate && now - lastFetchTime < 3 * 60 * 1000) {
    return cachedRate;
  }

  // 1. Official Hana Bank Live Notice Rate API (Naver Stock Hana Bank FX Endpoint)
  try {
    const res = await fetch("https://api.stock.naver.com/marketindex/exchange/FX_JPYKRW");
    if (res.ok) {
      const data = await res.json();
      const info = data.exchangeInfo;
      const rawPrice = info?.closePrice || info?.calcPrice;
      const basePrice = typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice);

      if (!isNaN(basePrice) && basePrice > 0) {
        const degree = info?.degreeCount ? `${info.degreeCount}회차 ` : "";
        const timeStr = info?.localTradedAt
          ? new Date(info.localTradedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
          : new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

        cachedRate = {
          jpyToKrw: basePrice / 100,
          rate100Jpy: Number(basePrice.toFixed(2)),
          lastUpdated: `하나은행 ${degree}(${timeStr} 기준)`,
          providerName: "하나은행 고시",
          isLive: true,
        };
        lastFetchTime = now;
        return cachedRate;
      }
    }
  } catch (err) {
    console.warn("Naver Hana Bank API error, falling back to CORS proxies:", err);
  }

  // 2. Backup: Dunamu Hana Bank CORS proxy
  const backupEndpoints = [
    "https://api.allorigins.win/raw?url=https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWJPY",
  ];

  for (const endpoint of backupEndpoints) {
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
      // Continue
    }
  }

  // 3. Fallback: High-precision Open ER-API (open.er-api.com)
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/JPY");
    if (res.ok) {
      const data = await res.json();
      const krwRate = data.rates?.KRW;
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
