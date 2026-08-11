export interface ShinkansenStation {
  nameKo: string;
  nameJa: string;
  coords: [number, number]; // [lng, lat]
}

export interface ShinkansenLine {
  id: string;
  nameKo: string;
  color: string;
  darkColor: string;
  stations: ShinkansenStation[];
  pathWaypoints?: [number, number][]; // Detailed track waypoints for natural route curvature
}

export const SHINKANSEN_LINES: ShinkansenLine[] = [
  {
    id: "hokkaido-tohoku",
    nameKo: "도호쿠·홋카이도 신칸센",
    color: "#10B981", // Emerald Green
    darkColor: "#34D399",
    stations: [
      { nameKo: "도쿄", nameJa: "東京", coords: [139.767, 35.681] },
      { nameKo: "오미야", nameJa: "大宮", coords: [139.624, 35.906] },
      { nameKo: "우츠노미야", nameJa: "宇都宮", coords: [139.898, 36.559] },
      { nameKo: "고리야마", nameJa: "郡山", coords: [140.388, 37.398] },
      { nameKo: "센다이", nameJa: "仙台", coords: [140.882, 38.260] },
      { nameKo: "모리오카", nameJa: "盛岡", coords: [141.136, 39.701] },
      { nameKo: "신아오모리", nameJa: "新青森", coords: [140.693, 40.828] },
      { nameKo: "신하코다테호쿠토", nameJa: "新函館北斗", coords: [140.648, 41.905] },
    ],
    pathWaypoints: [
      [139.767, 35.681], // Tokyo
      [139.624, 35.906], // Omiya
      [139.898, 36.559], // Utsunomiya
      [140.170, 37.126], // Shin-Shirakawa
      [140.388, 37.398], // Koriyama
      [140.485, 37.754], // Fukushima
      [140.882, 38.260], // Sendai
      [141.032, 38.710], // Kurikoma-Kogen
      [141.136, 39.701], // Morioka
      [140.767, 40.283], // Shichinohe-Towada
      [140.693, 40.828], // Shin-Aomori
      [140.435, 41.145], // Okutsugaru-Imabetsu
      [140.380, 41.530], // Seikan Tunnel Tsugaru Entrance & Exit
      [140.232, 41.720], // Kikonai (Hokkaido)
      [140.648, 41.905], // Shin-Hakodate-Hokuto
    ],
  },
  {
    id: "tokaido-sanyo",
    nameKo: "도카이도·산요 신칸센",
    color: "#3B82F6", // Royal Blue
    darkColor: "#60A5FA",
    stations: [
      { nameKo: "도쿄", nameJa: "東京", coords: [139.767, 35.681] },
      { nameKo: "신요코하마", nameJa: "新横浜", coords: [139.617, 35.508] },
      { nameKo: "나고야", nameJa: "名古屋", coords: [136.881, 35.170] },
      { nameKo: "교토", nameJa: "京都", coords: [135.758, 34.985] },
      { nameKo: "신오사카", nameJa: "新大阪", coords: [135.500, 34.733] },
      { nameKo: "신고베", nameJa: "新神戸", coords: [135.195, 34.705] },
      { nameKo: "오카야마", nameJa: "岡山", coords: [133.918, 34.666] },
      { nameKo: "히로시마", nameJa: "広島", coords: [132.475, 34.397] },
      { nameKo: "신야마구치", nameJa: "新山口", coords: [131.479, 34.092] },
      { nameKo: "하카타(후쿠오카)", nameJa: "博多", coords: [130.420, 33.590] },
    ],
    pathWaypoints: [
      [139.767, 35.681], // Tokyo
      [139.617, 35.508], // Shin-Yokohama
      [139.156, 35.256], // Odawara (Kanagawa)
      [139.078, 35.103], // Atami (Shizuoka entrance)
      [138.911, 35.127], // Mishima (Shizuoka)
      [138.850, 35.130], // Shin-Fuji (Shizuoka)
      [138.389, 34.972], // Shizuoka (Shizuoka City)
      [138.175, 34.800], // Kakegawa (Shizuoka)
      [137.735, 34.704], // Hamamatsu (Shizuoka)
      [137.382, 34.763], // Toyohashi (Aichi)
      [137.000, 34.960], // Mikawa-Anjo (Aichi)
      [136.881, 35.170], // Nagoya (Aichi)
      [136.697, 35.316], // Gifu-Hashima (Gifu)
      [136.290, 35.314], // Maibara (Shiga)
      [135.758, 34.985], // Kyoto
      [135.500, 34.733], // Shin-Osaka
      [135.195, 34.705], // Shin-Kobe
      [134.690, 34.827], // Himeji (Hyogo)
      [134.000, 34.790], // Shin-Kurashiki / Aio
      [133.918, 34.666], // Okayama
      [133.680, 34.540], // Shin-Kurashiki
      [133.361, 34.489], // Fukuyama (Hiroshima)
      [132.700, 34.420], // Higashi-Hiroshima
      [132.475, 34.397], // Hiroshima
      [132.181, 34.131], // Shin-Iwakuni (Yamaguchi)
      [131.700, 34.050], // Tokuyama
      [131.479, 34.092], // Shin-Yamaguchi
      [130.947, 34.004], // Shin-Shimonoseki (Kanmon Tunnel)
      [130.880, 33.880], // Kokura (Kitakyushu, Fukuoka)
      [130.420, 33.590], // Hakata (Fukuoka)
    ],
  },
  {
    id: "kyushu",
    nameKo: "큐슈 신칸센",
    color: "#F59E0B", // Amber Gold
    darkColor: "#FBBF24",
    stations: [
      { nameKo: "하카타", nameJa: "博多", coords: [130.420, 33.590] },
      { nameKo: "구마모토", nameJa: "熊本", coords: [130.706, 32.789] },
      { nameKo: "가고시마 츄오", nameJa: "鹿児島中央", coords: [130.543, 31.584] },
    ],
    pathWaypoints: [
      [130.420, 33.590], // Hakata
      [130.548, 33.320], // Shin-Tosu
      [130.520, 33.000], // Chikugo-Funagoya
      [130.706, 32.789], // Kumamoto
      [130.600, 32.500], // Shin-Yatsushiro
      [130.400, 32.000], // Sendai (Kagoshima)
      [130.543, 31.584], // Kagoshima-Chuo
    ],
  },
  {
    id: "hokuriku",
    nameKo: "호쿠리쿠 신칸센",
    color: "#EC4899", // Magenta/Pink
    darkColor: "#F472B6",
    stations: [
      { nameKo: "도쿄", nameJa: "東京", coords: [139.767, 35.681] },
      { nameKo: "다카사키", nameJa: "高崎", coords: [139.013, 36.322] },
      { nameKo: "가루이자와", nameJa: "軽井沢", coords: [138.636, 36.342] },
      { nameKo: "나가노", nameJa: "長野", coords: [138.188, 36.643] },
      { nameKo: "도야마", nameJa: "富山", coords: [137.213, 36.701] },
      { nameKo: "가나자와", nameJa: "金沢", coords: [136.648, 36.578] },
      { nameKo: "쓰루가", nameJa: "敦賀", coords: [136.056, 35.653] },
    ],
    pathWaypoints: [
      [139.767, 35.681], // Tokyo
      [139.624, 35.906], // Omiya
      [139.013, 36.322], // Takasaki
      [138.636, 36.342], // Karuizawa
      [138.188, 36.643], // Nagano
      [138.252, 37.081], // Joetsu-Myoko
      [137.861, 37.043], // Itoigawa
      [137.213, 36.701], // Toyama
      [136.900, 36.700], // Shin-Takaoka
      [136.648, 36.578], // Kanazawa
      [136.360, 36.300], // Komatsu / Kagaonsen
      [136.222, 36.062], // Fukui
      [136.056, 35.653], // Tsuruga
    ],
  },
  {
    id: "joetsu",
    nameKo: "조에츠 신칸센",
    color: "#8B5CF6", // Purple
    darkColor: "#A78BFA",
    stations: [
      { nameKo: "다카사키", nameJa: "高崎", coords: [139.013, 36.322] },
      { nameKo: "니가타", nameJa: "新潟", coords: [139.062, 37.912] },
    ],
    pathWaypoints: [
      [139.013, 36.322], // Takasaki
      [138.800, 36.930], // Echigo-Yuzawa
      [138.960, 37.450], // Nagaoka
      [139.062, 37.912], // Niigata
    ],
  },
];
