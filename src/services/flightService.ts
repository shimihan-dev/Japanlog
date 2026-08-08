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
  isLive?: boolean;
}

export interface PrefectureAirportOption {
  code: string;
  name: string;
  isGateway?: boolean;
}

export interface PrefectureAirportConfig {
  hasDirectFlight: boolean;
  airports: PrefectureAirportOption[];
}

const icnApiKey = (import.meta.env.VITE_ICN_AIRPORT_API_KEY || "").trim();
const korApiKey = (import.meta.env.VITE_KOR_AIRPORT_API_KEY || "").trim();

export const isFlightApiConfigured = Boolean(icnApiKey || korApiKey);

export const PREFECTURE_AIRPORTS_MAP: Record<number, PrefectureAirportConfig> = {
  1: { hasDirectFlight: true, airports: [{ code: "CTS", name: "삿포로 신치토세" }] },
  2: { hasDirectFlight: true, airports: [{ code: "AOJ", name: "아오모리 공항" }] },
  3: { hasDirectFlight: false, airports: [{ code: "SDJ", name: "센다이 공항 (관문)", isGateway: true }, { code: "AOJ", name: "아오모리 공항 (관문)", isGateway: true }] },
  4: { hasDirectFlight: true, airports: [{ code: "SDJ", name: "센다이 공항" }] },
  5: { hasDirectFlight: false, airports: [{ code: "AOJ", name: "아오모리 공항 (관문)", isGateway: true }, { code: "SDJ", name: "센다이 공항 (관문)", isGateway: true }] },
  6: { hasDirectFlight: false, airports: [{ code: "SDJ", name: "센다이 공항 (관문)", isGateway: true }] },
  7: { hasDirectFlight: false, airports: [{ code: "SDJ", name: "센다이 공항 (관문)", isGateway: true }, { code: "NRT", name: "도쿄 나리타 (관문)", isGateway: true }] },
  8: { hasDirectFlight: true, airports: [{ code: "IBR", name: "이바라키 공항" }, { code: "NRT", name: "도쿄 나리타" }] },
  9: { hasDirectFlight: false, airports: [{ code: "HND", name: "도쿄 하네다 (관문)", isGateway: true }, { code: "NRT", name: "도쿄 나리타 (관문)", isGateway: true }] },
  10: { hasDirectFlight: false, airports: [{ code: "HND", name: "도쿄 하네다 (관문)", isGateway: true }, { code: "NRT", name: "도쿄 나리타 (관문)", isGateway: true }] },
  11: { hasDirectFlight: false, airports: [{ code: "HND", name: "도쿄 하네다 (관문)", isGateway: true }, { code: "NRT", name: "도쿄 나리타 (관문)", isGateway: true }] },
  12: { hasDirectFlight: true, airports: [{ code: "NRT", name: "도쿄 나리타" }, { code: "HND", name: "도쿄 하네다" }] },
  13: { hasDirectFlight: true, airports: [{ code: "HND", name: "도쿄 하네다" }, { code: "NRT", name: "도쿄 나리타" }] },
  14: { hasDirectFlight: false, airports: [{ code: "HND", name: "도쿄 하네다 (관문)", isGateway: true }, { code: "NRT", name: "도쿄 나리타 (관문)", isGateway: true }] },
  15: { hasDirectFlight: false, airports: [{ code: "KMQ", name: "고마쓰 공항 (관문)", isGateway: true }, { code: "HND", name: "도쿄 하네다 (관문)", isGateway: true }] },
  16: { hasDirectFlight: false, airports: [{ code: "KMQ", name: "고마쓰 공항 (관문)", isGateway: true }] },
  17: { hasDirectFlight: true, airports: [{ code: "KMQ", name: "고마쓰 공항" }] },
  18: { hasDirectFlight: false, airports: [{ code: "KMQ", name: "고마쓰 공항 (관문)", isGateway: true }, { code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }] },
  19: { hasDirectFlight: false, airports: [{ code: "HND", name: "도쿄 하네다 (관문)", isGateway: true }, { code: "NRT", name: "도쿄 나리타 (관문)", isGateway: true }] },
  20: { hasDirectFlight: false, airports: [{ code: "HND", name: "도쿄 하네다 (관문)", isGateway: true }, { code: "NGO", name: "나고야 중부 (관문)", isGateway: true }] },
  21: { hasDirectFlight: false, airports: [{ code: "NGO", name: "나고야 중부 (관문)", isGateway: true }] },
  22: { hasDirectFlight: true, airports: [{ code: "FSZ", name: "시즈오카 공항" }, { code: "HND", name: "도쿄 하네다" }] },
  23: { hasDirectFlight: true, airports: [{ code: "NGO", name: "나고야 중부" }, { code: "FSZ", name: "시즈오카" }] },
  24: { hasDirectFlight: false, airports: [{ code: "NGO", name: "나고야 중부 (관문)", isGateway: true }, { code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }] },
  25: { hasDirectFlight: false, airports: [{ code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }] },
  26: { hasDirectFlight: false, airports: [{ code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }, { code: "HND", name: "도쿄 하네다 (관문)", isGateway: true }] },
  27: { hasDirectFlight: true, airports: [{ code: "KIX", name: "오사카 간사이" }] },
  28: { hasDirectFlight: false, airports: [{ code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }] },
  29: { hasDirectFlight: false, airports: [{ code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }] },
  30: { hasDirectFlight: false, airports: [{ code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }] },
  31: { hasDirectFlight: true, airports: [{ code: "YGJ", name: "요나고 공항" }] },
  32: { hasDirectFlight: false, airports: [{ code: "YGJ", name: "요나고 공항 (관문)", isGateway: true }, { code: "HIJ", name: "히로시마 공항 (관문)", isGateway: true }] },
  33: { hasDirectFlight: true, airports: [{ code: "OKJ", name: "오카야마 공항" }] },
  34: { hasDirectFlight: true, airports: [{ code: "HIJ", name: "히로시마 공항" }] },
  35: { hasDirectFlight: false, airports: [{ code: "FUK", name: "후쿠오카 공항 (관문)", isGateway: true }, { code: "HIJ", name: "히로시마 공항 (관문)", isGateway: true }] },
  36: { hasDirectFlight: false, airports: [{ code: "TAK", name: "다카마쓰 공항 (관문)", isGateway: true }, { code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }] },
  37: { hasDirectFlight: true, airports: [{ code: "TAK", name: "다카마쓰 공항" }, { code: "MYJ", name: "마츠야마 공항" }] },
  38: { hasDirectFlight: true, airports: [{ code: "MYJ", name: "마츠야마 공항" }, { code: "TAK", name: "다카마쓰 공항" }] },
  39: { hasDirectFlight: false, airports: [{ code: "TAK", name: "다카마쓰 공항 (관문)", isGateway: true }, { code: "MYJ", name: "마츠야마 공항 (관문)", isGateway: true }] },
  40: { hasDirectFlight: true, airports: [{ code: "FUK", name: "후쿠오카 공항" }, { code: "KKJ", name: "기타큐슈 공항" }] },
  41: { hasDirectFlight: true, airports: [{ code: "HSG", name: "사가 공항" }, { code: "FUK", name: "후쿠오카 공항" }] },
  42: { hasDirectFlight: true, airports: [{ code: "NGS", name: "나가사키 공항" }, { code: "FUK", name: "후쿠오카 공항" }] },
  43: { hasDirectFlight: true, airports: [{ code: "KMJ", name: "구마모토 공항" }, { code: "FUK", name: "후쿠오카 공항" }] },
  44: { hasDirectFlight: true, airports: [{ code: "OIT", name: "오이타 공항" }, { code: "FUK", name: "후쿠오카 공항" }] },
  45: { hasDirectFlight: true, airports: [{ code: "KMI", name: "미야자키 공항" }] },
  46: { hasDirectFlight: true, airports: [{ code: "KOJ", name: "가고시마 공항" }] },
  47: { hasDirectFlight: true, airports: [{ code: "OKA", name: "오키나와 나하" }] },
};

