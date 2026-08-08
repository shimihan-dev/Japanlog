export interface PrefectureAccessInfo {
  hasDirectFlight: boolean;
  airportName?: string;
  nearestAirport?: string;
  shinkansenStations?: string[];
  accessGuide: string;
  representativeCities: string[];
}

export interface ShinkansenRoute {
  id: string;
  name: string;
  color: string;
  stations: { name: string; lat: number; lng: number; prefCode: number }[];
}

export const SHINKANSEN_ROUTES: ShinkansenRoute[] = [
  {
    id: "tokaido-sanyo",
    name: "도카이도 / 산요 신칸센",
    color: "#0072BC", // Blue
    stations: [
      { name: "도쿄", lat: 35.6812, lng: 139.7671, prefCode: 13 },
      { name: "신요코하마", lat: 35.5074, lng: 139.6176, prefCode: 14 },
      { name: "나고야", lat: 35.1709, lng: 136.8815, prefCode: 23 },
      { name: "교토", lat: 34.9858, lng: 135.7588, prefCode: 26 },
      { name: "신오사카", lat: 34.7335, lng: 135.5003, prefCode: 27 },
      { name: "신코베", lat: 34.7062, lng: 135.1953, prefCode: 28 },
      { name: "히로시마", lat: 34.3976, lng: 132.4753, prefCode: 34 },
      { name: "하카타(후쿠오카)", lat: 33.5897, lng: 130.4207, prefCode: 40 },
    ],
  },
  {
    id: "tohoku-hokkaido",
    name: "도호쿠 / 홋카이도 신칸센",
    color: "#009944", // Green
    stations: [
      { name: "도쿄", lat: 35.6812, lng: 139.7671, prefCode: 13 },
      { name: "오미야", lat: 35.9063, lng: 139.624, prefCode: 11 },
      { name: "우츠노미야", lat: 36.559, lng: 139.8984, prefCode: 9 },
      { name: "센다이", lat: 38.2601, lng: 140.8824, prefCode: 4 },
      { name: "모리오카", lat: 39.7013, lng: 141.1364, prefCode: 3 },
      { name: "신아오모리", lat: 40.8276, lng: 140.6933, prefCode: 2 },
      { name: "신하코다테호쿠토", lat: 41.9047, lng: 140.6483, prefCode: 1 },
    ],
  },
  {
    id: "hokuriku",
    name: "호쿠리쿠 신칸센",
    color: "#E60012", // Red
    stations: [
      { name: "도쿄", lat: 35.6812, lng: 139.7671, prefCode: 13 },
      { name: "다카사키", lat: 36.3224, lng: 139.0128, prefCode: 10 },
      { name: "카루이자와", lat: 36.3427, lng: 138.6353, prefCode: 20 },
      { name: "나가노", lat: 36.6431, lng: 138.1886, prefCode: 20 },
      { name: "도야마", lat: 36.7013, lng: 137.2133, prefCode: 16 },
      { name: "가나자와", lat: 36.578, lng: 136.6478, prefCode: 17 },
      { name: "후쿠이", lat: 36.0621, lng: 136.2223, prefCode: 18 },
      { name: "쓰루가", lat: 35.6453, lng: 136.0558, prefCode: 18 },
    ],
  },
  {
    id: "kyushu",
    name: "큐슈 신칸센",
    color: "#F39800", // Orange
    stations: [
      { name: "하카타(후쿠오카)", lat: 33.5897, lng: 130.4207, prefCode: 40 },
      { name: "구마모토", lat: 32.7894, lng: 130.6883, prefCode: 43 },
      { name: "가고시마추오", lat: 31.5839, lng: 130.5413, prefCode: 46 },
    ],
  },
];

