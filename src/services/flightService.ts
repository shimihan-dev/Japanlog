export interface FlightSchedule {
  airline: string;
  flightNo: string;
  depAirport: string;
  depAirportCode: string;
  arrAirport: string;
  arrAirportCode: string;
  departureTime: string;
  arrivalTime: string;
  days: string;
}

const icnApiKey = (import.meta.env.VITE_ICN_AIRPORT_API_KEY || "").trim();
const korApiKey = (import.meta.env.VITE_KOR_AIRPORT_API_KEY || "").trim();

export const isFlightApiConfigured = Boolean(icnApiKey || korApiKey);

export const PREFECTURE_IATA_MAP: Record<number, { mainCode: string; name: string; altCodes?: string[] }> = {
  1: { mainCode: "CTS", name: "신치토세 (삿포로)" },
  2: { mainCode: "AOJ", name: "아오모리" },
  3: { mainCode: "SDJ", name: "센다이 (인근)" },
  4: { mainCode: "SDJ", name: "센다이" },
  5: { mainCode: "AXT", name: "아키타" },
  6: { mainCode: "SDJ", name: "센다이 (인근)" },
  7: { mainCode: "SDJ", name: "센다이 (인근)" },
  8: { mainCode: "IBR", name: "이바라키" },
  9: { mainCode: "NRT", name: "나리타 (인근)" },
  10: { mainCode: "HND", name: "하네다 (인근)" },
  11: { mainCode: "HND", name: "하네다 (인근)" },
  12: { mainCode: "NRT", name: "나리타" },
  13: { mainCode: "HND", name: "하네다", altCodes: ["NRT"] },
  14: { mainCode: "HND", name: "하네다 (인근)", altCodes: ["NRT"] },
  15: { mainCode: "KIJ", name: "니가타" },
  16: { mainCode: "TOY", name: "도야마" },
  17: { mainCode: "KMQ", name: "고마쓰" },
  18: { mainCode: "KMQ", name: "고마쓰 (인근)" },
  19: { mainCode: "HND", name: "하네다 (인근)" },
  20: { mainCode: "HND", name: "하네다 (인근)" },
  21: { mainCode: "NGO", name: "나고야 중부 (인근)" },
  22: { mainCode: "FSZ", name: "시즈오카" },
  23: { mainCode: "NGO", name: "나고야 중부" },
  24: { mainCode: "NGO", name: "나고야 중부 (인근)" },
  25: { mainCode: "KIX", name: "간사이 (인근)" },
  26: { mainCode: "KIX", name: "간사이 (인근)" },
  27: { mainCode: "KIX", name: "간사이 (오사카)" },
  28: { mainCode: "KIX", name: "간사이 (인근)" },
  29: { mainCode: "KIX", name: "간사이 (인근)" },
  30: { mainCode: "KIX", name: "간사이 (인근)" },
  31: { mainCode: "YGJ", name: "요나고" },
  32: { mainCode: "YGJ", name: "요나고 (인근)" },
  33: { mainCode: "OKJ", name: "오카야마" },
  34: { mainCode: "HIJ", name: "히로시마" },
  35: { mainCode: "UBJ", name: "야마구치 우베" },
  36: { mainCode: "TAK", name: "다카마쓰 (인근)" },
  37: { mainCode: "TAK", name: "다카마쓰" },
  38: { mainCode: "MYJ", name: "마츠야마" },
  39: { mainCode: "TAK", name: "다카마쓰 (인근)" },
  40: { mainCode: "FUK", name: "후쿠오카", altCodes: ["KKJ"] },
  41: { mainCode: "HSG", name: "사가", altCodes: ["FUK"] },
  42: { mainCode: "NGS", name: "나가사키" },
  43: { mainCode: "KMJ", name: "구마모토" },
  44: { mainCode: "OIT", name: "오이타" },
  45: { mainCode: "KMI", name: "미야자키" },
  46: { mainCode: "KOJ", name: "가고시마" },
  47: { mainCode: "OKA", name: "오키나와 나하" },
};

