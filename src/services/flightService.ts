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
  aircraft?: string;
  direction?: "OUTBOUND" | "INBOUND"; // OUTBOUND: Korea -> Japan, INBOUND: Japan -> Korea
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

export const AEROTYPE_BASE_URL = "https://aerotype-iota.vercel.app/";

const AEROTYPE_MODEL_ALIAS_MAP: Record<string, string> = {
  // Boeing 737 MAX Series
  "B737-8": "B737-MAX8",
  "737-8": "B737-MAX8",
  "B737-9": "B737-MAX9",
  "737-9": "B737-MAX9",
  "B737-7": "B737-MAX7",
  "737-7": "B737-MAX7",
  "B737-10": "B737-MAX10",
  "737-10": "B737-MAX10",

  // Airbus Series
  "A321-200": "A321",
  "A320-200": "A320",

  // Boeing 767 Series
  "B767-300ER": "767-300ER",
};

export function getAerotypeUrl(aircraftModel: string): string {
  const cleaned = aircraftModel.trim();
  const targetId = AEROTYPE_MODEL_ALIAS_MAP[cleaned] || cleaned;
  return `${AEROTYPE_BASE_URL}?id=${encodeURIComponent(targetId)}`;
}

export const AEROLOPA_BASE_URL = "https://www.aerolopa.com";

const AIRLINE_AEROLOPA_CODE_MAP: Record<string, string> = {
  "대한항공": "ke",
  "Korean Air": "ke",
  "KE": "ke",
  "KAL": "ke",
  "아시아나항공": "oz",
  "아시아나": "oz",
  "Asiana Airlines": "oz",
  "OZ": "oz",
  "AAR": "oz",
  "일본항공": "jl",
  "JAL": "jl",
  "Japan Airlines": "jl",
  "JL": "jl",
  "전일본공수": "nh",
  "ANA": "nh",
  "All Nippon Airways": "nh",
  "NH": "nh",
  "에어프레미아": "yp",
  "Air Premia": "yp",
  "YP": "yp",
  "피치항공": "mm",
  "Peach": "mm",
  "MM": "mm",
  "제주항공": "7c",
  "Jeju Air": "7c",
  "7C": "7c",
  "진에어": "lj",
  "Jin Air": "lj",
  "LJ": "lj",
  "티웨이항공": "tw",
  "티웨이": "tw",
  "T'way Air": "tw",
  "TW": "tw",
  "에어부산": "bx",
  "Air Busan": "bx",
  "BX": "bx",
  "에어서울": "rs",
  "Air Seoul": "rs",
  "RS": "rs",
  "ZIPAIR": "zg",
  "ZG": "zg",
};

const AIRCRAFT_AEROLOPA_SLUG_MAP: Record<string, string> = {
  "B787-9": "789",
  "787-9": "789",
  "B787-10": "781",
  "787-10": "781",
  "B787-8": "788",
  "787-8": "788",
  "A350-900": "359",
  "350-900": "359",
  "A350-1000": "351",
  "350-1000": "351",
  "A321neo": "321",
  "A321-200": "321",
  "A321": "321",
  "A320": "320",
  "A320neo": "320",
  "B777-300ER": "77w",
  "777-300ER": "77w",
  "B777-200ER": "772",
  "777-200ER": "772",
  // Boeing 737 MAX Series (7m8, 7m9)
  "B737-8": "7m8",
  "737-8": "7m8",
  "B737-MAX8": "7m8",
  "737-MAX8": "7m8",
  "B737-9": "7m9",
  "737-9": "7m9",
  "B737-MAX9": "7m9",

  // Boeing 737 NG Series (738, 739)
  "B737-800": "738",
  "737-800": "738",
  "B737-900": "739",
  "737-900": "739",
  "B737-900ER": "739",
  "737-900ER": "739",
  "A380-800": "388",
  "A380": "388",
  "B767-300ER": "763",
  "767-300ER": "763",
};

// Exact crawled AeroLOPA seat map layout URLs for major Korea-Japan airlines & fleet variants
const EXACT_AEROLOPA_PATH_MAP: Record<string, string> = {
  // Korean Air (ke)
  "ke-B787-9": "ke-789-1",
  "ke-787-9": "ke-789-1",
  "ke-B787-10": "ke-781",
  "ke-787-10": "ke-781",
  "ke-A350-900": "ke-359",
  "ke-350-900": "ke-359",
  "ke-A321neo": "ke-32q",
  "ke-A321-200": "ke-32q",
  "ke-A321": "ke-32q",
  "ke-B737-8": "ke-7m8-2",
  "ke-737-8": "ke-7m8-2",
  "ke-B737-MAX8": "ke-7m8-2",
  "ke-B737-800": "ke-738",
  "ke-737-800": "ke-738",
  "ke-B737-900": "ke-739",
  "ke-B737-900ER": "ke-739er",
  "ke-A380-800": "ke-388-m",
  "ke-A380": "ke-388-m",
  "ke-A330-300": "ke-333-1",
  "ke-A330-200": "ke-333-1",
  "ke-B777-300ER": "ke-77w-1",
  "ke-B777-200ER": "ke-773",
  "ke-A220-300": "ke-223",

  // Asiana Airlines (oz)
  "oz-A350-900": "oz-359",
  "oz-350-900": "oz-359",
  "oz-A380-800": "oz-388-m",
  "oz-A380": "oz-388-m",
  "oz-A321neo": "oz-32q-1",
  "oz-A321-200": "oz-321",
  "oz-A321": "oz-321",
  "oz-A330-300": "oz-333-1",
  "oz-B777-200ER": "oz-772-1",

  // Japan Airlines (jl)
  "jl-A350-900": "jl-359-x11",
  "jl-350-900": "jl-359-x11",
  "jl-A350-1000": "jl-351",
  "jl-B787-8": "jl-788-e12",
  "jl-787-8": "jl-788-e12",
  "jl-B787-9": "jl-789-e91",
  "jl-787-9": "jl-789-e91",
  "jl-B737-800": "jl-738-v40",
  "jl-737-800": "jl-738-v40",
  "jl-B767-300ER": "jl-763-a25",
  "jl-B777-300ER": "jl-77w-w84",

  // ANA (nh)
  "nh-B787-8": "nh-788-2",
  "nh-787-8": "nh-788-2",
  "nh-B787-9": "nh-789-1",
  "nh-787-9": "nh-789-1",
  "nh-B787-10": "nh-781",
  "nh-787-10": "nh-781",
  "nh-A321neo": "nh-32n",
  "nh-B737-800": "nh-738",
  "nh-737-800": "nh-738",
  "nh-A380-800": "nh-388-m",
  "nh-B777-300ER": "nh-77w-1",

  // Jeju Air (7c)
  "7c-B737-800": "7c-738-1",
  "7c-737-800": "7c-738-1",
  "7c-B737-8": "7c-7m8",
  "7c-737-8": "7c-7m8",
  "7c-B737-MAX8": "7c-7m8",

  // Jin Air (lj)
  "lj-B737-800": "lj-738",
  "lj-738": "lj-738",
  "lj-B737-900": "lj-739",
  "lj-B777-200ER": "lj-772",
  "lj-B737-8": "lj-7m8",
  "lj-737-8": "lj-7m8",

  // T'way Air (tw)
  "tw-A330-300": "tw-333",
  "tw-A330-200": "tw-332-1",
  "tw-B737-800": "tw-738",
  "tw-737-800": "tw-738",
  "tw-B737-8": "tw-7m8",
  "tw-737-8": "tw-7m8",
  "tw-B777-300ER": "tw-77w-1",

  // Air Premia (yp)
  "yp-B787-9": "yp-789-1",
  "yp-787-9": "yp-789-1",

  // ZIPAIR (zg)
  "zg-B787-8": "zg-788",
  "zg-787-8": "zg-788",

  // Peach (mm)
  "mm-A320-200": "mm-320",
  "mm-A320": "mm-320",
  "mm-A320neo": "mm-32n",
  "mm-A321neo": "mm-32q-1",

  // Air Busan (bx)
  "bx-A320": "bx-320",
  "bx-A320-200": "bx-320",
  "bx-320": "bx-320",
  "bx-A321": "bx-321-1",
  "bx-A321-200": "bx-321-1",
  "bx-321-200": "bx-321-1",
  "bx-321": "bx-321-1",
  "bx-A321neo": "bx-32q-1",
  "bx-A321-200neo": "bx-32q-1",
  "bx-32q": "bx-32q-1",

  // Air Seoul (rs)
  "rs-A321": "rs-321-1",
  "rs-A321-200": "rs-321-1",
  "rs-321-200": "rs-321-1",
  "rs-321": "rs-321-1",
};

