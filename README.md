# 🇯🇵 Japanlog - 일본 방문 지도 웹앱 (Japan Travel Map)

React와 TypeScript, Vite, Tailwind CSS 및 `d3-geo`를 사용하여 47개 도도부현의 방문 및 경유 상태를 기록하고 시각화하는 반응형 웹 애플리케이션입니다.

---

## 🚀 1. 실행 방법

```bash
# 디렉토리 이동
cd /Users/ihanshim/.gemini/antigravity-ide/scratch/japan-travel-map

# 개발 서버 실행
npm run dev

# 프로덕션 빌드 및 타입 검사
npm run build
```

---

## 🗺️ 2. 지도 데이터 출처 및 라이선스 (Crucial)

- **지도 데이터 출처**: [`dataofjapan/land`](https://github.com/dataofjapan/land) (`japan.geojson`)
- **원천 데이터 제공**: 일본 국토교통성(MLIT, Ministry of Land, Infrastructure, Transport and Tourism) 국토정의정보(National Land Numerical Information)
- **라이선스**: Public Domain / MLIT Usage Terms Compliant
- **특징**: 임의로 생성한 가짜 경계가 아닌, 47개 도도부현(JIS X 0401 코드 1~47)에 대한 정확한 멀티폴리곤(MultiPolygon) 벡터 좌표 데이터를 사용합니다.

---

## 🧱 3. 주요 컴포넌트 구조

```text
src/
├── components/
│   ├── Header.tsx                # 상단 헤더 & 샘플 데이터/초기화 버튼
│   ├── StatsCards.tsx            # 통계 카드 4종 (방문, 경유, 도시 수, 달성률)
│   ├── JapanMap.tsx              # d3-geo 기반 47개 도도부현 SVG 지도, 툴팁, 사선패턴
│   ├── MapLegend.tsx             # 지도 범례 (방문, 경유 사선, 미방문)
│   ├── PrefectureList.tsx        # 좌측 방문/경유 현 목록 (탭, 정렬 옵션)
│   ├── RecentVisits.tsx          # 좌측 하단 최근 추가/수정된 도시 목록
│   ├── PrefectureDetailPanel.tsx # 우측 상세 패널 (상태 변경, 방문 도시 CRUD, 정보 메모)
│   ├── StatusSelector.tsx        # 세그먼트 컨트롤 형태의 상태 토글
│   ├── CityVisitList.tsx         # 등록된 방문 도시 리스트
│   ├── CityVisitForm.tsx         # 도시 추가/수정 입력 폼
│   └── ConfirmModal.tsx          # 미방문 전환/전체 초기화 경고 확인 모달
├── data/
│   └── prefectures.ts            # 47개 도도부현 기본 메타 데이터 (코드, 한글/일어 명칭, 지역)
├── hooks/
│   └── useTravelRecords.ts       # 여행 기록 React hook (localStorage 동기화 및 CRUD)
├── types/
│   └── travel.ts                 # TypeScript 타입 정의 (VisitStatus, CityVisit, Record Map)
├── utils/
│   ├── statistics.ts             # 방문 달성률 및 도시 통계 유틸리티
│   └── storage.ts                # localStorage I/O 및 12개 현 샘플 프리셋 로더
├── App.tsx                       # 메인 반응형 대시보드 레이아웃
└── main.tsx
```

---

## 💾 4. localStorage 데이터 구조

저장소 키: `japan-travel-map-records`

```json
{
  "40": {
    "prefectureCode": 40,
    "status": "visited",
    "cities": [
      {
        "id": "city-1722923000-abc",
        "cityNameKo": "후쿠오카",
        "cityNameJa": "福岡市",
        "visitedAt": "2026.08",
        "notes": "하카타 라멘 투어"
      },
      {
        "id": "city-1722923100-def",
        "cityNameKo": "기타큐슈",
        "cityNameJa": "北九州市",
        "visitedAt": "2026.08"
      }
    ],
    "firstVisitedAt": "2026.08.02",
    "lastVisitedAt": "2026.08.02",
    "visitCount": 1,
    "notes": "후쿠오카현 2개 도시 방문",
    "updatedAt": "2026-08-06T05:54:00.000Z"
  }
}
```

---

## ⚡ 5. 향후 Supabase(백엔드) 이전 가이드

현재 아키텍처는 UI 컴포넌트와 데이터 로직이 `useTravelRecords` 커스텀 훅 및 `storage.ts` 유틸로 엄격히 분리되어 있어, Supabase 도입 시 UI 변경 없이 손쉽게 교체할 수 있습니다.

### 변경할 부분

1. **테이블 설계 (Supabase PostgreSQL)**
   - `prefecture_records` 테이블: `user_id`, `prefecture_code`, `status`, `first_visited_at`, `last_visited_at`, `visit_count`, `notes`, `updated_at`
   - `city_visits` 테이블: `id`, `prefecture_code`, `user_id`, `city_name_ko`, `city_name_ja`, `visited_at`, `notes`

2. **Hook 교체 (`useTravelRecords.ts`)**
   - `storage.ts` 대신 `@supabase/supabase-js` 클라이언트를 호출하도록 변경.
   - `useEffect` 내에서 Supabase `select`로 initial load.
   - `updateStatus`, `addCity`, `deleteCity` 발생 시 Supabase `upsert` / `delete` 쿼리 실행.