export const PREFECTURE_ACCESS_INFO: Record<number, PrefectureAccessInfo> = {
  1: {
    hasDirectFlight: true,
    airportName: "신치토세 공항 (CTS), 하코다테 공항 (HKD)",
    shinkansenStations: ["신하코다테호쿠토역"],
    accessGuide: "인천/김해 ↔ 신치토세 직항 매일 운항. 하코다테는 신칸센 연계 가능.",
    representativeCities: ["삿포로", "하코다테", "오타루", "아사히카와"],
  },
  2: {
    hasDirectFlight: true,
    airportName: "아오모리 공항 (AOJ)",
    shinkansenStations: ["신아오모리역", "하치노헤역"],
    accessGuide: "인천 ↔ 아오모리 직항 운항. 도쿄에서 도호쿠 신칸센으로 약 3시간 소요.",
    representativeCities: ["아오모리", "히로사키", "하치노헤"],
  },
  3: {
    hasDirectFlight: false,
    nearestAirport: "센다이 공항 (SDJ) 또는 아오모리 공항",
    shinkansenStations: ["모리오카역", "이치노세키역"],
    accessGuide: "센다이 공항 입국 후 도호쿠 신칸센 또는 JR 모리오카행 이동.",
    representativeCities: ["모리오카", "하나마키"],
  },
  4: {
    hasDirectFlight: true,
    airportName: "센다이 공항 (SDJ)",
    shinkansenStations: ["센다이역"],
    accessGuide: "인천 ↔ 센다이 직항 운항. 도쿄에서 신칸센으로 1시간 30분 접근 가능.",
    representativeCities: ["센다이", "마츠시마"],
  },
  5: {
    hasDirectFlight: true,
    airportName: "아키타 공항 (AXT)",
    shinkansenStations: ["아키타역"],
    accessGuide: "인천 ↔ 아키타 직항 또는 센다이 공항 이용 후 아키타 신칸센 이용.",
    representativeCities: ["아키타", "다자쿠라"],
  },
  6: {
    hasDirectFlight: false,
    nearestAirport: "센다이 공항 (SDJ)",
    shinkansenStations: ["야마가타역"],
    accessGuide: "센다이 공항 입국 후 JR 야마가타선 또는 야마가타 신칸센 이용.",
    representativeCities: ["야마가타", "요네자와"],
  },
  7: {
    hasDirectFlight: false,
    nearestAirport: "센다이 공항 (SDJ) 또는 이바라키 공항",
    shinkansenStations: ["코리야마역", "후쿠시마역"],
    accessGuide: "도쿄에서 도호쿠/야마가타 신칸센으로 1시간 20분 접근.",
    representativeCities: ["후쿠시마", "아이즈와카마츠"],
  },
  8: {
    hasDirectFlight: true,
    airportName: "이바라키 공항 (IBR)",
    shinkansenStations: [],
    accessGuide: "청주/인천 ↔ 이바라키 직항 운항. 도쿄에서 JR 조반선 특급으로 1시간.",
    representativeCities: ["미토", "츠쿠바"],
  },
  9: {
    hasDirectFlight: false,
    nearestAirport: "하네다/나리타 공항 (HND/NRT)",
    shinkansenStations: ["우츠노미야역", "나스시오바라역"],
    accessGuide: "도쿄역에서 도호쿠 신칸센 이용 시 50분 소요 (닛코 관광 연계).",
    representativeCities: ["우츠노미야", "닛코"],
  },
  10: {
    hasDirectFlight: false,
    nearestAirport: "하네다 공항 (HND)",
    shinkansenStations: ["다카사키역", "안나카하루나역"],
    accessGuide: "도쿄역에서 조에츠/호쿠리쿠 신칸센으로 50분 소요 (쿠사츠 온천 연계).",
    representativeCities: ["마에바시", "다카사키", "쿠사츠"],
  },
  11: {
    hasDirectFlight: false,
    nearestAirport: "하네다/나리타 공항 (HND/NRT)",
    shinkansenStations: ["오미야역", "쿠마가야역"],
    accessGuide: "하네다 공항에서 리무진 버스 또는 JR 쾌적 연계 (도쿄 인접).",
    representativeCities: ["사이타마", "카와고에"],
  },
  12: {
    hasDirectFlight: true,
    airportName: "나리타 국제공항 (NRT)",
    shinkansenStations: [],
    accessGuide: "한국 주요 공항 직항 매일 운항. 넥스(N'EX) 또는 케이세이 스카이라이너 연계.",
    representativeCities: ["지바", "나리타", "키사라즈"],
  },
  13: {
    hasDirectFlight: true,
    airportName: "하네다 공항 (HND), 나리타 공항 (NRT)",
    shinkansenStations: ["도쿄역", "시나가와역"],
    accessGuide: "모든 일본 주요 철도 및 신칸센의 전 세계 최고 교통 허브.",
    representativeCities: ["도쿄 23구 (신주쿠, 시부야, 시나가와)", "하치오지", "타치카와"],
  },
  14: {
    hasDirectFlight: false,
    nearestAirport: "하네다 공항 (HND)",
    shinkansenStations: ["신요코하마역", "오다와라역"],
    accessGuide: "하네다 공항에서 게이큐선/버스로 30분 (요코하마, 하코네, 카마쿠라 연계).",
    representativeCities: ["요코하마", "가와사키", "카마쿠라", "하코네"],
  },
  15: {
    hasDirectFlight: true,
    airportName: "니가타 공항 (KIJ)",
    shinkansenStations: ["니가타역", "나가가와역", "에치고유자와역"],
    accessGuide: "인천 ↔ 니가타 직항 운항. 도쿄에서 조에츠 신칸센으로 1시간 40분.",
    representativeCities: ["니가타", "나가오카"],
  },
  16: {
    hasDirectFlight: true,
    airportName: "도야마 공항 (TOY)",
    shinkansenStations: ["도야마역", "신타카오카역"],
    accessGuide: "인천 ↔ 도야마 직항 운항. 호쿠리쿠 신칸센으로 가나자와/도쿄 연계.",
    representativeCities: ["도야마", "타카오카"],
  },
  17: {
    hasDirectFlight: true,
    airportName: "고마쓰 공항 (KMQ)",
    shinkansenStations: ["가나자와역", "고마쓰역", "카가온센역"],
    accessGuide: "인천 ↔ 고마쓰 직항 운항. 호쿠리쿠 신칸센 개통으로 접근성 우수.",
    representativeCities: ["가나자와", "고마쓰", "카가"],
  },
  18: {
    hasDirectFlight: false,
    nearestAirport: "고마쓰 공항 (KMQ)",
    shinkansenStations: ["후쿠이역", "쓰루가역"],
    accessGuide: "고마쓰 공항에서 버스로 1시간 또는 호쿠리쿠 신칸센으로 직접 연계.",
    representativeCities: ["후쿠이", "쓰루가"],
  },
  19: {
    hasDirectFlight: false,
    nearestAirport: "하네다 공항 (HND) 또는 시즈오카 공항",
    shinkansenStations: [],
    accessGuide: "도쿄 신주쿠에서 특급 아즈사(Azusa) 열차로 1시간 30분 소요 (후지산 연계).",
    representativeCities: ["고후", "후지요시다"],
  },
  20: {
    hasDirectFlight: false,
    nearestAirport: "도쿄 하네다 또는 나고야 중부공항",
    shinkansenStations: ["나가노역", "카루이자와역", "이이야마역"],
    accessGuide: "도쿄역에서 호쿠리쿠 신칸센 이용 시 1시간 20분 소요.",
    representativeCities: ["나가노", "마츠모토", "카루이자와"],
  },
  21: {
    hasDirectFlight: false,
    nearestAirport: "나고야 중부 국제공항 (NGO)",
    shinkansenStations: ["기후하시마역"],
    accessGuide: "나고야 중부공항에서 메이테츠 특급으로 50분 소요 (시라카와고 연계).",
    representativeCities: ["기후", "다카야마", "시라카와고"],
  },
  22: {
    hasDirectFlight: true,
    airportName: "시즈오카 공항 (FSZ)",
    shinkansenStations: ["시즈오카역", "하마마츠역", "아타미역"],
    accessGuide: "인천 ↔ 시즈오카 직항 운항. 도카이도 신칸센으로 도쿄/나고야 접근 용이.",
    representativeCities: ["시즈오카", "하마마츠", "아타미"],
  },
  23: {
    hasDirectFlight: true,
    airportName: "중부 국제공항 세인트레아 (NGO)",
    shinkansenStations: ["나고야역", "토요하시역"],
    accessGuide: "한국 주요 공항 직항 운항. 메이테츠 뮤스카이로 나고야역 28분 연결.",
    representativeCities: ["나고야", "토요타", "토요하시"],
  },
  24: {
    hasDirectFlight: false,
    nearestAirport: "나고야 중부공항 (NGO) 또는 간사이 공항 (KIX)",
    shinkansenStations: [],
    accessGuide: "나고야역에서 킨테츠 특급으로 1시간 20분 (이세신궁/토바 연계).",
    representativeCities: ["쓰", "요카이치", "이세"],
  },
  25: {
    hasDirectFlight: false,
    nearestAirport: "간사이 국제공항 (KIX)",
    shinkansenStations: ["마이바라역"],
    accessGuide: "교토역에서 JR 비와코선 쾌속으로 20분 (비와호 연계).",
    representativeCities: ["오츠", "히코네"],
  },
  26: {
    hasDirectFlight: false,
    nearestAirport: "간사이 국제공항 (KIX) 또는 오사카 이타미 공항",
    shinkansenStations: ["교토역"],
    accessGuide: "간사이 공항에서 JR 특급 하루카(Haruka) 이용 시 75분 직통 연결.",
    representativeCities: ["교토", "우지"],
  },
  27: {
    hasDirectFlight: true,
    airportName: "간사이 국제공항 (KIX), 이타미 공항 (ITM)",
    shinkansenStations: ["신오사카역"],
    accessGuide: "한국 전역 직항 운항. 난카이 라피트 / JR 하루카로 난바 및 신오사카 연계.",
    representativeCities: ["오사카 (난바, 우메다)", "사카이"],
  },
  28: {
    hasDirectFlight: true,
    airportName: "고베 공항 (UKB)",
    shinkansenStations: ["신코베역", "히메지역"],
    accessGuide: "간사이 공항에서 베이셔틀 고속선 30분 또는 오사카에서 JR 20분.",
    representativeCities: ["고베", "히메지"],
  },
  29: {
    hasDirectFlight: false,
    nearestAirport: "간사이 국제공항 (KIX)",
    shinkansenStations: [],
    accessGuide: "오사카 난바역에서 킨테츠 특급으로 35분 직통 접근.",
    representativeCities: ["나라"],
  },
  30: {
    hasDirectFlight: false,
    nearestAirport: "간사이 국제공항 (KIX)",
    shinkansenStations: [],
    accessGuide: "간사이 공항에서 JR 쾌속 또는 리무진 버스로 40분 직결 (시라하마 온천 연계).",
    representativeCities: ["와카야마", "시라하마"],
  },
  31: {
    hasDirectFlight: true,
    airportName: "요나고 공항 (YGJ), 돗토리 공항 (TTJ)",
    shinkansenStations: [],
    accessGuide: "인천 ↔ 요나고 에어서울 직항 운항. 오사카에서 특급 슈퍼 하쿠토 이용.",
    representativeCities: ["돗토리", "요나고"],
  },
  32: {
    hasDirectFlight: true,
    airportName: "시마네 이즈모 공항 (IZO)",
    shinkansenStations: [],
    accessGuide: "오사카/후쿠오카에서 국내선 연계 또는 JR 산인 본선 이용.",
    representativeCities: ["마츠에", "이즈모"],
  },
  33: {
    hasDirectFlight: true,
    airportName: "오카야마 공항 (OKJ)",
    shinkansenStations: ["오카야마역", "쿠라시키역"],
    accessGuide: "인천 ↔ 오카야마 직항 대한항공 운항. 산요 신칸센 교통 요충지.",
    representativeCities: ["오카야마", "쿠라시키"],
  },
  34: {
    hasDirectFlight: true,
    airportName: "히로시마 공항 (HIJ)",
    shinkansenStations: ["히로시마역", "후쿠야마역"],
    accessGuide: "인천 ↔ 히로시마 제주항공 직항 운항. 산요 신칸센 이용 용이.",
    representativeCities: ["히로시마", "후쿠야마", "오노미치"],
  },
  35: {
    hasDirectFlight: true,
    airportName: "야마구치 우베 공항 (UBJ)",
    shinkansenStations: ["신야마구치역", "신시모노세키역"],
    accessGuide: "후쿠오카 하카타역에서 산요 신칸센으로 35분 (시모노세키/유다온천 연계).",
    representativeCities: ["시모노세키", "야마구치", "우베"],
  },
  36: {
    hasDirectFlight: false,
    nearestAirport: "다카마쓰 공항 (TAK) 또는 난카이 페리",
    shinkansenStations: [],
    accessGuide: "다카마쓰 공항 입국 후 버스로 이동 또는 오사카에서 도쿠시마 페리 연계.",
    representativeCities: ["도쿠시마", "나루토"],
  },
  37: {
    hasDirectFlight: true,
    airportName: "다카마쓰 공항 (TAK)",
    shinkansenStations: [],
    accessGuide: "인천 ↔ 다카마쓰 에어서울 직항 매일 운항. 오카야마에서 세토대교선 열차 연결.",
    representativeCities: ["다카마쓰", "마루가메"],
  },
  38: {
    hasDirectFlight: true,
    airportName: "마츠야마 공항 (MYJ)",
    shinkansenStations: [],
    accessGuide: "인천/부산 ↔ 마츠야마 제주항공/에어부산 직항 운항 (도고 온천 연계).",
    representativeCities: ["마츠야마", "이마바리"],
  },
  39: {
    hasDirectFlight: true,
    airportName: "고치 공항 (KCZ)",
    shinkansenStations: [],
    accessGuide: "오카야마역에서 JR 특급 남풍(Nanpu) 열차 이용 시 2시간 30분.",
    representativeCities: ["고치"],
  },
  40: {
    hasDirectFlight: true,
    airportName: "후쿠오카 국제공항 (FUK), 기타큐슈 공항 (KKJ)",
    shinkansenStations: ["하카타역", "고쿠라역"],
    accessGuide: "한국 전역 직항 최단 거리 (지하철로 하카타역 5분). 큐슈 신칸센 시발점.",
    representativeCities: ["후쿠오카 (하카타, 텐진)", "기타큐슈 (고쿠라)", "쿠루메"],
  },
  41: {
    hasDirectFlight: true,
    airportName: "사가 공항 (HSG)",
    shinkansenStations: ["신토스역"],
    accessGuide: "인천 ↔ 사가 티웨이 직항 운항. 후쿠오카 하카타역에서 JR 특급 40분.",
    representativeCities: ["사가", "카라츠"],
  },
  42: {
    hasDirectFlight: true,
    airportName: "나가사키 공항 (NGS)",
    shinkansenStations: ["나가사키역", "사세보역"],
    accessGuide: "인천 ↔ 나가사키 직항 운항. 서큐슈 신칸센(신타케오온천~나가사키) 연결.",
    representativeCities: ["나가사키", "사세보 (하우스텐보스)"],
  },
  43: {
    hasDirectFlight: true,
    airportName: "구마모토 공항 (KMJ)",
    shinkansenStations: ["구마모토역", "신야츠시로역"],
    accessGuide: "인천/부산 ↔ 구마모토 직항 운항. 큐슈 신칸센으로 하카타에서 38분.",
    representativeCities: ["구마모토", "아소"],
  },
  44: {
    hasDirectFlight: true,
    airportName: "오이타 공항 (OIT)",
    shinkansenStations: [],
    accessGuide: "인천 ↔ 오이타 제주항공 직항 운항. 후쿠오카에서 JR 특급 소닉 2시간 (유후인/베푸).",
    representativeCities: ["오이타", "베푸", "유후인"],
  },
  45: {
    hasDirectFlight: true,
    airportName: "미야자키 공항 (KMI)",
    shinkansenStations: [],
    accessGuide: "인천 ↔ 미야자키 아시아나 직항 운항. 공항에서 시내까지 JR 10분 연결.",
    representativeCities: ["미야자키", "미야코노조"],
  },
  46: {
    hasDirectFlight: true,
    airportName: "가고시마 공항 (KOJ)",
    shinkansenStations: ["가고시마추오역"],
    accessGuide: "인천 ↔ 가고시마 대한항공 직항 운항. 큐슈 신칸센 종착역.",
    representativeCities: ["가고시마", "키리시마"],
  },
  47: {
    hasDirectFlight: true,
    airportName: "나하 공항 (OKA), 이시가키 공항 (ISG)",
    shinkansenStations: [],
    accessGuide: "한국 전역 직항 운항. 나하 공항에서 오키나와 도시모노레일(유이레일) 연결.",
    representativeCities: ["나하", "오키나와시", "나고"],
  },
};