export function getAeroLopaUrl(airline: string, aircraftModel: string): string {
  const cleanAirline = airline.trim();
  const cleanModel = aircraftModel.trim();

  let airlineCode = "";
  for (const [key, code] of Object.entries(AIRLINE_AEROLOPA_CODE_MAP)) {
    if (cleanAirline.includes(key)) {
      airlineCode = code;
      break;
    }
  }

  if (!airlineCode) {
    return `${AEROLOPA_BASE_URL}`;
  }

  // 1. Direct exact crawled path lookup
  const exactKey = `${airlineCode}-${cleanModel}`;
  if (EXACT_AEROLOPA_PATH_MAP[exactKey]) {
    return `${AEROLOPA_BASE_URL}/${EXACT_AEROLOPA_PATH_MAP[exactKey]}`;
  }

  // 2. Generic model slug fallback
  const modelSlug = AIRCRAFT_AEROLOPA_SLUG_MAP[cleanModel];
  if (modelSlug) {
    return `${AEROLOPA_BASE_URL}/${airlineCode}-${modelSlug}`;
  }

  // 3. Airline fleet overview fallback
  return `${AEROLOPA_BASE_URL}/${airlineCode}`;
}

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
  28: { hasDirectFlight: true, airports: [{ code: "UKB", name: "고베 공항 (효고)" }, { code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }] },
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