// Comprehensive Direct Flight Schedules Database (Korea ↔ Japan)
const FLIGHT_DATABASE: FlightSchedule[] = [
  // Fukuoka (FUK)
  { airline: "대한항공", flightNo: "KE787", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "07:55", arrivalTime: "09:20", days: "매일" },
  { airline: "대한항공", flightNo: "KE789", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "13:05", arrivalTime: "14:30", days: "매일" },
  { airline: "대한항공", flightNo: "KE781", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "16:40", arrivalTime: "18:05", days: "매일" },
  { airline: "대한항공", flightNo: "KE793", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "18:40", arrivalTime: "20:05", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ132", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "08:40", arrivalTime: "10:00", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ134", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "16:20", arrivalTime: "17:40", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ136", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "18:10", arrivalTime: "19:30", days: "매일" },
  { airline: "제주항공", flightNo: "7C1402", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "06:15", arrivalTime: "07:35", days: "매일" },
  { airline: "제주항공", flightNo: "7C1404", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "14:10", arrivalTime: "15:35", days: "매일" },
  { airline: "제주항공", flightNo: "7C1406", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "19:00", arrivalTime: "20:25", days: "매일" },
  { airline: "진에어", flightNo: "LJ265", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "07:25", arrivalTime: "08:45", days: "매일" },
  { airline: "진에어", flightNo: "LJ267", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "15:10", arrivalTime: "16:30", days: "매일" },
  { airline: "티웨이항공", flightNo: "TW293", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "10:05", arrivalTime: "11:30", days: "매일" },
  { airline: "티웨이항공", flightNo: "TW295", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "15:05", arrivalTime: "16:30", days: "매일" },
  { airline: "에어부산", flightNo: "BX112", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "07:30", arrivalTime: "08:25", days: "매일" },
  { airline: "에어부산", flightNo: "BX114", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "14:00", arrivalTime: "14:55", days: "매일" },
  { airline: "에어부산", flightNo: "BX116", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "18:00", arrivalTime: "18:55", days: "매일" },
  { airline: "티웨이항공", flightNo: "TW271", depAirport: "대구", depAirportCode: "TAE", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "08:00", arrivalTime: "09:05", days: "매일" },
  { airline: "이스타항공", flightNo: "ZE605", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "08:35", arrivalTime: "10:00", days: "매일" },
  { airline: "이스타항공", flightNo: "ZE607", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "14:50", arrivalTime: "16:15", days: "매일" },
  { airline: "에어서울", flightNo: "RS731", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "09:10", arrivalTime: "10:35", days: "매일" },

  // Kitakyushu (KKJ)
  { airline: "진에어", flightNo: "LJ269", depAirport: "인천", depAirportCode: "ICN", arrAirport: "기타큐슈", arrAirportCode: "KKJ", departureTime: "07:05", arrivalTime: "08:30", days: "매일" },
  { airline: "진에어", flightNo: "LJ271", depAirport: "인천", depAirportCode: "ICN", arrAirport: "기타큐슈", arrAirportCode: "KKJ", departureTime: "17:15", arrivalTime: "18:40", days: "매일" },

  // Kansai / Osaka (KIX)
  { airline: "대한항공", flightNo: "KE721", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:15", arrivalTime: "09:05", days: "매일" },
  { airline: "대한항공", flightNo: "KE723", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "09:00", arrivalTime: "10:50", days: "매일" },
  { airline: "대한항공", flightNo: "KE725", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "15:20", arrivalTime: "17:10", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ112", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:00", arrivalTime: "09:40", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ114", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "14:10", arrivalTime: "15:50", days: "매일" },
  { airline: "진에어", flightNo: "LJ211", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:50", arrivalTime: "09:35", days: "매일" },
  { airline: "진에어", flightNo: "LJ213", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "13:30", arrivalTime: "15:15", days: "매일" },
  { airline: "제주항공", flightNo: "7C1302", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:00", arrivalTime: "08:55", days: "매일" },
  { airline: "티웨이항공", flightNo: "TW281", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:45", arrivalTime: "09:30", days: "매일" },
  { airline: "에어부산", flightNo: "BX122", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:35", arrivalTime: "10:00", days: "매일" },
  { airline: "에어부산", flightNo: "BX124", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "16:30", arrivalTime: "18:00", days: "매일" },
  { airline: "티웨이항공", flightNo: "TW523", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "10:00", arrivalTime: "11:30", days: "매일" },
  { airline: "피치항공", flightNo: "MM708", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "22:40", arrivalTime: "00:25", days: "매일" },

  // Tokyo Haneda / Narita (HND/NRT)
  { airline: "대한항공", flightNo: "KE2101", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "09:00", arrivalTime: "11:05", days: "매일" },
  { airline: "대한항공", flightNo: "KE2103", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "16:20", arrivalTime: "18:35", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ1015", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "08:40", arrivalTime: "10:45", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ1035", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "15:50", arrivalTime: "17:55", days: "매일" },
  { airline: "대한항공", flightNo: "KE703", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "10:10", arrivalTime: "12:35", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ102", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "09:00", arrivalTime: "11:20", days: "매일" },
  { airline: "제주항공", flightNo: "7C1102", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "06:55", arrivalTime: "09:25", days: "매일" },
  { airline: "제주항공", flightNo: "7C1104", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "15:00", arrivalTime: "17:30", days: "매일" },
  { airline: "진에어", flightNo: "LJ201", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "07:05", arrivalTime: "09:35", days: "매일" },
  { airline: "에어프레미아", flightNo: "YP101", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:40", arrivalTime: "11:15", days: "월,수,금,일" },
  { airline: "에어부산", flightNo: "BX111", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:05", arrivalTime: "10:10", days: "매일" },
  { airline: "티웨이항공", flightNo: "TW527", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "09:30", arrivalTime: "11:40", days: "매일" },

  // Sapporo Chitose (CTS)
  { airline: "대한항공", flightNo: "KE765", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "10:05", arrivalTime: "12:50", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ174", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "14:20", arrivalTime: "17:05", days: "매일" },
  { airline: "진에어", flightNo: "LJ231", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "08:20", arrivalTime: "11:05", days: "매일" },
  { airline: "제주항공", flightNo: "7C1902", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "07:20", arrivalTime: "10:05", days: "매일" },
  { airline: "티웨이항공", flightNo: "TW171", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "11:35", arrivalTime: "14:25", days: "매일" },
  { airline: "에어부산", flightNo: "BX182", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "09:05", arrivalTime: "11:30", days: "월,목,금,일" },

  // Okinawa Naha (OKA)
  { airline: "대한항공", flightNo: "KE755", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "08:05", arrivalTime: "10:25", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ172", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "09:40", arrivalTime: "12:05", days: "매일" },
  { airline: "진에어", flightNo: "LJ241", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "10:10", arrivalTime: "12:35", days: "매일" },
  { airline: "제주항공", flightNo: "7C1802", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "12:40", arrivalTime: "15:05", days: "매일" },

  // Nagoya Chubu (NGO)
  { airline: "대한항공", flightNo: "KE753", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "10:35", arrivalTime: "12:35", days: "매일" },
  { airline: "아시아나항공", flightNo: "OZ122", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "08:20", arrivalTime: "10:10", days: "매일" },
  { airline: "진에어", flightNo: "LJ263", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "07:35", arrivalTime: "09:25", days: "매일" },
  { airline: "제주항공", flightNo: "7C1602", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "11:10", arrivalTime: "13:00", days: "매일" },

  // Takamatsu (TAK)
  { airline: "에어서울", flightNo: "RS741", depAirport: "인천", depAirportCode: "ICN", arrAirport: "다카마쓰", arrAirportCode: "TAK", departureTime: "08:45", arrivalTime: "10:30", days: "매일" },
  { airline: "진에어", flightNo: "LJ291", depAirport: "인천", depAirportCode: "ICN", arrAirport: "다카마쓰", arrAirportCode: "TAK", departureTime: "12:05", arrivalTime: "13:45", days: "화,목,토" },

  // Matsuyama (MYJ)
  { airline: "제주항공", flightNo: "7C1704", depAirport: "인천", depAirportCode: "ICN", arrAirport: "마츠야마", arrAirportCode: "MYJ", departureTime: "13:05", arrivalTime: "14:35", days: "매일" },
  { airline: "에어부산", flightNo: "BX142", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "마츠야마", arrAirportCode: "MYJ", departureTime: "15:15", arrivalTime: "16:30", days: "수,토,일" },

  // Komatsu (KMQ)
  { airline: "대한항공", flightNo: "KE775", depAirport: "인천", depAirportCode: "ICN", arrAirport: "고마쓰", arrAirportCode: "KMQ", departureTime: "07:35", arrivalTime: "09:25", days: "수,금,일" },

  // Kumamoto (KMJ)
  { airline: "대한항공", flightNo: "KE797", depAirport: "인천", depAirportCode: "ICN", arrAirport: "구마모토", arrAirportCode: "KMJ", departureTime: "15:50", arrivalTime: "17:25", days: "월,수,금,일" },
  { airline: "아시아나항공", flightNo: "OZ158", depAirport: "인천", depAirportCode: "ICN", arrAirport: "구마모토", arrAirportCode: "KMJ", departureTime: "10:20", arrivalTime: "11:50", days: "목,일" },
  { airline: "티웨이항공", flightNo: "TW295", depAirport: "인천", depAirportCode: "ICN", arrAirport: "구마모토", arrAirportCode: "KMJ", departureTime: "07:45", arrivalTime: "09:15", days: "매일" },

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

export async function fetchLiveAirportFlights(airportCode: string, depFilter: string = "ALL"): Promise<FlightSchedule[]> {
  let liveItems: FlightSchedule[] = [];

  // 1. Try Incheon Airport & KAC Open API via proxy
  if (icnApiKey || korApiKey) {
    const keyToUse = icnApiKey || korApiKey;
    try {
      // Use Vite dev proxy /api/data-go to bypass browser CORS
      const proxyUrl = `/api/data-go/B551177/StatusOfFlightInfoGG/getFlightsStatusInfo?serviceKey=${keyToUse}&type=json&searchtype=O`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        const items = data?.response?.body?.items || [];
        items.forEach((item: any) => {
          const arrCode = item.airportCode || item.airport;
          if (arrCode === airportCode) {
            const depTimeRaw = item.scheduleDateTime || item.estimatedDateTime || "";
            const depTimeFormatted = depTimeRaw.length >= 4 ? `${depTimeRaw.slice(-4, -2)}:${depTimeRaw.slice(-2)}` : "실시간";
            liveItems.push({
              airline: item.airline || "대한항공/아시아나",
              flightNo: item.flightId || item.flightNo || "LIVE",
              depAirport: "인천",
              depAirportCode: "ICN",
              arrAirport: item.airport || arrCode,
              arrAirportCode: arrCode,
              departureTime: depTimeFormatted,
              arrivalTime: "직항",
              days: "실시간 API",
              isLive: true,
            });
          }
        });
      }
    } catch (err) {
      // Ignore CORS or network error and seamlessly rely on Database
    }
  }

  // 2. Filter matching entries from Database
  const matchedDb = FLIGHT_DATABASE.filter((item) => {
    const isAirportMatch = item.arrAirportCode === airportCode;
    const isDepMatch = depFilter === "ALL" || item.depAirportCode === depFilter;
    return isAirportMatch && isDepMatch;
  });

  if (liveItems.length > 0) {
    const filteredLive = liveItems.filter((f) => depFilter === "ALL" || f.depAirportCode === depFilter);
    if (filteredLive.length > 0) {
      const merged = [...filteredLive, ...matchedDb];
      const seen = new Set<string>();
      return merged.filter((item) => {
        const key = `${item.flightNo}-${item.departureTime}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
  }

  return matchedDb;
}