// Comprehensive Direct Flight Schedules Database (Korea ↔ Japan)
const FLIGHT_DATABASE: FlightSchedule[] = [
  // Fukuoka (FUK)
  { airline: "대한항공", flightNo: "KE787", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "07:55", arrivalTime: "09:20", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ132", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "08:40", arrivalTime: "10:00", days: "매일" },
  { airline: "제주항공", flightNo: "7C1402", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "06:15", arrivalTime: "07:35", days: "매일" },
  { airline: "에어부산", flightNo: "BX112", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "07:30", arrivalTime: "08:25", days: "매일" },
  { airline: "티웨이항공", flightNo: "TW271", depAirport: "대구", depAirportCode: "TAE", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "08:00", arrivalTime: "09:05", days: "매일" },

  // Kansai / Osaka (KIX)
  { airline: "대한항공", flightNo: "KE721", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:15", arrivalTime: "09:05", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ112", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:00", arrivalTime: "09:40", days: "매일" },
  { airline: "진에어", flightNo: "LJ211", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:50", arrivalTime: "09:35", days: "매일" },
  { airline: "에어부산", flightNo: "BX122", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:35", arrivalTime: "10:00", days: "매일" },
  { airline: "티웨이항공", flightNo: "TW523", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "10:00", arrivalTime: "11:30", days: "매일" },

  // Tokyo Haneda / Narita (HND/NRT)
  { airline: "대한항공", flightNo: "KE2101", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "09:00", arrivalTime: "11:05", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ1015", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "08:40", arrivalTime: "10:45", days: "매일" },
  { airline: "제주항공", flightNo: "7C1102", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "06:55", arrivalTime: "09:25", days: "매일" },
  { airline: "에어프레미아", flightNo: "YP101", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:40", arrivalTime: "11:15", days: "월,수,금,일" },

  // Sapporo Chitose (CTS)
  { airline: "대한항공", flightNo: "KE765", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "10:05", arrivalTime: "12:50", days: "매일" },
  { airline: "진에어", flightNo: "LJ231", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "08:20", arrivalTime: "11:05", days: "매일" },
  { airline: "에어부산", flightNo: "BX182", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "09:05", arrivalTime: "11:30", days: "월,목,금,일" },

  // Okinawa Naha (OKA)
  { airline: "대한항공", flightNo: "KE755", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "08:05", arrivalTime: "10:25", days: "매일" },
  { airline: "진에어", flightNo: "LJ241", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "10:10", arrivalTime: "12:35", days: "매일" },

  // Nagoya Chubu (NGO)
  { airline: "대한항공", flightNo: "KE753", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "10:35", arrivalTime: "12:35", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ122", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "08:20", arrivalTime: "10:10", days: "매일" },

  // Takamatsu (TAK)
  { airline: "에어서울", flightNo: "RS741", depAirport: "인천", depAirportCode: "ICN", arrAirport: "다카마쓰", arrAirportCode: "TAK", departureTime: "08:45", arrivalTime: "10:30", days: "매일" },

  // Matsuyama (MYJ)
  { airline: "제주항공", flightNo: "7C1704", depAirport: "인천", depAirportCode: "ICN", arrAirport: "마츠야마", arrAirportCode: "MYJ", departureTime: "13:05", arrivalTime: "14:35", days: "매일" },
  { airline: "에어부산", flightNo: "BX142", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "마츠야마", arrAirportCode: "MYJ", departureTime: "15:15", arrivalTime: "16:30", days: "수,토,일" },

  // Komatsu (KMQ)
  { airline: "대한항공", flightNo: "KE775", depAirport: "인천", depAirportCode: "ICN", arrAirport: "고마쓰", arrAirportCode: "KMQ", departureTime: "07:35", arrivalTime: "09:25", days: "수,금,일" },

  // Kumamoto (KMJ)
  { airline: "대한항공", flightNo: "KE797", depAirport: "인천", depAirportCode: "ICN", arrAirport: "구마모토", arrAirportCode: "KMJ", departureTime: "15:50", arrivalTime: "17:25", days: "월,수,금,일" },
  { airline: "아시아나항공", flightNo: "OZ158", depAirport: "인천", depAirportCode: "ICN", arrAirport: "구마모토", arrAirportCode: "KMJ", departureTime: "10:20", arrivalTime: "11:50", days: "목,일" },

  // Kagoshima (KOJ)
  { airline: "대한항공", flightNo: "KE785", depAirport: "인천", depAirportCode: "ICN", arrAirport: "가고시마", arrAirportCode: "KOJ", departureTime: "09:20", arrivalTime: "11:00", days: "수,금,일" },

  // Yonago (YGJ)
  { airline: "에어서울", flightNo: "RS721", depAirport: "인천", depAirportCode: "ICN", arrAirport: "요나고", arrAirportCode: "YGJ", departureTime: "13:20", arrivalTime: "14:50", days: "수,금,일" },

  // Shizuoka (FSZ)
  { airline: "진에어", flightNo: "LJ261", depAirport: "인천", depAirportCode: "ICN", arrAirport: "시즈오카", arrAirportCode: "FSZ", departureTime: "09:05", arrivalTime: "11:00", days: "매일" },

  // Hiroshima (HIJ)
  { airline: "제주항공", flightNo: "7C1802", depAirport: "인천", depAirportCode: "ICN", arrAirport: "히로시마", arrAirportCode: "HIJ", departureTime: "08:05", arrivalTime: "09:30", days: "매일" },

  // Okayama (OKJ)
  { airline: "대한항공", flightNo: "KE773", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오카야마", arrAirportCode: "OKJ", departureTime: "08:00", arrivalTime: "09:30", days: "매일" },

  // Nagasaki (NGS)
  { airline: "대한항공", flightNo: "KE791", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나가사키", arrAirportCode: "NGS", departureTime: "08:00", arrivalTime: "09:30", days: "월,목,토" },

  // Oita (OIT)
  { airline: "제주항공", flightNo: "7C1508", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오이타", arrAirportCode: "OIT", departureTime: "10:50", arrivalTime: "12:30", days: "화,목,토" },

  // Miyazaki (KMI)
  { airline: "아시아나항공", flightNo: "OZ158", depAirport: "인천", depAirportCode: "ICN", arrAirport: "미야자키", arrAirportCode: "KMI", departureTime: "09:40", arrivalTime: "11:20", days: "수,금,일" },

  // Saga (HSG)
  { airline: "티웨이항공", flightNo: "TW291", depAirport: "인천", depAirportCode: "ICN", arrAirport: "사가", arrAirportCode: "HSG", departureTime: "11:45", arrivalTime: "13:05", days: "화,목,토" },

  // Ibaraki (IBR)
  { airline: "에어부산", flightNo: "BX191", depAirport: "인천/청주", depAirportCode: "CJJ", arrAirport: "이바라키", arrAirportCode: "IBR", departureTime: "11:00", arrivalTime: "13:00", days: "화,목,토" },

  // Aomori (AOJ)
  { airline: "대한항공", flightNo: "KE767", depAirport: "인천", depAirportCode: "ICN", arrAirport: "아오모리", arrAirportCode: "AOJ", departureTime: "10:30", arrivalTime: "12:50", days: "화,목,토" },

  // Sendai (SDJ)
  { airline: "아시아나항공", flightNo: "OZ152", depAirport: "인천", depAirportCode: "ICN", arrAirport: "센다이", arrAirportCode: "SDJ", departureTime: "09:35", arrivalTime: "11:50", days: "화,금,일" },
];

export async function getFlightSchedules(prefCode: number, depFilter: string = "ALL"): Promise<FlightSchedule[]> {
  const iataInfo = PREFECTURE_IATA_MAP[prefCode];
  if (!iataInfo) return [];

  const targetCodes = [iataInfo.mainCode, ...(iataInfo.altCodes || [])];

  const matched = FLIGHT_DATABASE.filter((item) => {
    const isAirportMatch = targetCodes.includes(item.arrAirportCode);
    const isDepMatch = depFilter === "ALL" || item.depAirportCode === depFilter;
    return isAirportMatch && isDepMatch;
  });

  return matched;
}
