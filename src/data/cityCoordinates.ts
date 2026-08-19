export interface CityCoordinate {
  nameKo: string;
  nameJa?: string;
  prefectureCode: number;
  coords: [number, number]; // [longitude, latitude]
}

// Extensive coordinate database for major Japanese cities, wards, districts, and tourist destinations
export const CITY_COORDINATES_LIST: CityCoordinate[] = [
  // 1. 홋카이도 (Hokkaido) - Code 1
  { nameKo: "삿포로시", nameJa: "札幌市", prefectureCode: 1, coords: [141.3544, 43.0621] },
  { nameKo: "오타루시", nameJa: "小樽市", prefectureCode: 1, coords: [140.9947, 43.1907] },
  { nameKo: "하코다테시", nameJa: "函館市", prefectureCode: 1, coords: [140.7288, 41.7687] },
  { nameKo: "아사히카와시", nameJa: "旭川市", prefectureCode: 1, coords: [142.3648, 43.7706] },
  { nameKo: "비에이정", nameJa: "美瑛町", prefectureCode: 1, coords: [142.4639, 43.5905] },
  { nameKo: "후라노시", nameJa: "富良野市", prefectureCode: 1, coords: [142.3833, 43.3421] },
  { nameKo: "노보리베츠시", nameJa: "登別市", prefectureCode: 1, coords: [141.1066, 42.4128] },
  { nameKo: "쿠시로시", nameJa: "釧路市", prefectureCode: 1, coords: [144.3818, 42.9849] },
  { nameKo: "치토세시", nameJa: "千歳市", prefectureCode: 1, coords: [141.6508, 42.8242] },

  // 2. 아오모리현 (Aomori) - Code 2
  { nameKo: "아오모리시", nameJa: "青森市", prefectureCode: 2, coords: [140.74, 40.8244] },
  { nameKo: "히로사키시", nameJa: "弘前市", prefectureCode: 2, coords: [140.4642, 40.6031] },
  { nameKo: "하치노헤시", nameJa: "八戸市", prefectureCode: 2, coords: [141.4884, 40.5123] },

  // 3. 이와테현 (Iwate) - Code 3
  { nameKo: "모리오카시", nameJa: "盛岡市", prefectureCode: 3, coords: [141.1527, 39.7036] },

  // 4. 미야기현 (Miyagi) - Code 4
  { nameKo: "센다이시", nameJa: "仙台市", prefectureCode: 4, coords: [140.8694, 38.2682] },
  { nameKo: "마츠시마정", nameJa: "松島町", prefectureCode: 4, coords: [141.0664, 38.3725] },

  // 5. 아키타현 (Akita) - Code 5
  { nameKo: "아키타시", nameJa: "秋田市", prefectureCode: 5, coords: [140.1024, 39.7186] },

  // 6. 야마가타현 (Yamagata) - Code 6
  { nameKo: "야마가타시", nameJa: "山形市", prefectureCode: 6, coords: [140.3633, 38.2404] },
  { nameKo: "오바나자와시", nameJa: "尾花沢市", prefectureCode: 6, coords: [140.4031, 38.6019] },

  // 7. 후쿠시마현 (Fukushima) - Code 7
  { nameKo: "후쿠시마시", nameJa: "福島市", prefectureCode: 7, coords: [140.4678, 37.7608] },
  { nameKo: "아이즈와카마츠시", nameJa: "会津若松市", prefectureCode: 7, coords: [139.9297, 37.4947] },

  // 8. 이바라키현 (Ibaraki) - Code 8
  { nameKo: "미토시", nameJa: "水戸市", prefectureCode: 8, coords: [140.4468, 36.3659] },

  // 9. 토치기현 (Tochigi) - Code 9
  { nameKo: "닛코시", nameJa: "日光市", prefectureCode: 9, coords: [139.6983, 36.7486] },
  { nameKo: "우츠노미야시", nameJa: "宇都宮市", prefectureCode: 9, coords: [139.8836, 36.5551] },

  // 10. 군마현 (Gunma) - Code 10
  { nameKo: "쿠사츠정", nameJa: "草津町", prefectureCode: 10, coords: [138.5964, 36.6231] },
  { nameKo: "마에바시시", nameJa: "前橋市", prefectureCode: 10, coords: [139.0631, 36.3895] },
  { nameKo: "다카사키시", nameJa: "高崎市", prefectureCode: 10, coords: [139.0033, 36.3219] },

  // 11. 사이타마현 (Saitama) - Code 11
  { nameKo: "사이타마시", nameJa: "さいたま市", prefectureCode: 11, coords: [139.6489, 35.8617] },
  { nameKo: "카와고에시", nameJa: "川越市", prefectureCode: 11, coords: [139.4858, 35.9251] },

  // 12. 치바현 (Chiba) - Code 12
  { nameKo: "우라야스시", nameJa: "浦安市", prefectureCode: 12, coords: [139.9008, 35.6554] }, // 디즈니랜드
  { nameKo: "나리타시", nameJa: "成田市", prefectureCode: 12, coords: [140.3188, 35.7767] }, // 나리타 공항
  { nameKo: "치바시", nameJa: "千葉市", prefectureCode: 12, coords: [140.1233, 35.6073] },

  // 13. 도쿄도 (Tokyo) - Code 13
  { nameKo: "도쿄", nameJa: "東京都", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "도쿄도", nameJa: "東京都", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "도쿄시", nameJa: "東京都", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "신주쿠구", nameJa: "新宿区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "시부야구", nameJa: "渋谷区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "시나가와구", nameJa: "品川区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "중앙구", nameJa: "中央区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "치요다구", nameJa: "千代田区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "미나토구", nameJa: "港区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "다이토구", nameJa: "台東区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "토시마구", nameJa: "豊島区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "메구로구", nameJa: "目黒区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "세타가야구", nameJa: "世田谷区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "오타구", nameJa: "大田区", prefectureCode: 13, coords: [139.6917, 35.6895] },
  { nameKo: "무사시노시", nameJa: "武蔵野市", prefectureCode: 13, coords: [139.5664, 35.7177] }, // 키치죠지
  { nameKo: "미타카시", nameJa: "三鷹市", prefectureCode: 13, coords: [139.5594, 35.6836] },

  // 14. 가나가와현 (Kanagawa) - Code 14
  { nameKo: "요코하마시", nameJa: "横浜市", prefectureCode: 14, coords: [139.638, 35.4437] },
  { nameKo: "하코네정", nameJa: "箱根町", prefectureCode: 14, coords: [139.0308, 35.2333] },
  { nameKo: "카마쿠라시", nameJa: "鎌倉市", prefectureCode: 14, coords: [139.5467, 35.3192] },
  { nameKo: "가마쿠라시", nameJa: "鎌倉市", prefectureCode: 14, coords: [139.5467, 35.3192] },
  { nameKo: "후지사와시", nameJa: "藤沢市", prefectureCode: 14, coords: [139.4886, 35.3388] }, // 에노시마
  { nameKo: "카와사키시", nameJa: "川崎市", prefectureCode: 14, coords: [139.703, 35.5308] },

  // 15. 니가타현 (Niigata) - Code 15
  { nameKo: "니가타시", nameJa: "新潟市", prefectureCode: 15, coords: [139.0236, 37.9026] },
  { nameKo: "유자와정", nameJa: "湯沢町", prefectureCode: 15, coords: [138.8094, 36.9363] },

  // 16. 도야마현 (Toyama) - Code 16
  { nameKo: "도야마시", nameJa: "富山市", prefectureCode: 16, coords: [137.2113, 36.6953] },

  // 17. 이시카와현 (Ishikawa) - Code 17
  { nameKo: "가나자와시", nameJa: "金沢市", prefectureCode: 17, coords: [136.6562, 36.5613] },
  { nameKo: "고마쓰시", nameJa: "小松市", prefectureCode: 17, coords: [136.4508, 36.4019] },
  { nameKo: "카가시", nameJa: "加賀市", prefectureCode: 17, coords: [136.2975, 36.3025] },

  // 18. 후쿠이현 (Fukui) - Code 18
  { nameKo: "후쿠이시", nameJa: "福井市", prefectureCode: 18, coords: [136.2196, 36.0652] },

  // 19. 야마나시현 (Yamanashi) - Code 19
  { nameKo: "후지요시다시", nameJa: "富士吉田市", prefectureCode: 19, coords: [138.8039, 35.4866] }, // 카와구치코/후지산
  { nameKo: "고후시", nameJa: "甲府市", prefectureCode: 19, coords: [138.5683, 35.6642] },

  // 20. 나가노현 (Nagano) - Code 20
  { nameKo: "카루이자와정", nameJa: "軽井沢町", prefectureCode: 20, coords: [138.6364, 36.3489] },
  { nameKo: "나가노시", nameJa: "長野市", prefectureCode: 20, coords: [138.1812, 36.6486] },
  { nameKo: "마츠모토시", nameJa: "松本市", prefectureCode: 20, coords: [137.972, 36.238] },

  // 21. 기후현 (Gifu) - Code 21
  { nameKo: "시라카와촌", nameJa: "白川村", prefectureCode: 21, coords: [136.9064, 36.256] },
  { nameKo: "타카야마시", nameJa: "高山市", prefectureCode: 21, coords: [137.2519, 36.1461] },
  { nameKo: "기후시", nameJa: "岐阜市", prefectureCode: 21, coords: [136.7606, 35.4233] },

  // 22. 시즈오카현 (Shizuoka) - Code 22
  { nameKo: "시즈오카시", nameJa: "静岡市", prefectureCode: 22, coords: [138.3831, 34.9756] },
  { nameKo: "하마마츠시", nameJa: "浜松市", prefectureCode: 22, coords: [137.7261, 34.7108] },
  { nameKo: "아타미시", nameJa: "熱海市", prefectureCode: 22, coords: [139.0717, 35.0964] },
  { nameKo: "이즈시", nameJa: "伊豆市", prefectureCode: 22, coords: [138.9328, 34.9742] },

  // 23. 아이치현 (Aichi) - Code 23
  { nameKo: "나고야시", nameJa: "名古屋市", prefectureCode: 23, coords: [136.9066, 35.1815] },
  { nameKo: "나가쿠테시", nameJa: "長久手市", prefectureCode: 23, coords: [137.0494, 35.1836] }, // 지브리 파크

  // 24. 미에현 (Mie) - Code 24
  { nameKo: "이세시", nameJa: "伊勢市", prefectureCode: 24, coords: [136.7092, 34.4875] },
  { nameKo: "스즈카시", nameJa: "鈴鹿市", prefectureCode: 24, coords: [136.5842, 34.8833] },

  // 25. 시가현 (Shiga) - Code 25
  { nameKo: "오츠시", nameJa: "大津市", prefectureCode: 25, coords: [135.8686, 35.0045] },
  { nameKo: "히코네시", nameJa: "彦根市", prefectureCode: 25, coords: [136.2578, 35.2744] },

  // 26. 교토부 (Kyoto) - Code 26
  { nameKo: "교토시", nameJa: "京都市", prefectureCode: 26, coords: [135.7681, 35.0116] },
  { nameKo: "우지시", nameJa: "宇治市", prefectureCode: 26, coords: [135.805, 34.8892] },
  { nameKo: "미야즈시", nameJa: "宮津市", prefectureCode: 26, coords: [135.1953, 35.5369] },

  // 27. 오사카부 (Osaka) - Code 27
  { nameKo: "오사카시", nameJa: "大阪市", prefectureCode: 27, coords: [135.5023, 34.6937] },
  { nameKo: "사카이시", nameJa: "堺市", prefectureCode: 27, coords: [135.4831, 34.5733] },
  { nameKo: "이즈미사노시", nameJa: "泉佐野市", prefectureCode: 27, coords: [135.3275, 34.4069] }, // 간사이 공항

  // 28. 효고현 (Hyogo) - Code 28
  { nameKo: "고베시", nameJa: "神戸市", prefectureCode: 28, coords: [135.1955, 34.6901] },
  { nameKo: "히메지시", nameJa: "姫路市", prefectureCode: 28, coords: [134.6908, 34.8153] },

  // 29. 나라현 (Nara) - Code 29
  { nameKo: "나라시", nameJa: "奈良市", prefectureCode: 29, coords: [135.8048, 34.6851] },

  // 30. 와카야마현 (Wakayama) - Code 30
  { nameKo: "와카야마시", nameJa: "和歌山市", prefectureCode: 30, coords: [135.1675, 34.226] },
  { nameKo: "시라하마정", nameJa: "白浜町", prefectureCode: 30, coords: [135.3475, 33.6811] },

  // 31. 돗토리현 (Tottori) - Code 31
  { nameKo: "돗토리시", nameJa: "鳥取市", prefectureCode: 31, coords: [134.235, 35.5011] },
  { nameKo: "요나고시", nameJa: "米子市", prefectureCode: 31, coords: [133.3308, 35.4281] },

  // 32. 시마네현 (Shimane) - Code 32
  { nameKo: "마츠에시", nameJa: "松江市", prefectureCode: 32, coords: [133.0506, 35.4681] },
  { nameKo: "이즈모시", nameJa: "出雲市", prefectureCode: 32, coords: [132.7547, 35.3672] },

  // 33. 오카야마현 (Okayama) - Code 33
  { nameKo: "오카야마시", nameJa: "岡山市", prefectureCode: 33, coords: [133.935, 34.6617] },
  { nameKo: "구라시키시", nameJa: "倉敷市", prefectureCode: 33, coords: [133.77, 34.585] },

  // 34. 히로시마현 (Hiroshima) - Code 34
  { nameKo: "히로시마시", nameJa: "広島市", prefectureCode: 34, coords: [132.4594, 34.3963] },
  { nameKo: "하츠카이치시", nameJa: "廿日市市", prefectureCode: 34, coords: [132.3303, 34.3517] }, // 미야지마
  { nameKo: "오노미치시", nameJa: "尾道市", prefectureCode: 34, coords: [133.2047, 34.4089] },

  // 35. 야마구치현 (Yamaguchi) - Code 35
  { nameKo: "시모노세키시", nameJa: "下関市", prefectureCode: 35, coords: [130.9412, 33.9578] },
  { nameKo: "야마구치시", nameJa: "山口市", prefectureCode: 35, coords: [131.4714, 34.1783] },

  // 36. 도쿠시마현 (Tokushima) - Code 36
  { nameKo: "도쿠시마시", nameJa: "徳島市", prefectureCode: 36, coords: [134.5594, 34.0703] },

  // 37. 카가와현 (Kagawa) - Code 37
  { nameKo: "다카마쓰시", nameJa: "高松市", prefectureCode: 37, coords: [134.0433, 34.3403] },
  { nameKo: "쇼도시마정", nameJa: "小豆島町", prefectureCode: 37, coords: [134.3, 34.4833] },

  // 38. 에히메현 (Ehime) - Code 38
  { nameKo: "마츠야마시", nameJa: "松山市", prefectureCode: 38, coords: [132.7661, 33.8417] },

  // 39. 고치현 (Kochi) - Code 39
  { nameKo: "고치시", nameJa: "高知市", prefectureCode: 39, coords: [133.5311, 33.5597] },

  // 40. 후쿠오카현 (Fukuoka) - Code 40
  { nameKo: "후쿠오카시", nameJa: "福岡市", prefectureCode: 40, coords: [130.4017, 33.5904] },
  { nameKo: "기타큐슈시", nameJa: "北九州市", prefectureCode: 40, coords: [130.8753, 33.8834] },
  { nameKo: "다자이후시", nameJa: "太宰府市", prefectureCode: 40, coords: [130.5244, 33.5133] },
  { nameKo: "야나가와시", nameJa: "柳川市", prefectureCode: 40, coords: [130.4086, 33.1642] },

  // 41. 사가현 (Saga) - Code 41
  { nameKo: "사가시", nameJa: "佐賀市", prefectureCode: 41, coords: [130.3008, 33.2636] },
  { nameKo: "우레시노시", nameJa: "嬉野市", prefectureCode: 41, coords: [129.9864, 33.1258] },
  { nameKo: "다케오시", nameJa: "武雄市", prefectureCode: 41, coords: [130.0211, 33.1947] },

  // 42. 나가사키현 (Nagasaki) - Code 42
  { nameKo: "나가사키시", nameJa: "長崎市", prefectureCode: 42, coords: [129.8736, 32.7503] },
  { nameKo: "사세보시", nameJa: "佐世保市", prefectureCode: 42, coords: [129.7153, 33.1594] },

  // 43. 구마모토현 (Kumamoto) - Code 43
  { nameKo: "구마모토시", nameJa: "熊本市", prefectureCode: 43, coords: [130.7417, 32.7897] },
  { nameKo: "아소시", nameJa: "阿蘇市", prefectureCode: 43, coords: [131.0772, 32.9392] },
  { nameKo: "미나미아소촌", nameJa: "南阿蘇村", prefectureCode: 43, coords: [131.0136, 32.8278] },

  // 44. 오이타현 (Oita) - Code 44
  { nameKo: "유후시", nameJa: "由布市", prefectureCode: 44, coords: [131.4289, 33.2567] }, // 유후인
  { nameKo: "벳푸시", nameJa: "別府市", prefectureCode: 44, coords: [131.4986, 33.2806] },
  { nameKo: "오이타시", nameJa: "大分市", prefectureCode: 44, coords: [131.6125, 33.2381] },

  // 45. 미야자키현 (Miyazaki) - Code 45
  { nameKo: "미야자키시", nameJa: "宮崎市", prefectureCode: 45, coords: [131.4239, 31.9078] },

  // 46. 가고시마현 (Kagoshima) - Code 46
  { nameKo: "가고시마시", nameJa: "鹿児島市", prefectureCode: 46, coords: [130.5572, 31.5966] },
  { nameKo: "이부스키시", nameJa: "指宿市", prefectureCode: 46, coords: [130.6433, 31.2519] },
  { nameKo: "야쿠시마정", nameJa: "屋久島町", prefectureCode: 46, coords: [130.5583, 30.3586] },

  // 47. 오키나와현 (Okinawa) - Code 47
  { nameKo: "나하시", nameJa: "那覇市", prefectureCode: 47, coords: [127.6811, 26.2125] },
  { nameKo: "차탄정", nameJa: "北谷町", prefectureCode: 47, coords: [127.7583, 26.3167] }, // 아메리칸빌리지
  { nameKo: "모토부정", nameJa: "本部町", prefectureCode: 47, coords: [127.8944, 26.6556] }, // 추라우미
  { nameKo: "이시가키시", nameJa: "石垣市", prefectureCode: 47, coords: [124.1572, 24.3447] },
  { nameKo: "미야코지마시", nameJa: "宮古島市", prefectureCode: 47, coords: [125.2811, 24.8056] },
  { nameKo: "오키나와시", nameJa: "沖縄市", prefectureCode: 47, coords: [127.8014, 26.3344] },
];

function normalizeName(str: string): string {
  return str.toLowerCase().trim().replace(/[\s\-_]/g, "").replace(/(시|구|정|촌|현|부|도)$/, "");
}

/**
 * Finds exact or fuzzy match WGS84 coordinates [longitude, latitude] for a city name and prefecture code.
 */
export function getCityCoordinates(cityNameKo: string, prefectureCode: number): [number, number] | null {
  const normInput = normalizeName(cityNameKo);
  if (!normInput) return null;

  // 1. Direct match within prefecture
  for (const entry of CITY_COORDINATES_LIST) {
    if (entry.prefectureCode === prefectureCode) {
      const normEntry = normalizeName(entry.nameKo);
      if (normInput === normEntry || normInput.includes(normEntry) || normEntry.includes(normInput)) {
        return entry.coords;
      }
    }
  }

  // 2. Cross-prefecture match fallback
  for (const entry of CITY_COORDINATES_LIST) {
    const normEntry = normalizeName(entry.nameKo);
    if (normInput === normEntry) {
      return entry.coords;
    }
  }

  return null;
}