// Comprehensive Direct Round-Trip Flight Schedules Database (Korea ↔ Japan)
const FLIGHT_DATABASE: FlightSchedule[] = [
  // ----------------------------------------------------
  // 1. Fukuoka (FUK) - 후쿠오카
  // ----------------------------------------------------
  // Outbound (Korea -> Fukuoka)
  // 1. Fukuoka (FUK) - 후쿠오카
  // ----------------------------------------------------
  // Outbound (Korea -> Fukuoka)
  { airline: "대한항공", flightNo: "KE787", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "07:55", arrivalTime: "09:20", days: "매일", aircraft: "B787-9 / B787-10 / A330-300", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE789", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "13:05", arrivalTime: "14:30", days: "매일", aircraft: "A330-300 / B787-9", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE781", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "16:40", arrivalTime: "18:05", days: "매일", aircraft: "B787-10 / A330-300", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE793", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "18:40", arrivalTime: "20:05", days: "매일", aircraft: "A321neo", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ132", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "08:40", arrivalTime: "10:00", days: "매일", aircraft: "A330-300 / A321neo", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ134", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "16:20", arrivalTime: "17:40", days: "매일", aircraft: "A330-300", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ136", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "18:10", arrivalTime: "19:30", days: "매일", aircraft: "A321neo / A321-200", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1402", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "06:15", arrivalTime: "07:35", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1404", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "14:10", arrivalTime: "15:35", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1406", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "19:00", arrivalTime: "20:25", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ265", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "07:25", arrivalTime: "08:45", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ267", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "15:10", arrivalTime: "16:30", days: "매일", aircraft: "B737-800 / B777-200ER", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW293", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "10:05", arrivalTime: "11:30", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW295", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "15:05", arrivalTime: "16:30", days: "매일", aircraft: "A330-300 / B737-800", direction: "OUTBOUND" },
  // -- Busan (PUS) -> Fukuoka (FUK) Official Timetable --
  { airline: "에어부산", flightNo: "BX148", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "07:30", arrivalTime: "08:30", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX142", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "10:00", arrivalTime: "10:55", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX146", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "14:00", arrivalTime: "15:00", days: "매일", aircraft: "A321-200 / A321neo", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX144", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "17:55", arrivalTime: "18:55", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ291", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "15:55", arrivalTime: "16:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1451", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "07:00", arrivalTime: "07:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1453", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "13:20", arrivalTime: "14:20", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1455", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "14:55", arrivalTime: "15:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1457", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "18:15", arrivalTime: "19:15", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE941", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "09:40", arrivalTime: "10:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE943", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "16:00", arrivalTime: "17:05", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW231", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "09:00", arrivalTime: "10:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW235", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "18:00", arrivalTime: "19:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },

  { airline: "이스타항공", flightNo: "ZE605", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "08:35", arrivalTime: "10:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE607", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "14:50", arrivalTime: "16:15", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "에어서울", flightNo: "RS731", depAirport: "인천", depAirportCode: "ICN", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "09:10", arrivalTime: "10:35", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  // -- Cheongju (CJJ) -> Fukuoka (FUK) --
  { airline: "에어로케이", flightNo: "RF332", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "06:35", arrivalTime: "07:45", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW225", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "후쿠오카", arrAirportCode: "FUK", departureTime: "17:05", arrivalTime: "18:20", days: "주 5회", aircraft: "B737-800", direction: "OUTBOUND" },

  // Inbound (Fukuoka -> Korea Return)
  { airline: "대한항공", flightNo: "KE788", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:30", arrivalTime: "11:55", days: "매일", aircraft: "B787-9 / B787-10 / A330-300", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE790", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:40", arrivalTime: "17:10", days: "매일", aircraft: "A330-300 / B787-9", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE782", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:15", arrivalTime: "20:45", days: "매일", aircraft: "B787-10 / A330-300", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE794", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "21:05", arrivalTime: "22:35", days: "매일", aircraft: "A321neo", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ131", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:00", arrivalTime: "12:20", days: "매일", aircraft: "A330-300 / A321neo", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ133", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:40", arrivalTime: "20:00", days: "매일", aircraft: "A330-300", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ135", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "20:30", arrivalTime: "21:50", days: "매일", aircraft: "A321neo / A321-200", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1401", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "08:35", arrivalTime: "10:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1403", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "16:35", arrivalTime: "18:05", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1405", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "21:25", arrivalTime: "22:50", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ266", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "09:45", arrivalTime: "11:15", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ268", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "17:30", arrivalTime: "19:00", days: "매일", aircraft: "B737-800 / B777-200ER", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW294", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:30", arrivalTime: "13:55", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW296", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "17:30", arrivalTime: "18:55", days: "매일", aircraft: "A330-300 / B737-800", direction: "INBOUND" },

  // -- Fukuoka (FUK) -> Busan (PUS) Official Timetable --
  { airline: "에어부산", flightNo: "BX147", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "09:25", arrivalTime: "10:25", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX141", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "11:55", arrivalTime: "13:00", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX145", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "16:00", arrivalTime: "17:05", days: "매일", aircraft: "A321-200 / A321neo", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX143", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "19:55", arrivalTime: "21:00", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ292", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "19:05", arrivalTime: "20:05", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1452", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "08:55", arrivalTime: "10:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1454", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "15:10", arrivalTime: "16:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1456", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "17:00", arrivalTime: "18:05", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1458", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "20:15", arrivalTime: "21:15", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE942", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "12:00", arrivalTime: "13:10", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE944", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "18:05", arrivalTime: "19:00", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW232", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "11:00", arrivalTime: "11:55", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW236", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "20:00", arrivalTime: "21:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE606", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:00", arrivalTime: "12:25", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE608", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "17:15", arrivalTime: "18:40", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "에어서울", flightNo: "RS732", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:35", arrivalTime: "13:00", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  // -- Fukuoka (FUK) -> Cheongju (CJJ) --
  { airline: "에어로케이", flightNo: "RF331", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "청주", arrAirportCode: "CJJ", departureTime: "08:30", arrivalTime: "10:00", days: "매일", aircraft: "A320-200", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW226", depAirport: "후쿠오카", depAirportCode: "FUK", arrAirport: "청주", arrAirportCode: "CJJ", departureTime: "19:20", arrivalTime: "20:40", days: "주 6회", aircraft: "B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 2. Kobe / Hyogo (UKB) - 고베
  // ----------------------------------------------------
  // Outbound (Korea -> Kobe)
  { airline: "대한항공", flightNo: "KE2171", depAirport: "인천", depAirportCode: "ICN", arrAirport: "고베", arrAirportCode: "UKB", departureTime: "09:05", arrivalTime: "10:55", days: "매일", aircraft: "A321neo / B737-8", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE2173", depAirport: "인천", depAirportCode: "ICN", arrAirport: "고베", arrAirportCode: "UKB", departureTime: "15:50", arrivalTime: "17:45", days: "매일", aircraft: "A321neo", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ381", depAirport: "인천", depAirportCode: "ICN", arrAirport: "고베", arrAirportCode: "UKB", departureTime: "13:35", arrivalTime: "15:30", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1621", depAirport: "인천", depAirportCode: "ICN", arrAirport: "고베", arrAirportCode: "UKB", departureTime: "13:35", arrivalTime: "15:15", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX128", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "고베", arrAirportCode: "UKB", departureTime: "11:20", arrivalTime: "12:45", days: "목,일", aircraft: "A321-200", direction: "OUTBOUND" },

  // Inbound (Kobe -> Korea Return)
  { airline: "대한항공", flightNo: "KE2172", depAirport: "고베", depAirportCode: "UKB", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:55", arrivalTime: "13:45", days: "매일", aircraft: "A321neo / B737-8", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE2174", depAirport: "고베", depAirportCode: "UKB", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:55", arrivalTime: "20:50", days: "매일", aircraft: "A321neo", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ382", depAirport: "고베", depAirportCode: "UKB", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "16:30", arrivalTime: "18:30", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1622", depAirport: "고베", depAirportCode: "UKB", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "16:25", arrivalTime: "18:15", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX127", depAirport: "고베", depAirportCode: "UKB", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "13:45", arrivalTime: "15:10", days: "목,일", aircraft: "A321-200", direction: "INBOUND" },

  // ----------------------------------------------------
  // 3. Kitakyushu (KKJ) - 기타큐슈
  // ----------------------------------------------------
  { airline: "진에어", flightNo: "LJ269", depAirport: "인천", depAirportCode: "ICN", arrAirport: "기타큐슈", arrAirportCode: "KKJ", departureTime: "07:05", arrivalTime: "08:30", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ271", depAirport: "인천", depAirportCode: "ICN", arrAirport: "기타큐슈", arrAirportCode: "KKJ", departureTime: "17:15", arrivalTime: "18:40", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "에어로케이", flightNo: "RF372", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "기타큐슈", arrAirportCode: "KKJ", departureTime: "13:20", arrivalTime: "14:30", days: "화,목,토", aircraft: "A320-200", direction: "OUTBOUND" },
  // Return
  { airline: "진에어", flightNo: "LJ270", depAirport: "기타큐슈", depAirportCode: "KKJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "09:30", arrivalTime: "11:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ272", depAirport: "기타큐슈", depAirportCode: "KKJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:40", arrivalTime: "21:10", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "에어로케이", flightNo: "RF371", depAirport: "기타큐슈", depAirportCode: "KKJ", arrAirport: "청주", arrAirportCode: "CJJ", departureTime: "15:30", arrivalTime: "16:45", days: "화,목,토", aircraft: "A320-200", direction: "INBOUND" },

  // ----------------------------------------------------
  // 4. Kansai / Osaka (KIX) - 오사카 간사이
  // ----------------------------------------------------
  // Outbound (Korea -> Kansai/Osaka)
  // -- Gimpo (GMP) -> Kansai/Osaka (KIX) Official Timetable --
  { airline: "대한항공", flightNo: "KE2117", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "09:00", arrivalTime: "10:45", days: "매일", aircraft: "A330-300 / B787-10", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE2119", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "16:30", arrivalTime: "18:25", days: "매일", aircraft: "A330-300 / B787-10", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1145", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:10", arrivalTime: "09:50", days: "매일", aircraft: "A330-300 / A321neo", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1165", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "17:40", arrivalTime: "19:20", days: "매일", aircraft: "A330-300 / A321neo", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1325", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:20", arrivalTime: "10:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1327", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "14:00", arrivalTime: "15:40", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "피치항공", flightNo: "MM736", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "11:25", arrivalTime: "13:05", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "피치항공", flightNo: "MM732", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "13:05", arrivalTime: "14:50", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "피치항공", flightNo: "MM740", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "17:00", arrivalTime: "18:40", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "피치항공", flightNo: "MM734", depAirport: "김포", depAirportCode: "GMP", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "18:45", arrivalTime: "20:30", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },

  // -- Incheon (ICN) -> Kansai/Osaka (KIX) Official Timetable --
  { airline: "대한항공", flightNo: "KE723", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:50", arrivalTime: "10:35", days: "매일", aircraft: "A330-300 / B787-10", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE727", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "11:05", arrivalTime: "12:50", days: "매일", aircraft: "B787-10", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE725", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "15:20", arrivalTime: "17:10", days: "매일", aircraft: "A330-300 / B737-8", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE721", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "19:00", arrivalTime: "21:00", days: "매일", aircraft: "B737-8 / A321neo", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE737", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "20:50", arrivalTime: "22:40", days: "매일", aircraft: "A321neo", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ112", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:05", arrivalTime: "09:40", days: "매일", aircraft: "B777-200ER / A350-900", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ114", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "14:10", arrivalTime: "15:50", days: "매일", aircraft: "A330-300", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ118", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "16:00", arrivalTime: "17:45", days: "매일", aircraft: "A321neo", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ116", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "19:10", arrivalTime: "20:55", days: "매일", aircraft: "A321-200 / A321neo", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1301", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:00", arrivalTime: "09:00", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1391", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:05", arrivalTime: "09:40", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1303", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "09:10", arrivalTime: "11:00", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1315", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "10:15", arrivalTime: "12:05", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1393", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "14:10", arrivalTime: "15:50", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1305", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "16:55", arrivalTime: "18:40", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1395", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "19:10", arrivalTime: "20:55", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW301", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:55", arrivalTime: "09:55", days: "매일", aircraft: "A330-300", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW303", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "12:10", arrivalTime: "14:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW305", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "15:55", arrivalTime: "17:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ231", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:00", arrivalTime: "09:45", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ233", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:55", arrivalTime: "10:50", days: "매일", aircraft: "B737-800 / B777-200ER", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ961", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "09:35", arrivalTime: "11:10", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ237", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "14:10", arrivalTime: "15:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ235", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "15:00", arrivalTime: "16:40", days: "매일", aircraft: "B777-200ER", direction: "OUTBOUND" },
  { airline: "에어서울", flightNo: "RS711", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:15", arrivalTime: "09:05", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "에어서울", flightNo: "RS713", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "13:10", arrivalTime: "15:00", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "에어서울", flightNo: "RS715", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "15:20", arrivalTime: "17:00", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX174", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "12:40", arrivalTime: "14:40", days: "매일", aircraft: "A321-200 / A321neo", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE611", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "09:05", arrivalTime: "10:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE615", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "09:55", arrivalTime: "11:55", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE613", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "15:05", arrivalTime: "17:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "파라타항공", flightNo: "WE511", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "11:10", arrivalTime: "13:00", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "피치항공", flightNo: "MM712", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:30", arrivalTime: "09:15", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "피치항공", flightNo: "MM702", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "10:35", arrivalTime: "12:20", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "피치항공", flightNo: "MM706", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "15:20", arrivalTime: "17:05", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "피치항공", flightNo: "MM710", depAirport: "인천", depAirportCode: "ICN", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "21:00", arrivalTime: "22:45", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },

  // -- Busan (PUS) -> Kansai/Osaka (KIX) Official Timetable --
  { airline: "에어부산", flightNo: "BX124", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:30", arrivalTime: "10:05", days: "매일", aircraft: "A321neo / A321-200 / A321LR", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX126", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "11:25", arrivalTime: "12:55", days: "매일", aircraft: "A321neo / A321-200 / A321LR", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX122", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "16:30", arrivalTime: "17:55", days: "매일", aircraft: "A321neo / A321-200 / A321LR", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ255", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:45", arrivalTime: "09:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ251", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "13:35", arrivalTime: "15:05", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ253", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "15:05", arrivalTime: "16:35", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ257", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "15:50", arrivalTime: "17:20", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1351", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "08:30", arrivalTime: "09:50", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1371", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "17:30", arrivalTime: "19:00", days: "주 3회", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1353", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "17:00", arrivalTime: "18:10", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW319", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "09:25", arrivalTime: "10:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW321", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "14:05", arrivalTime: "15:35", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE913", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "07:55", arrivalTime: "09:40", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE915", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "14:20", arrivalTime: "15:50", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },

  // -- Cheongju (CJJ) -> Kansai/Osaka (KIX) --
  { airline: "티웨이항공", flightNo: "TW523", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "간사이(오사카)", arrAirportCode: "KIX", departureTime: "10:00", arrivalTime: "11:30", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },

  // Inbound (Kansai/Osaka -> Korea)
  // -- Kansai/Osaka (KIX) -> Gimpo (GMP) Official Timetable --
  { airline: "대한항공", flightNo: "KE2118", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "11:55", arrivalTime: "13:55", days: "매일", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE2120", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "19:35", arrivalTime: "21:35", days: "매일", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1135", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "11:10", arrivalTime: "13:10", days: "매일", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1155", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "20:40", arrivalTime: "22:25", days: "매일", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1326", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "11:00", arrivalTime: "13:00", days: "매일", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1328", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "16:30", arrivalTime: "18:30", days: "매일", direction: "INBOUND" },
  { airline: "피치항공", flightNo: "MM733", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "08:30", arrivalTime: "10:30", days: "매일", direction: "INBOUND" },
  { airline: "피치항공", flightNo: "MM731", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "10:25", arrivalTime: "12:20", days: "매일", direction: "INBOUND" },
  { airline: "피치항공", flightNo: "MM739", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "14:10", arrivalTime: "16:10", days: "매일", direction: "INBOUND" },
  { airline: "피치항공", flightNo: "MM733", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "16:00", arrivalTime: "17:55", days: "매일", direction: "INBOUND" },

  // -- Kansai/Osaka (KIX) -> Incheon (ICN) Official Timetable --
  { airline: "대한항공", flightNo: "KE738", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "02:15", arrivalTime: "04:05", days: "매일", aircraft: "A321neo", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE722", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "09:15", arrivalTime: "11:10", days: "매일", aircraft: "A330-300", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE724", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:55", arrivalTime: "14:00", days: "매일", aircraft: "A330-300 / B787-10", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE728", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:00", arrivalTime: "15:55", days: "매일", aircraft: "B787-9 / A321neo", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE726", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:25", arrivalTime: "20:30", days: "매일", aircraft: "A330-300 / B787-10", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ111", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:50", arrivalTime: "12:50", days: "매일", aircraft: "B777-200ER / A350-900", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ113", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "17:00", arrivalTime: "19:05", days: "매일", aircraft: "A330-300", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ117", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:05", arrivalTime: "21:10", days: "매일", aircraft: "A321neo", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ115", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "09:00", arrivalTime: "11:00", days: "매일", aircraft: "A321-200 / A321neo", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1396", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "09:00", arrivalTime: "11:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1302", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "09:50", arrivalTime: "11:50", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1392", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:50", arrivalTime: "12:50", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1304", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:50", arrivalTime: "13:50", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1316", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "13:05", arrivalTime: "15:15", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1394", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "17:00", arrivalTime: "19:05", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1306", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:40", arrivalTime: "21:40", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW302", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:55", arrivalTime: "13:15", days: "매일", aircraft: "A330-300", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW304", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:30", arrivalTime: "17:35", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW306", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:15", arrivalTime: "21:10", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ232", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:05", arrivalTime: "13:10", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ234", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:00", arrivalTime: "14:00", days: "매일", aircraft: "B737-800 / B777-200ER", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ962", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:10", arrivalTime: "14:15", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ238", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "16:55", arrivalTime: "19:10", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ236", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:00", arrivalTime: "19:55", days: "매일", aircraft: "B777-200ER", direction: "INBOUND" },
  { airline: "에어서울", flightNo: "RS712", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:00", arrivalTime: "11:55", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "에어서울", flightNo: "RS714", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "16:00", arrivalTime: "17:55", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "에어서울", flightNo: "RS716", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:00", arrivalTime: "20:05", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX173", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:40", arrivalTime: "18:10", days: "매일", aircraft: "A321-200 / A321neo", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE612", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:50", arrivalTime: "13:50", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE616", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:55", arrivalTime: "15:05", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE614", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:00", arrivalTime: "19:50", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "파라타항공", flightNo: "WE512", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:30", arrivalTime: "16:40", days: "매일", aircraft: "A320-200", direction: "INBOUND" },
  { airline: "피치항공", flightNo: "MM701", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "07:40", arrivalTime: "09:45", days: "매일", aircraft: "A320-200", direction: "INBOUND" },
  { airline: "피치항공", flightNo: "MM705", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:30", arrivalTime: "14:35", days: "매일", aircraft: "A320-200", direction: "INBOUND" },
  { airline: "피치항공", flightNo: "MM709", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:10", arrivalTime: "20:15", days: "매일", aircraft: "A320-200", direction: "INBOUND" },
  { airline: "피치항공", flightNo: "MM711", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:55", arrivalTime: "21:55", days: "매일", aircraft: "A320-200", direction: "INBOUND" },

  // -- Kansai/Osaka (KIX) -> Busan (PUS) Official Timetable --
  { airline: "에어부산", flightNo: "BX123", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "11:00", arrivalTime: "13:00", days: "매일", aircraft: "A321neo / A321-200 / A321LR", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX125", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "14:00", arrivalTime: "15:40", days: "매일", aircraft: "A321neo / A321-200 / A321LR", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX121", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "18:50", arrivalTime: "20:30", days: "매일", aircraft: "A321neo / A321-200 / A321LR", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ252", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "10:35", arrivalTime: "12:05", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ256", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "10:55", arrivalTime: "12:25", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ254", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "17:35", arrivalTime: "18:55", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ258", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "18:20", arrivalTime: "19:50", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1352", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "10:40", arrivalTime: "12:10", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1372", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "20:00", arrivalTime: "21:35", days: "주 3회", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1354", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "19:00", arrivalTime: "20:30", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW322", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "16:35", arrivalTime: "18:10", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW320", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "18:40", arrivalTime: "20:15", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE914", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "10:50", arrivalTime: "12:20", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE916", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "17:00", arrivalTime: "18:30", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },

  // -- Kansai/Osaka (KIX) -> Cheongju (CJJ) --
  { airline: "티웨이항공", flightNo: "TW524", depAirport: "간사이(오사카)", depAirportCode: "KIX", arrAirport: "청주", arrAirportCode: "CJJ", departureTime: "12:30", arrivalTime: "14:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 5. Tokyo Haneda / Narita (HND / NRT) - 도쿄
  // ----------------------------------------------------
  // Outbound (Korea -> Tokyo)
  // -- Gimpo (GMP) -> Haneda (HND) Official Timetable --
  { airline: "대한항공", flightNo: "KE2101", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "09:00", arrivalTime: "11:20", days: "매일", aircraft: "B787-10 / A330-300", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE2103", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "16:10", arrivalTime: "18:30", days: "매일", aircraft: "B787-10 / A330-300", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE2105", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "18:40", arrivalTime: "21:00", days: "매일", aircraft: "B787-10 / A330-300", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1085", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "08:40", arrivalTime: "10:45", days: "매일", aircraft: "A330-300 / A321-200", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1045", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "15:45", arrivalTime: "17:50", days: "매일", aircraft: "A330-300 / A321-200", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1065", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "19:50", arrivalTime: "22:00", days: "매일", aircraft: "A330-300 / A321-200", direction: "OUTBOUND" },
  { airline: "일본항공", flightNo: "JL90", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "07:55", arrivalTime: "10:00", days: "매일", aircraft: "B787-8 / B787-9", direction: "OUTBOUND" },
  { airline: "일본항공", flightNo: "JL92", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "12:05", arrivalTime: "14:15", days: "매일", aircraft: "B787-8 / B787-9", direction: "OUTBOUND" },
  { airline: "일본항공", flightNo: "JL94", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "19:20", arrivalTime: "21:30", days: "매일", aircraft: "B787-8 / B787-9", direction: "OUTBOUND" },
  { airline: "전일본공수(ANA)", flightNo: "NH862", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "07:40", arrivalTime: "09:50", days: "매일", aircraft: "B787-8 / B767-300ER", direction: "OUTBOUND" },
  { airline: "전일본공수(ANA)", flightNo: "NH864", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "12:40", arrivalTime: "14:55", days: "매일", aircraft: "B787-8 / B767-300ER", direction: "OUTBOUND" },
  { airline: "전일본공수(ANA)", flightNo: "NH868", depAirport: "김포", depAirportCode: "GMP", arrAirport: "도쿄 하네다", arrAirportCode: "HND", departureTime: "19:55", arrivalTime: "22:15", days: "매일", aircraft: "B787-8 / B767-300ER", direction: "OUTBOUND" },

  // -- Incheon (ICN) -> Narita (NRT) Official Timetable --
  { airline: "대한항공", flightNo: "KE703", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "10:10", arrivalTime: "12:40", days: "매일", aircraft: "A380-800 / B787-10 / A330-300 / B777-300ER / B777-300 / B747-8", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE711", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "13:00", arrivalTime: "15:25", days: "매일", aircraft: "A321neo", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE713", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "17:05", arrivalTime: "19:35", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE705", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "18:35", arrivalTime: "21:05", days: "매일", aircraft: "A321neo", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ102", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "09:00", arrivalTime: "11:20", days: "매일", aircraft: "B777-200ER / A380-800 / A350-900 / A330-300", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ106", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "15:35", arrivalTime: "17:55", days: "매일", aircraft: "A330-300 / B777-200ER / A350-900", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ108", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "18:40", arrivalTime: "21:00", days: "매일", aircraft: "A330-300 / A321neo / A321-200", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1101", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:10", arrivalTime: "10:35", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1103", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "10:35", arrivalTime: "13:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1105", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "11:50", arrivalTime: "14:20", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1107", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "14:50", arrivalTime: "17:15", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1121", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "16:20", arrivalTime: "18:40", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW241", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:35", arrivalTime: "10:55", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW243", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "10:20", arrivalTime: "12:50", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW239", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "12:25", arrivalTime: "15:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW245", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "15:30", arrivalTime: "17:55", days: "매일", aircraft: "A330-300", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ201", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "07:25", arrivalTime: "09:50", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ203", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:15", arrivalTime: "10:35", days: "매일", aircraft: "B777-200ER / B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ205", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "09:45", arrivalTime: "12:15", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ209", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "14:45", arrivalTime: "17:10", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ211", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "15:35", arrivalTime: "18:05", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX164", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "07:35", arrivalTime: "10:10", days: "매일", aircraft: "A321-200 / A321neo", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX166", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "15:05", arrivalTime: "17:50", days: "매일", aircraft: "A321-200 / A321neo", direction: "OUTBOUND" },
  { airline: "에어서울", flightNo: "RS705", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:10", arrivalTime: "10:25", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "에어서울", flightNo: "RS701", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "13:20", arrivalTime: "15:40", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "에어서울", flightNo: "RS703", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "18:55", arrivalTime: "21:25", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE601", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:40", arrivalTime: "11:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE603", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "15:20", arrivalTime: "18:00", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "에어프레미아", flightNo: "YP731", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:45", arrivalTime: "11:20", days: "매일", aircraft: "B787-9", direction: "OUTBOUND" },
  { airline: "에어프레미아", flightNo: "YP733", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "12:15", arrivalTime: "14:45", days: "매일", aircraft: "B787-9", direction: "OUTBOUND" },
  { airline: "파라타항공", flightNo: "WE501", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "09:40", arrivalTime: "12:05", days: "매일", aircraft: "A330-200", direction: "OUTBOUND" },
  { airline: "파라타항공", flightNo: "WE503", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "11:30", arrivalTime: "13:50", days: "매일", aircraft: "A330-200", direction: "OUTBOUND" },
  { airline: "에티오피아항공", flightNo: "ET672", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "16:35", arrivalTime: "19:05", days: "매일", aircraft: "B787-8", direction: "OUTBOUND" },
  { airline: "집에어(ZIPAIR)", flightNo: "ZG42", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "13:05", arrivalTime: "15:30", days: "매일", aircraft: "B787-8", direction: "OUTBOUND" },
  { airline: "피치항공", flightNo: "MM652", depAirport: "인천", depAirportCode: "ICN", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "13:35", arrivalTime: "16:15", days: "매일", aircraft: "A320", direction: "OUTBOUND" },

  // -- Busan (PUS) / Cheongju (CJJ) -> Narita (NRT) --
  { airline: "에어부산", flightNo: "BX111", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "08:05", arrivalTime: "10:10", days: "매일", aircraft: "A321-200 / A321neo", direction: "OUTBOUND" },
  { airline: "에어로케이", flightNo: "RF392", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "07:25", arrivalTime: "09:40", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "에어로케이", flightNo: "RF322", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "09:30", arrivalTime: "11:50", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },
  { airline: "에어로케이", flightNo: "RF324", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "도쿄 나리타", arrAirportCode: "NRT", departureTime: "16:15", arrivalTime: "18:45", days: "매일", aircraft: "A320-200", direction: "OUTBOUND" },

  // Inbound (Tokyo -> Korea)
  // -- Haneda (HND) -> Gimpo (GMP) Official Timetable --
  { airline: "대한항공", flightNo: "KE2106", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "09:20", arrivalTime: "11:45", days: "매일", aircraft: "B787-10 / A330-300", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE2102", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "12:30", arrivalTime: "14:50", days: "매일", aircraft: "B787-10 / A330-300", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE2104", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "19:45", arrivalTime: "22:05", days: "매일", aircraft: "B787-10 / A330-300", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1055", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "09:00", arrivalTime: "11:20", days: "매일", aircraft: "A330-300 / A321-200", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1075", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "12:05", arrivalTime: "14:25", days: "매일", aircraft: "A330-300 / A321-200", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ1035", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "20:05", arrivalTime: "22:25", days: "매일", aircraft: "A330-300 / A321-200", direction: "INBOUND" },
  { airline: "일본항공", flightNo: "JL91", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "08:25", arrivalTime: "10:45", days: "매일", aircraft: "B787-8 / B787-9", direction: "INBOUND" },
  { airline: "일본항공", flightNo: "JL93", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "15:40", arrivalTime: "18:00", days: "매일", aircraft: "B787-8 / B787-9", direction: "INBOUND" },
  { airline: "일본항공", flightNo: "JL95", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "19:30", arrivalTime: "21:50", days: "매일", aircraft: "B787-8 / B787-9", direction: "INBOUND" },
  { airline: "전일본공수(ANA)", flightNo: "NH861", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "08:40", arrivalTime: "11:05", days: "매일", aircraft: "B787-8 / B767-300ER", direction: "INBOUND" },
  { airline: "전일본공수(ANA)", flightNo: "NH865", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "16:10", arrivalTime: "18:35", days: "매일", aircraft: "B787-8 / B767-300ER", direction: "INBOUND" },
  { airline: "전일본공수(ANA)", flightNo: "NH867", depAirport: "도쿄 하네다", depAirportCode: "HND", arrAirport: "김포", arrAirportCode: "GMP", departureTime: "20:05", arrivalTime: "22:20", days: "매일", aircraft: "B787-8 / B767-300ER", direction: "INBOUND" },

  // -- Narita (NRT) -> Incheon (ICN) Official Timetable --
  { airline: "대한항공", flightNo: "KE704", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:00", arrivalTime: "16:40", days: "매일", aircraft: "A380-800 / B787-10 / A330-300 / B777-300ER / B777-300 / B747-8", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE712", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "17:10", arrivalTime: "19:50", days: "매일", aircraft: "A321neo", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE714", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "20:40", arrivalTime: "23:20", days: "매일", aircraft: "B737-8", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE706", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "09:15", arrivalTime: "12:00", days: "매일", aircraft: "A321neo", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ101", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "13:20", arrivalTime: "15:55", days: "매일", aircraft: "B777-200ER / A350-900 / A330-300", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ105", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:25", arrivalTime: "22:20", days: "매일", aircraft: "A330-300 / B777-200ER / A350-900", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ107", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "09:00", arrivalTime: "11:35", days: "매일", aircraft: "A330-300 / A321neo / A321-200", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1102", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:35", arrivalTime: "14:30", days: "매일", aircraft: "B737-8", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1104", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:00", arrivalTime: "16:45", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1106", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:20", arrivalTime: "18:25", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1108", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:10", arrivalTime: "21:05", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1122", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:50", arrivalTime: "22:50", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW212", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:55", arrivalTime: "14:55", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW214", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:35", arrivalTime: "18:05", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW216", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:55", arrivalTime: "21:50", days: "매일", aircraft: "A330-300", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ202", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:10", arrivalTime: "13:35", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ204", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:35", arrivalTime: "14:05", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ206", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "13:25", arrivalTime: "15:55", days: "매일", aircraft: "B737-8", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ210", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:20", arrivalTime: "20:50", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ212", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:05", arrivalTime: "21:35", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX163", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:10", arrivalTime: "14:00", days: "매일", aircraft: "A321-200 / A321neo", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX165", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:50", arrivalTime: "22:05", days: "매일", aircraft: "A321-200 / A321neo", direction: "INBOUND" },
  { airline: "에어서울", flightNo: "RS706", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:25", arrivalTime: "14:05", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "에어서울", flightNo: "RS702", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "16:40", arrivalTime: "19:25", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "에어서울", flightNo: "RS704", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "22:15", arrivalTime: "23:59", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE602", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:50", arrivalTime: "14:30", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE604", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:00", arrivalTime: "21:35", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "에어프레미아", flightNo: "YP732", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:30", arrivalTime: "15:15", days: "매일", aircraft: "B787-9", direction: "INBOUND" },
  { airline: "에어프레미아", flightNo: "YP734", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:55", arrivalTime: "18:50", days: "매일", aircraft: "B787-9", direction: "INBOUND" },
  { airline: "파라타항공", flightNo: "WE502", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "13:35", arrivalTime: "16:15", days: "매일", aircraft: "A330-200", direction: "INBOUND" },
  { airline: "파라타항공", flightNo: "WE504", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:20", arrivalTime: "18:35", days: "매일", aircraft: "A330-200", direction: "INBOUND" },
  { airline: "에티오피아항공", flightNo: "ET673", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "20:05", arrivalTime: "22:45", days: "매일", aircraft: "B787-8", direction: "INBOUND" },
  { airline: "집에어(ZIPAIR)", flightNo: "ZG41", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "08:55", arrivalTime: "11:35", days: "매일", aircraft: "B787-8", direction: "INBOUND" },
  { airline: "피치항공", flightNo: "MM651", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "09:30", arrivalTime: "12:25", days: "매일", aircraft: "A320", direction: "INBOUND" },

  // -- Narita (NRT) -> Busan (PUS) / Cheongju (CJJ) --
  { airline: "에어부산", flightNo: "BX112", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "11:10", arrivalTime: "13:30", days: "매일", aircraft: "A321-200 / A321neo", direction: "INBOUND" },
  { airline: "에어로케이", flightNo: "RF391", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "청주", arrAirportCode: "CJJ", departureTime: "10:40", arrivalTime: "13:05", days: "매일", aircraft: "A320-200", direction: "INBOUND" },
  { airline: "에어로케이", flightNo: "RF321", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "청주", arrAirportCode: "CJJ", departureTime: "13:05", arrivalTime: "15:30", days: "매일", aircraft: "A320-200", direction: "INBOUND" },
  { airline: "에어로케이", flightNo: "RF323", depAirport: "도쿄 나리타", depAirportCode: "NRT", arrAirport: "청주", arrAirportCode: "CJJ", departureTime: "19:35", arrivalTime: "21:55", days: "매일", aircraft: "A320-200", direction: "INBOUND" },

  // ----------------------------------------------------
  // 6. Sapporo Chitose (CTS) - 삿포로
  // ----------------------------------------------------
  // Outbound (Korea -> Sapporo)
  { airline: "대한항공", flightNo: "KE765", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "10:05", arrivalTime: "12:50", days: "매일", aircraft: "B777-300", direction: "OUTBOUND" },
  { airline: "대한항공", flightNo: "KE769", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "12:55", arrivalTime: "15:40", days: "매일", aircraft: "A330-300 / A321neo / B737-900ER", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ174", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "09:10", arrivalTime: "11:40", days: "매일", aircraft: "A330-300 / A321-200 / A321neo", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1501", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "07:20", arrivalTime: "10:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1503", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "12:05", arrivalTime: "15:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW263", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "10:10", arrivalTime: "13:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW265", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "10:20", arrivalTime: "13:10", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ301", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "08:20", arrivalTime: "11:00", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX188", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "12:35", arrivalTime: "15:30", days: "매일", aircraft: "A321-200 / A321neo", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE621", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "07:40", arrivalTime: "10:20", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE623", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "14:10", arrivalTime: "17:00", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },
  { airline: "파라타항공", flightNo: "WE531", depAirport: "인천", depAirportCode: "ICN", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "11:10", arrivalTime: "13:45", days: "매일", aircraft: "A330-200", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX182", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "삿포로", arrAirportCode: "CTS", departureTime: "09:05", arrivalTime: "11:30", days: "월,목,금,일", direction: "OUTBOUND" },

  // Inbound (Sapporo -> Korea Return)
  { airline: "대한항공", flightNo: "KE766", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:05", arrivalTime: "17:05", days: "매일", aircraft: "B787-10", direction: "INBOUND" },
  { airline: "대한항공", flightNo: "KE770", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "16:50", arrivalTime: "20:05", days: "매일", aircraft: "A330-300 / A321neo / B737-900ER", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ173", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "13:00", arrivalTime: "16:00", days: "매일", aircraft: "A330-300 / A321-200 / A321neo", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1502", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:00", arrivalTime: "14:25", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1504", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:55", arrivalTime: "19:10", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW264", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:30", arrivalTime: "17:40", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW251", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:40", arrivalTime: "18:10", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ302", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:25", arrivalTime: "15:45", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX187", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "16:30", arrivalTime: "20:10", days: "매일", aircraft: "A321-200 / A321neo", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE622", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:20", arrivalTime: "14:35", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE624", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "18:00", arrivalTime: "20:55", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },
  { airline: "파라타항공", flightNo: "WE532", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:05", arrivalTime: "18:10", days: "매일", aircraft: "A330-200", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX181", depAirport: "삿포로", depAirportCode: "CTS", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "12:30", arrivalTime: "15:10", days: "월,목,금,일", direction: "INBOUND" },

  // ----------------------------------------------------
  // 7. Okinawa Naha (OKA) - 오키나와
  // ----------------------------------------------------
  // Outbound (Incheon -> Okinawa)
  { airline: "대한항공", flightNo: "KE755", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "08:05", arrivalTime: "10:35", days: "매일", aircraft: "A321neo / A220-300", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ172", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "08:50", arrivalTime: "11:15", days: "매일", aircraft: "A321-200 / A321neo / A330-300", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1801", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "13:20", arrivalTime: "15:50", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW281", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "11:00", arrivalTime: "13:35", days: "매일", aircraft: "B737-8", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ341", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "09:55", arrivalTime: "12:20", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "이스타항공", flightNo: "ZE631", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오키나와", arrAirportCode: "OKA", departureTime: "11:30", arrivalTime: "14:00", days: "매일", aircraft: "B737-800 / B737-8", direction: "OUTBOUND" },

  // Inbound (Okinawa -> Incheon Return)
  { airline: "대한항공", flightNo: "KE756", depAirport: "오키나와", depAirportCode: "OKA", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:45", arrivalTime: "13:55", days: "매일", aircraft: "A321neo / A220-300", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ171", depAirport: "오키나와", depAirportCode: "OKA", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:15", arrivalTime: "14:35", days: "매일", aircraft: "A321-200 / A321neo / A330-300", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1802", depAirport: "오키나와", depAirportCode: "OKA", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "16:45", arrivalTime: "18:55", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW282", depAirport: "오키나와", depAirportCode: "OKA", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:35", arrivalTime: "16:55", days: "매일", aircraft: "B737-8", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ342", depAirport: "오키나와", depAirportCode: "OKA", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "13:30", arrivalTime: "15:45", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "이스타항공", flightNo: "ZE632", depAirport: "오키나와", depAirportCode: "OKA", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:00", arrivalTime: "17:35", days: "매일", aircraft: "B737-800 / B737-8", direction: "INBOUND" },

  // ----------------------------------------------------
  // 8. Nagoya Chubu (NGO) - 나고야
  // ----------------------------------------------------
  { airline: "대한항공", flightNo: "KE753", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "10:35", arrivalTime: "12:35", days: "매일", aircraft: "A330-300 / B787-10", direction: "OUTBOUND" },
  { airline: "아시아나항공", flightNo: "OZ122", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "08:20", arrivalTime: "10:10", days: "매일", aircraft: "A321neo / A330-300", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ263", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "07:35", arrivalTime: "09:25", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "제주항공", flightNo: "7C1602", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나고야 중부", arrAirportCode: "NGO", departureTime: "11:10", arrivalTime: "13:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  // Return
  { airline: "대한항공", flightNo: "KE754", depAirport: "나고야 중부", depAirportCode: "NGO", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "13:45", arrivalTime: "15:55", days: "매일", aircraft: "A330-300 / B787-10", direction: "INBOUND" },
  { airline: "아시아나항공", flightNo: "OZ121", depAirport: "나고야 중부", depAirportCode: "NGO", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:20", arrivalTime: "13:20", days: "매일", aircraft: "A321neo / A330-300", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ264", depAirport: "나고야 중부", depAirportCode: "NGO", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:35", arrivalTime: "12:35", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "제주항공", flightNo: "7C1601", depAirport: "나고야 중부", depAirportCode: "NGO", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:00", arrivalTime: "16:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 9. Takamatsu (TAK) - 다카마쓰
  // ----------------------------------------------------
  { airline: "에어서울", flightNo: "RS741", depAirport: "인천", depAirportCode: "ICN", arrAirport: "다카마쓰", arrAirportCode: "TAK", departureTime: "08:45", arrivalTime: "10:30", days: "매일", aircraft: "A321-200", direction: "OUTBOUND" },
  { airline: "진에어", flightNo: "LJ291", depAirport: "인천", depAirportCode: "ICN", arrAirport: "다카마쓰", arrAirportCode: "TAK", departureTime: "12:05", arrivalTime: "13:45", days: "화,목,토", aircraft: "B737-800", direction: "OUTBOUND" },
  // Return
  { airline: "에어서울", flightNo: "RS742", depAirport: "다카마쓰", depAirportCode: "TAK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "11:30", arrivalTime: "13:15", days: "매일", aircraft: "A321-200", direction: "INBOUND" },
  { airline: "진에어", flightNo: "LJ292", depAirport: "다카마쓰", depAirportCode: "TAK", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:45", arrivalTime: "16:30", days: "화,목,토", aircraft: "B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 10. Matsuyama (MYJ) - 마츠야마
  // ----------------------------------------------------
  { airline: "제주항공", flightNo: "7C1704", depAirport: "인천", depAirportCode: "ICN", arrAirport: "마츠야마", arrAirportCode: "MYJ", departureTime: "13:05", arrivalTime: "14:35", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  { airline: "에어부산", flightNo: "BX142", depAirport: "김해(부산)", depAirportCode: "PUS", arrAirport: "마츠야마", arrAirportCode: "MYJ", departureTime: "15:15", arrivalTime: "16:30", days: "수,토,일", aircraft: "A321-200", direction: "OUTBOUND" },
  // Return
  { airline: "제주항공", flightNo: "7C1703", depAirport: "마츠야마", depAirportCode: "MYJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:35", arrivalTime: "17:15", days: "매일", aircraft: "B737-800", direction: "INBOUND" },
  { airline: "에어부산", flightNo: "BX141", depAirport: "마츠야마", depAirportCode: "MYJ", arrAirport: "김해(부산)", arrAirportCode: "PUS", departureTime: "17:30", arrivalTime: "18:45", days: "수,토,일", aircraft: "A321-200", direction: "INBOUND" },

  // ----------------------------------------------------
  // 11. Komatsu (KMQ) - 고마쓰
  // ----------------------------------------------------
  { airline: "대한항공", flightNo: "KE775", depAirport: "인천", depAirportCode: "ICN", arrAirport: "고마쓰", arrAirportCode: "KMQ", departureTime: "07:35", arrivalTime: "09:25", days: "수,금,일", aircraft: "B737-8 / A321neo", direction: "OUTBOUND" },
  // Return
  { airline: "대한항공", flightNo: "KE776", depAirport: "고마쓰", depAirportCode: "KMQ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:35", arrivalTime: "12:35", days: "수,금,일", aircraft: "B737-8 / A321neo", direction: "INBOUND" },

  // ----------------------------------------------------
  // 12. Kumamoto (KMJ) - 구마모토
  // ----------------------------------------------------
  { airline: "대한항공", flightNo: "KE2155", depAirport: "인천", depAirportCode: "ICN", arrAirport: "구마모토", arrAirportCode: "KMJ", departureTime: "17:05", arrivalTime: "18:35", days: "매일", aircraft: "A220-300", direction: "OUTBOUND" },
  { airline: "티웨이항공", flightNo: "TW287", depAirport: "인천", depAirportCode: "ICN", arrAirport: "구마모토", arrAirportCode: "KMJ", departureTime: "07:55", arrivalTime: "09:25", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  // Return
  { airline: "대한항공", flightNo: "KE2156", depAirport: "구마모토", depAirportCode: "KMJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "19:35", arrivalTime: "21:20", days: "매일", aircraft: "A220-300", direction: "INBOUND" },
  { airline: "티웨이항공", flightNo: "TW288", depAirport: "구마모토", depAirportCode: "KMJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:25", arrivalTime: "12:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 13. Kagoshima (KOJ) - 가고시마
  // ----------------------------------------------------
  { airline: "대한항공", flightNo: "KE785", depAirport: "인천", depAirportCode: "ICN", arrAirport: "가고시마", arrAirportCode: "KOJ", departureTime: "09:20", arrivalTime: "11:00", days: "수,금,일", aircraft: "B737-8 / B737-800", direction: "OUTBOUND" },
  // Return
  { airline: "대한항공", flightNo: "KE786", depAirport: "가고시마", depAirportCode: "KOJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:10", arrivalTime: "13:55", days: "수,금,일", aircraft: "B737-8 / B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 14. Yonago (YGJ) - 요나고
  // ----------------------------------------------------
  { airline: "에어서울", flightNo: "RS721", depAirport: "인천", depAirportCode: "ICN", arrAirport: "요나고", arrAirportCode: "YGJ", departureTime: "13:20", arrivalTime: "14:50", days: "수,금,일", aircraft: "A321-200", direction: "OUTBOUND" },
  // Return
  { airline: "에어서울", flightNo: "RS722", depAirport: "요나고", depAirportCode: "YGJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "15:50", arrivalTime: "17:25", days: "수,금,일", aircraft: "A321-200", direction: "INBOUND" },

  // ----------------------------------------------------
  // 15. Shizuoka (FSZ) - 시즈오카
  // ----------------------------------------------------
  { airline: "진에어", flightNo: "LJ261", depAirport: "인천", depAirportCode: "ICN", arrAirport: "시즈오카", arrAirportCode: "FSZ", departureTime: "09:05", arrivalTime: "11:00", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  // Return
  { airline: "진에어", flightNo: "LJ262", depAirport: "시즈오카", depAirportCode: "FSZ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:00", arrivalTime: "14:00", days: "매일", aircraft: "B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 16. Hiroshima (HIJ) - 히로시마
  // ----------------------------------------------------
  { airline: "제주항공", flightNo: "7C1802", depAirport: "인천", depAirportCode: "ICN", arrAirport: "히로시마", arrAirportCode: "HIJ", departureTime: "08:05", arrivalTime: "09:30", days: "매일", aircraft: "B737-800", direction: "OUTBOUND" },
  // Return
  { airline: "제주항공", flightNo: "7C1801", depAirport: "히로시마", depAirportCode: "HIJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:30", arrivalTime: "12:05", days: "매일", aircraft: "B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 17. Okayama (OKJ) - 오카야마
  // ----------------------------------------------------
  { airline: "대한항공", flightNo: "KE773", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오카야마", arrAirportCode: "OKJ", departureTime: "08:00", arrivalTime: "09:30", days: "매일", aircraft: "A220-300", direction: "OUTBOUND" },
  // Return
  { airline: "대한항공", flightNo: "KE774", depAirport: "오카야마", depAirportCode: "OKJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:30", arrivalTime: "12:10", days: "매일", aircraft: "A220-300", direction: "INBOUND" },

  // ----------------------------------------------------
  // 18. Nagasaki (NGS) - 나가사키
  // ----------------------------------------------------
  { airline: "대한항공", flightNo: "KE791", depAirport: "인천", depAirportCode: "ICN", arrAirport: "나가사키", arrAirportCode: "NGS", departureTime: "08:00", arrivalTime: "09:30", days: "월,목,토", aircraft: "A321neo", direction: "OUTBOUND" },
  // Return
  { airline: "대한항공", flightNo: "KE792", depAirport: "나가사키", depAirportCode: "NGS", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "10:30", arrivalTime: "12:05", days: "월,목,토", aircraft: "A321neo", direction: "INBOUND" },

  // ----------------------------------------------------
  // 19. Oita (OIT) - 오이타
  // ----------------------------------------------------
  { airline: "제주항공", flightNo: "7C1508", depAirport: "인천", depAirportCode: "ICN", arrAirport: "오이타", arrAirportCode: "OIT", departureTime: "10:50", arrivalTime: "12:30", days: "화,목,토", aircraft: "B737-800", direction: "OUTBOUND" },
  // Return
  { airline: "제주항공", flightNo: "7C1507", depAirport: "오이타", depAirportCode: "OIT", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "13:30", arrivalTime: "15:10", days: "화,목,토", aircraft: "B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 20. Miyazaki (KMI) - 미야자키
  // ----------------------------------------------------
  { airline: "아시아나항공", flightNo: "OZ158", depAirport: "인천", depAirportCode: "ICN", arrAirport: "미야자키", arrAirportCode: "KMI", departureTime: "09:40", arrivalTime: "11:20", days: "수,금,일", aircraft: "A321-200 / A321neo", direction: "OUTBOUND" },
  // Return
  { airline: "아시아나항공", flightNo: "OZ157", depAirport: "미야자키", depAirportCode: "KMI", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:20", arrivalTime: "14:00", days: "수,금,일", aircraft: "A321-200 / A321neo", direction: "INBOUND" },

  // ----------------------------------------------------
  // 21. Saga (HSG) - 사가
  // ----------------------------------------------------
  { airline: "티웨이항공", flightNo: "TW291", depAirport: "인천", depAirportCode: "ICN", arrAirport: "사가", arrAirportCode: "HSG", departureTime: "11:45", arrivalTime: "13:05", days: "화,목,토", aircraft: "B737-800", direction: "OUTBOUND" },
  // Return
  { airline: "티웨이항공", flightNo: "TW292", depAirport: "사가", depAirportCode: "HSG", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "14:05", arrivalTime: "15:30", days: "화,목,토", aircraft: "B737-800", direction: "INBOUND" },

  // ----------------------------------------------------
  // 22. Ibaraki (IBR) - 이바라키
  // ----------------------------------------------------
  { airline: "에어부산", flightNo: "BX191", depAirport: "청주", depAirportCode: "CJJ", arrAirport: "이바라키", arrAirportCode: "IBR", departureTime: "11:00", arrivalTime: "13:00", days: "화,목,토", aircraft: "A321-200", direction: "OUTBOUND" },
  // Return
  { airline: "에어부산", flightNo: "BX192", depAirport: "이바라키", depAirportCode: "IBR", arrAirport: "청주", arrAirportCode: "CJJ", departureTime: "14:00", arrivalTime: "16:00", days: "화,목,토", aircraft: "A321-200", direction: "INBOUND" },

  // ----------------------------------------------------
  // 23. Aomori (AOJ) - 아오모리
  // ----------------------------------------------------
  { airline: "대한항공", flightNo: "KE767", depAirport: "인천", depAirportCode: "ICN", arrAirport: "아오모리", arrAirportCode: "AOJ", departureTime: "10:30", arrivalTime: "12:50", days: "화,목,토", aircraft: "B737-8 / A321neo", direction: "OUTBOUND" },
  // Return
  { airline: "대한항공", flightNo: "KE768", depAirport: "아오모리", depAirportCode: "AOJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "13:55", arrivalTime: "16:30", days: "화,목,토", aircraft: "B737-8 / A321neo", direction: "INBOUND" },

  // ----------------------------------------------------
  // 24. Sendai (SDJ) - 센다이
  // ----------------------------------------------------
  { airline: "아시아나항공", flightNo: "OZ152", depAirport: "인천", depAirportCode: "ICN", arrAirport: "센다이", arrAirportCode: "SDJ", departureTime: "09:35", arrivalTime: "11:50", days: "화,금,일", aircraft: "A321neo / A330-300", direction: "OUTBOUND" },
  // Return
  { airline: "아시아나항공", flightNo: "OZ151", depAirport: "센다이", depAirportCode: "SDJ", arrAirport: "인천", arrAirportCode: "ICN", departureTime: "12:50", arrivalTime: "15:15", days: "화,금,일", aircraft: "A321neo / A330-300", direction: "INBOUND" },
];

export function hasGimpoFlightsForAirport(airportCode: string): boolean {
  return FLIGHT_DATABASE.some(
    (f) =>
      (f.arrAirportCode === airportCode || f.depAirportCode === airportCode) &&
      (f.depAirportCode === "GMP" || f.arrAirportCode === "GMP")
  );
}

export async function fetchLiveAirportFlights(
  airportCode: string,
  koreanAirportFilter: string = "ALL",
  directionFilter: "ALL" | "OUTBOUND" | "INBOUND" = "ALL"
): Promise<FlightSchedule[]> {
  let liveItems: FlightSchedule[] = [];

  // Helper to match Korean airport filter
  const isKoreanAirportMatch = (code: string) => {
    if (koreanAirportFilter === "ALL") return true;
    if (koreanAirportFilter === "ICN") return code === "ICN";
    if (koreanAirportFilter === "PUS") return code === "PUS";
    if (koreanAirportFilter === "GMP") return code === "GMP";
    if (koreanAirportFilter === "CJJ") return !["ICN", "PUS", "GMP"].includes(code);
    return code === koreanAirportFilter;
  };

  // 1. Try Korea Airports Corporation & Incheon Airport Open API via proxy
  if (icnApiKey || korApiKey) {
    const keyToUse = korApiKey || icnApiKey;
    try {
      const proxyUrl = `/api/data-go/B551178/flight-status/info?serviceKey=${keyToUse}&type=json`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        const items = data?.response?.body?.items || data?.item || [];
        items.forEach((item: any) => {
          const arrCode = item.arrAirportCode || item.airportCode || item.airport;
          const depCode = item.boardAirportCode || item.depAirportCode || "ICN";

          // Outbound live flight
          if (arrCode === airportCode) {
            const depTimeRaw = item.std || item.scheduleDateTime || item.estimatedDateTime || "";
            const depTimeFormatted = depTimeRaw.length >= 4 ? `${depTimeRaw.slice(-4, -2)}:${depTimeRaw.slice(-2)}` : "실시간";
            liveItems.push({
              airline: item.airlineKorean || item.airline || "대한항공/아시아나",
              flightNo: item.airFln || item.flightId || item.flightNo || "LIVE",
              depAirport: item.boardAirportKor || "한국 출발",
              depAirportCode: depCode,
              arrAirport: item.arrivedAirportKor || arrCode,
              arrAirportCode: arrCode,
              departureTime: depTimeFormatted,
              arrivalTime: "직항",
              days: "실시간 API",
              direction: "OUTBOUND",
              isLive: true,
            });
          }

          // Inbound live flight
          if (depCode === airportCode) {
            const depTimeRaw = item.std || item.scheduleDateTime || item.estimatedDateTime || "";
            const depTimeFormatted = depTimeRaw.length >= 4 ? `${depTimeRaw.slice(-4, -2)}:${depTimeRaw.slice(-2)}` : "실시간";
            liveItems.push({
              airline: item.airlineKorean || item.airline || "대한항공/아시아나",
              flightNo: item.airFln || item.flightId || item.flightNo || "LIVE",
              depAirport: item.boardAirportKor || depCode,
              depAirportCode: depCode,
              arrAirport: item.arrivedAirportKor || "한국 도착",
              arrAirportCode: arrCode || "ICN",
              departureTime: depTimeFormatted,
              arrivalTime: "직항",
              days: "실시간 API",
              direction: "INBOUND",
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
    // Direction Check
    const itemDir = item.direction || (item.arrAirportCode === airportCode ? "OUTBOUND" : "INBOUND");
    if (directionFilter !== "ALL" && itemDir !== directionFilter) {
      return false;
    }

    // Airport Match Check
    const isAirportMatch = item.arrAirportCode === airportCode || item.depAirportCode === airportCode;
    if (!isAirportMatch) return false;

    // Korean Airport Filter Check
    const korCode = itemDir === "OUTBOUND" ? item.depAirportCode : item.arrAirportCode;
    return isKoreanAirportMatch(korCode);
  });

  if (liveItems.length > 0) {
    const filteredLive = liveItems.filter((f) => {
      const fDir = f.direction || (f.arrAirportCode === airportCode ? "OUTBOUND" : "INBOUND");
      if (directionFilter !== "ALL" && fDir !== directionFilter) return false;

      const korCode = fDir === "OUTBOUND" ? f.depAirportCode : f.arrAirportCode;
      return isKoreanAirportMatch(korCode);
    });

    if (filteredLive.length > 0) {
      return filteredLive;
    }
  }

  // Fallback to database when live API is unavailable or returns 0 items
  return matchedDb;
}

