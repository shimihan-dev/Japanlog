export interface CityMatchResult {
  prefectureCode: number;
  prefectureNameKo: string;
  prefectureNameJa: string;
  cityNameKo: string;
  cityNameJa: string;
  matchedName: string;
  category?: string;
}

interface LandmarkEntry {
  names: string[]; // Korean, English, Japanese variations
  cityNameKo: string;
  cityNameJa: string;
  prefectureCode: number;
  category?: string;
}

// Extensive database of Japanese cities, wards, districts, and famous landmarks across all 47 prefectures
const JAPAN_LANDMARKS: LandmarkEntry[] = [
  // 1. 홋카이도 (Hokkaido) - Code 1
  { names: ["삿포로", "sapporo", "札幌", "스스키노"], cityNameKo: "삿포로시", cityNameJa: "札幌市", prefectureCode: 1, category: "주요 도시" },
  { names: ["오타루", "otaru", "小樽", "오타루 운하"], cityNameKo: "오타루시", cityNameJa: "小樽市", prefectureCode: 1, category: "주요 도시" },
  { names: ["하코다테", "hakodate", "函館"], cityNameKo: "하코다테시", cityNameJa: "函館市", prefectureCode: 1, category: "주요 도시" },
  { names: ["비에이", "biei", "美瑛", "청의 호수", "아오이이케"], cityNameKo: "비에이정", cityNameJa: "美瑛町", prefectureCode: 1, category: "관광지" },
  { names: ["후라노", "furano", "富良野", "팜토미타"], cityNameKo: "후라노시", cityNameJa: "富良野市", prefectureCode: 1, category: "관광지" },
  { names: ["노보리베츠", "noboribetsu", "登別", "지옥계곡"], cityNameKo: "노보리베츠시", cityNameJa: "登別市", prefectureCode: 1, category: "온천" },
  { names: ["아사히카와", "asahikawa", "旭川", "아사히야마 동물원"], cityNameKo: "아사히카와시", cityNameJa: "旭川市", prefectureCode: 1, category: "주요 도시" },
  { names: ["쿠시로", "kushiro", "釧路"], cityNameKo: "쿠시로시", cityNameJa: "釧路市", prefectureCode: 1, category: "주요 도시" },
  { names: ["신치토세", "chitose", "千歳", "치토세"], cityNameKo: "치토세시", cityNameJa: "千歳市", prefectureCode: 1, category: "공항/도시" },

  // 2. 아오모리현 (Aomori) - Code 2
  { names: ["아오모리", "aomori", "青森"], cityNameKo: "아오모리시", cityNameJa: "青森市", prefectureCode: 2, category: "주요 도시" },
  { names: ["히로사키", "hirosaki", "弘前"], cityNameKo: "히로사키시", cityNameJa: "弘前市", prefectureCode: 2, category: "주요 도시" },
  { names: ["하치노헤", "hachinohe", "八戸"], cityNameKo: "하치노헤시", cityNameJa: "八戸市", prefectureCode: 2, category: "주요 도시" },

  // 3. 이와테현 (Iwate) - Code 3
  { names: ["모리오카", "morioka", "盛岡"], cityNameKo: "모리오카시", cityNameJa: "盛岡市", prefectureCode: 3, category: "주요 도시" },

  // 4. 미야기현 (Miyagi) - Code 4
  { names: ["센다이", "sendai", "仙台"], cityNameKo: "센다이시", cityNameJa: "仙台市", prefectureCode: 4, category: "주요 도시" },
  { names: ["마츠시마", "matsushima", "松島"], cityNameKo: "마츠시마정", cityNameJa: "松島町", prefectureCode: 4, category: "관광지" },

  // 5. 아키타현 (Akita) - Code 5
  { names: ["아키타", "akita", "秋田"], cityNameKo: "아키타시", cityNameJa: "秋田市", prefectureCode: 5, category: "주요 도시" },
  { names: ["다카쿠라", "다자쿠라", "니우코"], cityNameKo: "다센시", cityNameJa: "大仙市", prefectureCode: 5, category: "주요 도시" },

  // 6. 야마가타현 (Yamagata) - Code 6
  { names: ["야마가타", "yamagata", "山形"], cityNameKo: "야마가타시", cityNameJa: "山形市", prefectureCode: 6, category: "주요 도시" },
  { names: ["긴잔 온천", "ginzan", "銀山温泉"], cityNameKo: "오바나자와시", cityNameJa: "尾花沢市", prefectureCode: 6, category: "온천" },

  // 7. 후쿠시마현 (Fukushima) - Code 7
  { names: ["후쿠시마", "fukushima", "福島"], cityNameKo: "후쿠시마시", cityNameJa: "福島市", prefectureCode: 7, category: "주요 도시" },
  { names: ["아이즈와카마츠", "aizuwakamatsu", "会津若松"], cityNameKo: "아이즈와카마츠시", cityNameJa: "会津若松市", prefectureCode: 7, category: "주요 도시" },

  // 8. 이바라키현 (Ibaraki) - Code 8
  { names: ["미토", "mito", "水戸"], cityNameKo: "미토시", cityNameJa: "水戸市", prefectureCode: 8, category: "주요 도시" },

  // 9. 토치기현 (Tochigi) - Code 9
  { names: ["닛코", "nikko", "日光"], cityNameKo: "닛코시", cityNameJa: "日光市", prefectureCode: 9, category: "관광지" },
  { names: ["우츠노미야", "utsunomiya", "宇都宮"], cityNameKo: "우츠노미야시", cityNameJa: "宇都宮市", prefectureCode: 9, category: "주요 도시" },

  // 10. 군마현 (Gunma) - Code 10
  { names: ["쿠사츠", "kusatsu", "草津", "쿠사츠 온천"], cityNameKo: "쿠사츠정", cityNameJa: "草津町", prefectureCode: 10, category: "온천" },
  { names: ["마에바시", "maebashi", "前橋"], cityNameKo: "마에바시시", cityNameJa: "前橋市", prefectureCode: 10, category: "주요 도시" },
  { names: ["다카사키", "takasaki", "高崎"], cityNameKo: "다카사키시", cityNameJa: "高崎市", prefectureCode: 10, category: "주요 도시" },

  // 11. 사이타마현 (Saitama) - Code 11
  { names: ["사이타마", "saitama", "さいたま"], cityNameKo: "사이타마시", cityNameJa: "さいたま市", prefectureCode: 11, category: "주요 도시" },
  { names: ["카와고에", "kawagoe", "川越", "작은 도쿄"], cityNameKo: "카와고에시", cityNameJa: "川越市", prefectureCode: 11, category: "관광지" },

  // 12. 치바현 (Chiba) - Code 12
  { names: ["디즈니랜드", "디즈니씨", "disneyland", "disneysea", "우라야스"], cityNameKo: "우라야스시", cityNameJa: "浦安市", prefectureCode: 12, category: "테마파크" },
  { names: ["나리타", "narita", "成田", "나리타 공항"], cityNameKo: "나리타시", cityNameJa: "成田市", prefectureCode: 12, category: "공항/도시" },
  { names: ["치바", "chiba", "千葉"], cityNameKo: "치바시", cityNameJa: "千葉市", prefectureCode: 12, category: "주요 도시" },

  // 13. 도쿄도 (Tokyo) - Code 13
  { names: ["신주쿠", "shinjuku", "新宿"], cityNameKo: "신주쿠구", cityNameJa: "新宿区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["시부야", "shibuya", "渋谷", "하치코"], cityNameKo: "시부야구", cityNameJa: "渋谷区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["시나가와", "shinagawa", "品川"], cityNameKo: "시나가와구", cityNameJa: "品川区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["긴자", "ginza", "銀座", "츠키지", "중구"], cityNameKo: "중앙구", cityNameJa: "中央区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["아키하바라", "akihabara", "도쿄역", "치요다"], cityNameKo: "치요다구", cityNameJa: "千代田区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["롯폰기", "roppongi", "도쿄타워", "오다이바", "미나토"], cityNameKo: "미나토구", cityNameJa: "港区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["아사쿠사", "asakusa", "우에노", "ueno", "스카이트리"], cityNameKo: "다이토구", cityNameJa: "台東区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["이케부쿠로", "ikebukuro", "池袋"], cityNameKo: "토시마구", cityNameJa: "豊島区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["메구로", "meguro", "目黒"], cityNameKo: "메구로구", cityNameJa: "目黒区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["세타가야", "setagaya", "世田谷", "시모키타자와"], cityNameKo: "세타가야구", cityNameJa: "世田谷区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["하네다", "haneda", "하네다 공항", "오타구"], cityNameKo: "오타구", cityNameJa: "大田区", prefectureCode: 13, category: "도쿄 23구/공항" },
  { names: ["나카노", "nakano", "中野"], cityNameKo: "나카노구", cityNameJa: "中野区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["스기나미", "suginami", "杉並", "고엔지"], cityNameKo: "스기나미구", cityNameJa: "杉並区", prefectureCode: 13, category: "도쿄 23구" },
  { names: ["키치죠지", "kichijoji", "무사시노", "지브리 미술관"], cityNameKo: "무사시노시", cityNameJa: "武蔵野市", prefectureCode: 13, category: "도쿄 다마지역" },
  { names: ["미타카", "mitaka", "三鷹"], cityNameKo: "미타카시", cityNameJa: "三鷹市", prefectureCode: 13, category: "도쿄 다마지역" },
  { names: ["하치오지", "hachioji", "타카오산"], cityNameKo: "하치오지시", cityNameJa: "八王子市", prefectureCode: 13, category: "도쿄 다마지역" },

  // 14. 가나가와현 (Kanagawa) - Code 14
  { names: ["요코하마", "yokohama", "横浜", "미나토미라이"], cityNameKo: "요코하마시", cityNameJa: "横浜市", prefectureCode: 14, category: "주요 도시" },
  { names: ["하코네", "hakone", "箱根", "하코네 온천"], cityNameKo: "하코네정", cityNameJa: "箱根町", prefectureCode: 14, category: "온천/관광지" },
  { names: ["카마쿠라", "kamakura", "鎌倉", "슬램덩크"], cityNameKo: "카마쿠라시", cityNameJa: "鎌倉市", prefectureCode: 14, category: "관광지" },
  { names: ["에노시마", "enoshima", "江の島"], cityNameKo: "후지사와시", cityNameJa: "藤沢市", prefectureCode: 14, category: "관광지" },
  { names: ["카와사키", "kawasaki", "川崎"], cityNameKo: "카와사키시", cityNameJa: "川崎市", prefectureCode: 14, category: "주요 도시" },

  // 15. 니가타현 (Niigata) - Code 15
  { names: ["니가타", "niigata", "新潟"], cityNameKo: "니가타시", cityNameJa: "新潟市", prefectureCode: 15, category: "주요 도시" },
  { names: ["에치고유자와", "yuzawa", "湯沢", "갈라유자와"], cityNameKo: "유자와정", cityNameJa: "湯沢町", prefectureCode: 15, category: "스키/온천" },

  // 16. 도야마현 (Toyama) - Code 16
  { names: ["도야마", "toyama", "富山", "알펜루트"], cityNameKo: "도야마시", cityNameJa: "富山市", prefectureCode: 16, category: "주요 도시" },

  // 17. 이시카와현 (Ishikawa) - Code 17
  { names: ["가나자와", "kanazawa", "金沢", "켄로쿠엔"], cityNameKo: "가나자와시", cityNameJa: "金沢市", prefectureCode: 17, category: "주요 도시" },

  // 18. 후쿠이현 (Fukui) - Code 18
  { names: ["후쿠이", "fukui", "福井"], cityNameKo: "후쿠이시", cityNameJa: "福井市", prefectureCode: 18, category: "주요 도시" },

  // 19. 야마나시현 (Yamanashi) - Code 19
  { names: ["후지산", "fuji", "카와구치코", "kawaguchiko", "후지요시다"], cityNameKo: "후지요시다시", cityNameJa: "富士吉田市", prefectureCode: 19, category: "관광지" },
  { names: ["고후", "kofu", "甲府"], cityNameKo: "고후시", cityNameJa: "甲府市", prefectureCode: 19, category: "주요 도시" },

  // 20. 나가노현 (Nagano) - Code 20
  { names: ["카루이자와", "karuizawa", "軽井沢"], cityNameKo: "카루이자와정", cityNameJa: "軽井沢町", prefectureCode: 20, category: "휴양지" },
  { names: ["나가노", "nagano", "長野"], cityNameKo: "나가노시", cityNameJa: "長野市", prefectureCode: 20, category: "주요 도시" },
  { names: ["마츠모토", "matsumoto", "松本"], cityNameKo: "마츠모토시", cityNameJa: "松本市", prefectureCode: 20, category: "주요 도시" },

  // 21. 기후현 (Gifu) - Code 21
  { names: ["시라카와고", "shirakawago", "白川郷"], cityNameKo: "시라카와촌", cityNameJa: "白川村", prefectureCode: 21, category: "유네스코 유산" },
  { names: ["타카야마", "takayama", "高山"], cityNameKo: "타카야마시", cityNameJa: "高山市", prefectureCode: 21, category: "관광지" },
  { names: ["기후", "gifu", "岐阜"], cityNameKo: "기후시", cityNameJa: "岐阜市", prefectureCode: 21, category: "주요 도시" },

  // 22. 시즈오카현 (Shizuoka) - Code 22
  { names: ["시즈오카", "shizuoka", "静岡"], cityNameKo: "시즈오카시", cityNameJa: "静岡市", prefectureCode: 22, category: "주요 도시" },
  { names: ["하마마츠", "hamamatsu", "浜松"], cityNameKo: "하마마츠시", cityNameJa: "浜松市", prefectureCode: 22, category: "주요 도시" },
  { names: ["아타미", "atami", "熱海", "아타미 온천"], cityNameKo: "아타미시", cityNameJa: "熱海市", prefectureCode: 22, category: "온천" },
  { names: ["이즈", "izu", "伊豆"], cityNameKo: "이즈시", cityNameJa: "伊豆市", prefectureCode: 22, category: "휴양지" },

  // 23. 아이치현 (Aichi) - Code 23
  { names: ["나고야", "nagoya", "名古屋", "사카에"], cityNameKo: "나고야시", cityNameJa: "名古屋市", prefectureCode: 23, category: "주요 도시" },
  { names: ["지브리파크", "ghibli park", "나가쿠테"], cityNameKo: "나가쿠테시", cityNameJa: "長久手市", prefectureCode: 23, category: "테마파크" },

  // 24. 미에현 (Mie) - Code 24
  { names: ["이세", "ise", "伊勢", "이세 신궁"], cityNameKo: "이세시", cityNameJa: "伊勢市", prefectureCode: 24, category: "관광지" },
  { names: ["나고시마", "나가시마", "스즈카"], cityNameKo: "스즈카시", cityNameJa: "鈴鹿市", prefectureCode: 24, category: "주요 도시" },

  // 25. 시가현 (Shiga) - Code 25
  { names: ["비와호", "biwako", "오츠", "otsu", "大津"], cityNameKo: "오츠시", cityNameJa: "大津市", prefectureCode: 25, category: "주요 도시" },
  { names: ["히코네", "hikone", "彦根"], cityNameKo: "히코네시", cityNameJa: "彦根市", prefectureCode: 25, category: "관광지" },

  // 26. 교토부 (Kyoto) - Code 26
  { names: ["교토", "kyoto", "京都", "청수사", "키요미즈데라", "아라시야마", "기온", "후시미이나리"], cityNameKo: "교토시", cityNameJa: "京都市", prefectureCode: 26, category: "주요 도시/관광지" },
  { names: ["우지", "uji", "宇治", "말차"], cityNameKo: "우지시", cityNameJa: "宇治市", prefectureCode: 26, category: "관광지" },
  { names: ["아마노하사다테", "amanohashidate", "미야즈"], cityNameKo: "미야즈시", cityNameJa: "宮津市", prefectureCode: 26, category: "관광지" },

  // 27. 오사카부 (Osaka) - Code 27
  { names: ["오사카", "osaka", "大阪", "도톤보리", "난바", "우메다", "신사이바시"], cityNameKo: "오사카시", cityNameJa: "大阪市", prefectureCode: 27, category: "주요 도시" },
  { names: ["유니버설 스튜디오", "usj", "universal studios"], cityNameKo: "오사카시 (USJ)", cityNameJa: "大阪市", prefectureCode: 27, category: "테마파크" },
  { names: ["사카이", "sakai", "堺"], cityNameKo: "사카이시", cityNameJa: "堺市", prefectureCode: 27, category: "주요 도시" },
  { names: ["간사이 공항", "kanku", "이즈미사노"], cityNameKo: "이즈미사노시", cityNameJa: "泉佐野市", prefectureCode: 27, category: "공항/도시" },

  // 28. 효고현 (Hyogo) - Code 28
  { names: ["고베", "kobe", "神戸", "하버랜드"], cityNameKo: "고베시", cityNameJa: "神戸市", prefectureCode: 28, category: "주요 도시" },
  { names: ["히메지", "himeji", "姫路", "히메지성"], cityNameKo: "히메지시", cityNameJa: "姫路市", prefectureCode: 28, category: "관광지" },
  { names: ["아리마 온천", "arima", "有馬温泉"], cityNameKo: "고베시 (아리마)", cityNameJa: "神戸市", prefectureCode: 28, category: "온천" },

  // 29. 나라현 (Nara) - Code 29
  { names: ["나라", "nara", "奈良", "나라 사슴공원", "도다이지"], cityNameKo: "나라시", cityNameJa: "奈良市", prefectureCode: 29, category: "주요 도시/관광지" },

  // 30. 와카야마현 (Wakayama) - Code 30
  { names: ["와카야마", "wakayama", "和歌山"], cityNameKo: "와카야마시", cityNameJa: "和歌山市", prefectureCode: 30, category: "주요 도시" },
  { names: ["시라하마", "shirahama", "白浜"], cityNameKo: "시라하마정", cityNameJa: "白浜町", prefectureCode: 30, category: "휴양/온천" },

  // 31. 돗토리현 (Tottori) - Code 31
  { names: ["돗토리", "tottori", "鳥取", "돗토리 사구"], cityNameKo: "돗토리시", cityNameJa: "鳥取市", prefectureCode: 31, category: "주요 도시/관광지" },
  { names: ["요나고", "yonago", "米子"], cityNameKo: "요나고시", cityNameJa: "米子市", prefectureCode: 31, category: "주요 도시" },

  // 32. 시마네현 (Shimane) - Code 32
  { names: ["마츠에", "matsue", "松江"], cityNameKo: "마츠에시", cityNameJa: "松江市", prefectureCode: 32, category: "주요 도시" },
  { names: ["이즈모", "izumo", "出雲"], cityNameKo: "이즈모시", cityNameJa: "出雲市", prefectureCode: 32, category: "관광지" },

  // 33. 오카야마현 (Okayama) - Code 33
  { names: ["오카야마", "okayama", "岡山"], cityNameKo: "오카야마시", cityNameJa: "岡山市", prefectureCode: 33, category: "주요 도시" },
  { names: ["구라시키", "kurashiki", "倉敷", "구라시키 미관지구"], cityNameKo: "구라시키시", cityNameJa: "倉敷市", prefectureCode: 33, category: "관광지" },

  // 34. 히로시마현 (Hiroshima) - Code 34
  { names: ["히로시마", "hiroshima", "広島"], cityNameKo: "히로시마시", cityNameJa: "広島市", prefectureCode: 34, category: "주요 도시" },
  { names: ["미야지마", "miyajima", "이츠쿠시마", "하츠카이치"], cityNameKo: "하츠카이치시", cityNameJa: "廿日市市", prefectureCode: 34, category: "유네스코 유산" },
  { names: ["오노미치", "onomichi", "尾道"], cityNameKo: "오노미치시", cityNameJa: "尾道市", prefectureCode: 34, category: "관광지" },

  // 35. 야마구치현 (Yamaguchi) - Code 35
  { names: ["시모노세키", "shimonoseki", "下関"], cityNameKo: "시모노세키시", cityNameJa: "下関市", prefectureCode: 35, category: "주요 도시" },
  { names: ["야마구치", "yamaguchi", "山口"], cityNameKo: "야마구치시", cityNameJa: "山口市", prefectureCode: 35, category: "주요 도시" },

  // 36. 도쿠시마현 (Tokushima) - Code 36
  { names: ["도쿠시마", "tokushima", "徳島"], cityNameKo: "도쿠시마시", cityNameJa: "徳島市", prefectureCode: 36, category: "주요 도시" },

  // 37. 카가와현 (Kagawa) - Code 37
  { names: ["다카마쓰", "takamatsu", "高松", "사누키 우동"], cityNameKo: "다카마쓰시", cityNameJa: "高松市", prefectureCode: 37, category: "주요 도시" },
  { names: ["쇼도시마", "shodoshima", "小豆島"], cityNameKo: "쇼도시마정", cityNameJa: "小豆島町", prefectureCode: 37, category: "관광지" },

  // 38. 에히메현 (Ehime) - Code 38
  { names: ["마츠야마", "matsuyama", "松山", "도고 온천"], cityNameKo: "마츠야마시", cityNameJa: "松山市", prefectureCode: 38, category: "주요 도시/온천" },

  // 39. 고치현 (Kochi) - Code 39
  { names: ["고치", "kochi", "高知"], cityNameKo: "고치시", cityNameJa: "高知市", prefectureCode: 39, category: "주요 도시" },

  // 40. 후쿠오카현 (Fukuoka) - Code 40
  { names: ["후쿠오카", "fukuoka", "福岡", "하카타", "hakata", "텐진"], cityNameKo: "후쿠오카시", cityNameJa: "福岡市", prefectureCode: 40, category: "주요 도시" },
  { names: ["기타큐슈", "kitakyushu", "北九州", "고쿠라", "모지코"], cityNameKo: "기타큐슈시", cityNameJa: "北九州市", prefectureCode: 40, category: "주요 도시" },
  { names: ["다자이후", "dazaifu", "太宰府"], cityNameKo: "다자이후시", cityNameJa: "太宰府市", prefectureCode: 40, category: "관광지" },
  { names: ["야나가와", "yanagawa", "柳川"], cityNameKo: "야나가와시", cityNameJa: "柳川市", prefectureCode: 40, category: "관광지" },

  // 41. 사가현 (Saga) - Code 41
  { names: ["사가", "saga", "佐賀"], cityNameKo: "사가시", cityNameJa: "佐賀市", prefectureCode: 41, category: "주요 도시" },
  { names: ["우레시노", "ureshino", "嬉野", "우레시노 온천"], cityNameKo: "우레시노시", cityNameJa: "嬉野市", prefectureCode: 41, category: "온천" },
  { names: ["다케오", "takeo", "武雄"], cityNameKo: "다케오시", cityNameJa: "武雄市", prefectureCode: 41, category: "온천" },

  // 42. 나가사키현 (Nagasaki) - Code 42
  { names: ["나가사키", "nagasaki", "長崎", "하우스텐보스"], cityNameKo: "나가사키시", cityNameJa: "長崎市", prefectureCode: 42, category: "주요 도시" },
  { names: ["사세보", "sasebo", "佐世保"], cityNameKo: "사세보시", cityNameJa: "佐世保市", prefectureCode: 42, category: "주요 도시" },

  // 43. 구마모토현 (Kumamoto) - Code 43
  { names: ["구마모토", "kumamoto", "熊本", "쿠마몬", "구마모토성"], cityNameKo: "구마모토시", cityNameJa: "熊本市", prefectureCode: 43, category: "주요 도시" },
  { names: ["아소", "aso", "阿蘇", "아소산"], cityNameKo: "아소시", cityNameJa: "阿蘇市", prefectureCode: 43, category: "관광지" },
  { names: ["쿠로카와 온천", "kurokawa", "黒川温泉"], cityNameKo: "미나미아소촌", cityNameJa: "南阿蘇村", prefectureCode: 43, category: "온천" },

  // 44. 오이타현 (Oita) - Code 44
  { names: ["유후인", "yufuin", "由布院", "湯布院", "유후"], cityNameKo: "유후시", cityNameJa: "由布市", prefectureCode: 44, category: "온천" },
  { names: ["벳푸", "beppu", "別府", "지옥온천"], cityNameKo: "벳푸시", cityNameJa: "別府市", prefectureCode: 44, category: "온천" },
  { names: ["오이타", "oita", "大分"], cityNameKo: "오이타시", cityNameJa: "大分市", prefectureCode: 44, category: "주요 도시" },

  // 45. 미야자키현 (Miyazaki) - Code 45
  { names: ["미야자키", "miyazaki", "宮崎", "타카치호"], cityNameKo: "미야자키시", cityNameJa: "宮崎市", prefectureCode: 45, category: "주요 도시" },

  // 46. 가고시마현 (Kagoshima) - Code 46
  { names: ["가고시마", "kagoshima", "鹿児島", "사쿠라지마"], cityNameKo: "가고시마시", cityNameJa: "鹿児島市", prefectureCode: 46, category: "주요 도시" },
  { names: ["이부스키", "ibusuki", "指宿", "검은모래 온천"], cityNameKo: "이부스키시", cityNameJa: "指宿市", prefectureCode: 46, category: "온천" },
  { names: ["야쿠시마", "yakushima", "屋久島"], cityNameKo: "야쿠시마정", cityNameJa: "屋久島町", prefectureCode: 46, category: "유네스코 유산" },

  // 47. 오키나와현 (Okinawa) - Code 47
  { names: ["나하", "naha", "那覇", "국제거리"], cityNameKo: "나하시", cityNameJa: "那覇市", prefectureCode: 47, category: "주요 도시" },
  { names: ["아메리칸빌리지", "american village", "차탄"], cityNameKo: "차탄정", cityNameJa: "北谷町", prefectureCode: 47, category: "관광지" },
  { names: ["추라우미", "churaumi", "모토부"], cityNameKo: "모토부정", cityNameJa: "本部町", prefectureCode: 47, category: "관광지" },
  { names: ["이시가키", "ishigaki", "石垣"], cityNameKo: "이시가키시", cityNameJa: "石垣市", prefectureCode: 47, category: "휴양지" },
  { names: ["미야코지마", "miyakojima", "宮古島"], cityNameKo: "미야코지마시", cityNameJa: "宮古島市", prefectureCode: 47, category: "휴양지" },
  { names: ["오키나와", "okinawa", "沖縄"], cityNameKo: "오키나와시", cityNameJa: "沖縄市", prefectureCode: 47, category: "주요 도시" }
];

import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";

/**
 * Intelligent matcher for Japanese query -> Prefecture & City Match
 */
export function findMatchingCity(query: string): CityMatchResult | null {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, "");
  if (!normalized) return null;

  // 1. Direct landmark/alias match
  for (const entry of JAPAN_LANDMARKS) {
    for (const name of entry.names) {
      const normName = name.toLowerCase().replace(/\s+/g, "");
      if (normalized === normName || normalized.includes(normName) || normName.includes(normalized)) {
        const pref = PREFECTURE_MAP_BY_CODE.get(entry.prefectureCode);
        if (pref) {
          return {
            prefectureCode: entry.prefectureCode,
            prefectureNameKo: pref.nameKo,
            prefectureNameJa: pref.nameJa,
            cityNameKo: entry.cityNameKo,
            cityNameJa: entry.cityNameJa,
            matchedName: name,
            category: entry.category,
          };
        }
      }
    }
  }

  // 2. Prefecture Name Fallback Match
  const allPrefs = Array.from(PREFECTURE_MAP_BY_CODE.values());
  for (const pref of allPrefs) {
    const normKo = pref.nameKo.toLowerCase().replace(/현|부|도$/, "");
    const normJa = pref.nameJa.toLowerCase();
    if (normalized.includes(normKo) || normalized.includes(normJa) || normKo.includes(normalized)) {
      return {
        prefectureCode: pref.code,
        prefectureNameKo: pref.nameKo,
        prefectureNameJa: pref.nameJa,
        cityNameKo: query.trim(),
        cityNameJa: "",
        matchedName: pref.nameKo,
        category: "직접 입력",
      };
    }
  }

  return null;
}

/**
 * Search autocomplete suggestions for live input preview
 */
export function searchCitySuggestions(query: string, maxResults = 5): CityMatchResult[] {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, "");
  if (!normalized) return [];

  const results: CityMatchResult[] = [];
  const seenPrefectureCity = new Set<string>();

  for (const entry of JAPAN_LANDMARKS) {
    for (const name of entry.names) {
      const normName = name.toLowerCase().replace(/\s+/g, "");
      if (normName.includes(normalized) || normalized.includes(normName)) {
        const pref = PREFECTURE_MAP_BY_CODE.get(entry.prefectureCode);
        if (pref) {
          const key = `${entry.prefectureCode}-${entry.cityNameKo}`;
          if (!seenPrefectureCity.has(key)) {
            seenPrefectureCity.add(key);
            results.push({
              prefectureCode: entry.prefectureCode,
              prefectureNameKo: pref.nameKo,
              prefectureNameJa: pref.nameJa,
              cityNameKo: entry.cityNameKo,
              cityNameJa: entry.cityNameJa,
              matchedName: name,
              category: entry.category,
            });
            if (results.length >= maxResults) return results;
          }
        }
      }
    }
  }

  return results;
}
