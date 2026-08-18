import React, { useEffect, useState, useMemo, useRef } from "react";
import * as d3Geo from "d3-geo";
import type { TravelRecordsMap, VisitStatus, Trip } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { SHINKANSEN_LINES } from "../data/shinkansenRoutes";
import { MapLegend } from "./MapLegend";
import { X, Train, ZoomIn, ZoomOut, RotateCcw, MapPin, Luggage } from "lucide-react";
import { getCityCoordinates } from "../data/cityCoordinates";
import { getCityVisitHistory } from "../utils/visitHistory";

interface JapanMapProps {
  records: TravelRecordsMap;
  selectedCode: number | null;
  selectedRegion?: string | null;
  selectedTrip?: Trip | null;
  trips?: Trip[];
  onSelectPrefecture: (code: number) => void;
  onClearRegion?: () => void;
  onClearTrip?: () => void;
  isDarkMode?: boolean;
}

interface GeoFeature {
  type: string;
  properties: {
    id: number;
    nam?: string;
    nam_ja?: string;
  };
  geometry: any;
}

// Explicit, precise mainland WGS84 coordinates for all 47 Japanese prefectures to prevent island-distorted centroids
const PREFECTURE_MAINLAND_COORDS: Record<number, [number, number]> = {
  1: [142.50, 43.60],  // 홋카이도
  2: [140.75, 40.80],  // 아오모리현
  3: [141.30, 39.50],  // 이와테현
  4: [140.92, 38.30],  // 미야기현
  5: [140.30, 39.70],  // 아키타현
  6: [140.05, 38.40],  // 야마가타현
  7: [140.40, 37.40],  // 후쿠시마현
  8: [140.40, 36.35],  // 이바라키현
  9: [139.80, 36.60],  // 토치기현
  10: [139.00, 36.50], // 군마현
  11: [139.30, 35.95], // 사이타마현
  12: [140.20, 35.45], // 치바현
  13: [139.50, 35.68], // 도쿄도
  14: [139.30, 35.40], // 가나가와현
  15: [138.90, 37.45], // 니가타현
  16: [137.15, 36.65], // 도야마현
  17: [136.70, 36.80], // 이시카와현
  18: [136.15, 35.90], // 후쿠이현
  19: [138.60, 35.60], // 야마나시현
  20: [138.00, 36.10], // 나가노현
  21: [137.00, 35.70], // 기후현
  22: [138.30, 35.00], // 시즈오카현
  23: [137.00, 35.05], // 아이치현
  24: [136.40, 34.50], // 미에현
  25: [136.15, 35.20], // 시가현
  26: [135.55, 35.25], // 교토부
  27: [135.50, 34.65], // 오사카부
  28: [134.80, 35.10], // 효고현
  29: [135.80, 34.40], // 나라현
  30: [135.35, 33.90], // 와카야마현
  31: [133.80, 35.40], // 돗토리현
  32: [132.70, 35.00], // 시마네현
  33: [133.90, 34.80], // 오카야마현
  34: [132.60, 34.50], // 히로시마현
  35: [131.50, 34.15], // 야마구치현
  36: [134.30, 33.90], // 도쿠시마현
  37: [134.00, 34.25], // 카가와현
  38: [132.80, 33.75], // 에히메현
  39: [133.30, 33.50], // 고치현
  40: [130.55, 33.55], // 후쿠오카현
  41: [130.15, 33.25], // 사가현
  42: [129.88, 32.75], // 나가사키현
  43: [130.72, 32.68], // 구마모토현
  44: [131.45, 33.20], // 오이타현
  45: [131.35, 32.10], // 미야자키현
  46: [130.50, 31.60], // 가고시마현
  47: [127.90, 26.50], // 오키나와현
};

export const JapanMap: React.FC<JapanMapProps> = ({
  records,
  selectedCode,
  selectedRegion = null,
  selectedTrip = null,
  trips = [],
  onSelectPrefecture,
  onClearRegion,
  onClearTrip,
  isDarkMode = false,
}) => {
  const [geoFeatures, setGeoFeatures] = useState<GeoFeature[]>([]);
  const [hoveredCode, setHoveredCode] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [showShinkansen, setShowShinkansen] = useState<boolean>(true);
  const [showCityPins, setShowCityPins] = useState<boolean>(true);
  const [hoveredCityPin, setHoveredCityPin] = useState<{
    id: string;
    cityNameKo: string;
    cityNameJa?: string;
    visitedAt?: string;
    notes?: string;
    prefectureCode: number;
    prefectureNameKo: string;
    px: number;
    py: number;
    visitCount: number;
    history: any[];
  } | null>(null);
  const [cityPinTooltipPos, setCityPinTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = () => {
    const oldZoom = zoom;
    const newZoom = Math.min(5, Math.round((oldZoom + 0.25) * 100) / 100);
    if (newZoom === oldZoom) return;
    const scaleRatio = newZoom / oldZoom;
    setZoom(newZoom);
    setPan((prev) => ({
      x: Math.round(425 - (425 - prev.x) * scaleRatio),
      y: Math.round(460 - (460 - prev.y) * scaleRatio),
    }));
  };

  const handleZoomOut = () => {
    const oldZoom = zoom;
    const newZoom = Math.max(1, Math.round((oldZoom - 0.25) * 100) / 100);
    if (newZoom === 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }
    const scaleRatio = newZoom / oldZoom;
    setZoom(newZoom);
    setPan((prev) => ({
      x: Math.round(425 - (425 - prev.x) * scaleRatio),
      y: Math.round(460 - (460 - prev.y) * scaleRatio),
    }));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Cursor-Centered Wheel Zoom Handler (Figma & Google Maps style - Pure (0,0) origin)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!mapContainerRef.current) return;

    const bounds = mapContainerRef.current.getBoundingClientRect();
    // SVG viewBox scale ratio for container vs viewBox 850x920
    const viewBoxX = ((e.clientX - bounds.left) / bounds.width) * 850;
    const viewBoxY = ((e.clientY - bounds.top) / bounds.height) * 920;

    const zoomStep = e.deltaY < 0 ? 0.2 : -0.2;
    const oldZoom = zoom;
    const newZoom = Math.min(5, Math.max(1, Math.round((oldZoom + zoomStep) * 100) / 100));

    if (newZoom === oldZoom) return;

    if (newZoom === 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }

    const scaleRatio = newZoom / oldZoom;
    const newPanX = Math.round(viewBoxX - (viewBoxX - pan.x) * scaleRatio);
    const newPanY = Math.round(viewBoxY - (viewBoxY - pan.y) * scaleRatio);

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  // Double-Click Zoom In centered on click location
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!mapContainerRef.current) return;
    const bounds = mapContainerRef.current.getBoundingClientRect();
    const viewBoxX = ((e.clientX - bounds.left) / bounds.width) * 850;
    const viewBoxY = ((e.clientY - bounds.top) / bounds.height) * 920;

    const oldZoom = zoom;
    const newZoom = Math.min(5, Math.round((oldZoom * 1.5) * 100) / 100);
    if (newZoom === oldZoom) return;

    const scaleRatio = newZoom / oldZoom;
    const newPanX = Math.round(viewBoxX - (viewBoxX - pan.x) * scaleRatio);
    const newPanY = Math.round(viewBoxY - (viewBoxY - pan.y) * scaleRatio);

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on primary left click
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMoveMap = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    }
  };

  const handleMouseUpMap = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Touch Drag Handlers for Mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current && e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  const handleCityPinHover = (e: React.MouseEvent, pin: any) => {
    if (!mapContainerRef.current) return;
    const containerBounds = mapContainerRef.current.getBoundingClientRect();
    const rawX = e.clientX - containerBounds.left;
    const rawY = e.clientY - containerBounds.top;

    const clampedX = Math.max(90, Math.min(containerBounds.width - 90, rawX));
    const clampedY = Math.max(60, rawY - 10);

    setCityPinTooltipPos({ x: clampedX, y: clampedY });
    setHoveredCityPin(pin);
  };

  // Camera Auto-Focus when Region is selected
  useEffect(() => {
    if (!selectedRegion) {
      return;
    }

    const regionFocusMap: Record<string, { zoom: number; coords: [number, number] }> = {
      "홋카이도": { zoom: 1.8, coords: [142.50, 43.60] },
      "도호쿠": { zoom: 2.2, coords: [140.50, 39.50] },
      "동북": { zoom: 2.2, coords: [140.50, 39.50] },
      "관동": { zoom: 2.8, coords: [139.70, 35.80] },
      "간동": { zoom: 2.8, coords: [139.70, 35.80] },
      "중부": { zoom: 2.3, coords: [137.50, 36.00] },
      "주부": { zoom: 2.3, coords: [137.50, 36.00] },
      "관서": { zoom: 2.8, coords: [135.50, 34.80] },
      "간사이": { zoom: 2.8, coords: [135.50, 34.80] },
      "중국": { zoom: 2.6, coords: [133.00, 34.80] },
      "주고쿠": { zoom: 2.6, coords: [133.00, 34.80] },
      "시코쿠": { zoom: 3.2, coords: [133.50, 33.80] },
      "규슈": { zoom: 2.5, coords: [130.50, 32.80] },
      "큐슈": { zoom: 2.5, coords: [130.50, 32.80] },
      "오키나와": { zoom: 3.0, coords: [127.90, 26.50] },
    };

    const target = regionFocusMap[selectedRegion];
    if (target) {
      const proj = selectedRegion === "오키나와"
        ? d3Geo.geoMercator().center([127.98, 26.47]).scale(5400).translate([690, 780])
        : d3Geo.geoMercator().center([137.5, 38.0]).scale(2500).translate([850 / 2 + 10, 920 / 2 - 10]);

      const pt = proj(target.coords);
      if (pt) {
        setZoom(target.zoom);
        setPan({
          x: Math.round(425 - pt[0] * target.zoom),
          y: Math.round(460 - pt[1] * target.zoom),
        });
      }
    }
  }, [selectedRegion]);

  // Camera Auto-Focus when Trip is selected
  useEffect(() => {
    if (!selectedTrip || selectedTrip.prefectures.length === 0) return;
    const firstCode = selectedTrip.prefectures[0];
    const coords = PREFECTURE_MAINLAND_COORDS[firstCode];
    if (coords) {
      const proj = firstCode === 47
        ? d3Geo.geoMercator().center([127.98, 26.47]).scale(5400).translate([690, 780])
        : d3Geo.geoMercator().center([137.5, 38.0]).scale(2500).translate([850 / 2 + 10, 920 / 2 - 10]);

      const pt = proj(coords);
      if (pt) {
        setZoom(2.2);
        setPan({
          x: Math.round(425 - pt[0] * 2.2),
          y: Math.round(460 - pt[1] * 2.2),
        });
      }
    }
  }, [selectedTrip]);

  // Load GeoJSON data for 47 prefectures
  useEffect(() => {
    fetch("/japan.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoFeatures(data.features || []);
      })
      .catch((err) => {
        console.error("Failed to load Japan map GeoJSON:", err);
      });
  }, []);

  // Process GeoJSON features & filter out distant territorial island polygons
  const processedGeoFeatures = useMemo(() => {
    return geoFeatures.map((feat: any) => {
      let code = feat.properties.id || feat.id;
      if (typeof code === "string") {
        code = parseInt(code, 10);
      }
      feat.properties.id = code;

      // Filter distant islands
      if (code === 47 && feat.geometry.type === "MultiPolygon") {
        const filteredCoords = feat.geometry.coordinates.filter((polygon: any) => {
          const polyFeature: any = { type: "Polygon", coordinates: polygon };
          const centroid = d3Geo.geoCentroid(polyFeature);
          return centroid[0] > 126.5 && centroid[0] < 129.0 && centroid[1] > 25.5 && centroid[1] < 27.5;
        });
        return { ...feat, geometry: { ...feat.geometry, coordinates: filteredCoords } };
      }

      if (code === 13 && feat.geometry.type === "MultiPolygon") {
        const filteredCoords = feat.geometry.coordinates.filter((polygon: any) => {
          const polyFeature: any = { type: "Polygon", coordinates: polygon };
          const centroid = d3Geo.geoCentroid(polyFeature);
          return centroid[0] > 138.8 && centroid[0] < 140.0 && centroid[1] > 35.2 && centroid[1] < 36.0;
        });
        return { ...feat, geometry: { ...feat.geometry, coordinates: filteredCoords } };
      }

      if (code === 1 && feat.geometry.type === "MultiPolygon") {
        const filteredCoords = feat.geometry.coordinates.filter((polygon: any) => {
          const polyFeature: any = { type: "Polygon", coordinates: polygon };
          const area = d3Geo.geoArea(polyFeature);
          return area > 0.0005;
        });
        return { ...feat, geometry: { ...feat.geometry, coordinates: filteredCoords } };
      }

      return feat;
    });
  }, [geoFeatures]);

  // Unified Mercator Projection for natural contiguous Japan
  const { featurePaths, projectedShinkansenLines, projectedCityPins } = useMemo(() => {
    const width = 850;
    const height = 920;

    const mainProjection = d3Geo
      .geoMercator()
      .center([137.5, 38.0])
      .scale(2500)
      .translate([width / 2 + 10, height / 2 - 10]);

    const okinawaProjection = d3Geo
      .geoMercator()
      .center([127.98, 26.47])
      .scale(5400)
      .translate([690, 780]);

    const mainPath = d3Geo.geoPath().projection(mainProjection);
    const okinawaPath = d3Geo.geoPath().projection(okinawaProjection);

    const paths = processedGeoFeatures.map((feat: any) => {
      const code = feat.properties.id;
      let pathGenerator = mainPath;
      let proj = mainProjection;
      if (code === 47) {
        pathGenerator = okinawaPath;
        proj = okinawaProjection;
      }

      const d = pathGenerator(feat as any) || "";
      
      // Calculate precise label position using explicit mainland coordinates
      const mainlandCoords = PREFECTURE_MAINLAND_COORDS[code];
      let centroid: [number, number] = mainlandCoords
        ? (proj(mainlandCoords) as [number, number])
        : (pathGenerator.centroid(feat as any) as [number, number]);

      return { code, feature: feat, d, centroid };
    });

    // Project Shinkansen stations and detailed waypoints onto screen coordinates
    const projectedShinkansenLines = SHINKANSEN_LINES.map((line) => {
      const projectedStations = line.stations.map((st) => {
        const pt = mainProjection(st.coords);
        return {
          ...st,
          px: pt ? pt[0] : 0,
          py: pt ? pt[1] : 0,
        };
      });

      // Project waypoints for smooth, accurate track curvature
      const waypoints = line.pathWaypoints && line.pathWaypoints.length > 0
        ? line.pathWaypoints
        : line.stations.map((st) => st.coords);

      const projectedWaypoints = waypoints.map((coords) => {
        const pt = mainProjection(coords);
        return {
          px: pt ? pt[0] : 0,
          py: pt ? pt[1] : 0,
        };
      });

      // SVG path string connecting waypoints
      const pathD = projectedWaypoints.reduce((acc, curr, idx) => {
        return idx === 0 ? `M ${curr.px} ${curr.py}` : `${acc} L ${curr.px} ${curr.py}`;
      }, "");

      return {
        ...line,
        projectedStations,
        pathD,
      };
    });

    // Collect and project city pins for all visited/recorded cities
    const projectedCityPins: Array<{
      id: string;
      cityNameKo: string;
      cityNameJa?: string;
      visitedAt?: string;
      notes?: string;
      prefectureCode: number;
      prefectureNameKo: string;
      px: number;
      py: number;
      visitCount: number;
      history: any[];
    }> = [];

    const seenPinKeys = new Set<string>();

    Object.values(records).forEach((rec) => {
      if (!rec.cities || rec.cities.length === 0) return;
      const pref = PREFECTURE_MAP_BY_CODE.get(rec.prefectureCode);
      const proj = rec.prefectureCode === 47 ? okinawaProjection : mainProjection;
      const baseCoords = PREFECTURE_MAINLAND_COORDS[rec.prefectureCode];

      rec.cities.forEach((c: any, idx: number) => {
        const cleanName = c.cityNameKo?.trim()?.toLowerCase();
        if (!cleanName) return;

        // Deduplication key per prefecture code & city name
        const pinKey = `${rec.prefectureCode}-${cleanName}`;
        if (seenPinKeys.has(pinKey)) return;
        seenPinKeys.add(pinKey);

        const summary = getCityVisitHistory(rec.prefectureCode, c.cityNameKo, rec, trips);
        let coords = getCityCoordinates(c.cityNameKo, rec.prefectureCode);

        // Fallback for custom entries without database coordinates
        if (!coords && baseCoords) {
          const angle = idx * 1.25;
          const radius = 0.08 + idx * 0.04;
          coords = [
            baseCoords[0] + Math.cos(angle) * radius,
            baseCoords[1] + Math.sin(angle) * radius,
          ];
        }

        if (coords) {
          const pt = proj(coords);
          if (pt && !isNaN(pt[0]) && !isNaN(pt[1])) {
            projectedCityPins.push({
              id: c.id,
              cityNameKo: c.cityNameKo,
              cityNameJa: c.cityNameJa,
              visitedAt: summary.lastVisitedAt || c.visitedAt,
              notes: c.notes,
              prefectureCode: rec.prefectureCode,
              prefectureNameKo: pref?.nameKo || "",
              px: pt[0],
              py: pt[1],
              visitCount: summary.visitCount,
              history: summary.history,
            });
          }
        }
      });
    });

    return { featurePaths: paths, projectedShinkansenLines, projectedCityPins };
  }, [processedGeoFeatures, records, trips]);

  const handleMouseMove = (e: React.MouseEvent, code: number) => {
    if (!mapContainerRef.current) return;
    const containerBounds = mapContainerRef.current.getBoundingClientRect();
    const rawX = e.clientX - containerBounds.left;
    const rawY = e.clientY - containerBounds.top;

    const clampedX = Math.max(90, Math.min(containerBounds.width - 90, rawX));
    const clampedY = Math.max(50, rawY - 12);

    setTooltipPos({ x: clampedX, y: clampedY });
    setHoveredCode(code);
  };

  const handleMouseLeave = () => {
    setHoveredCode(null);
    setTooltipPos(null);
  };

  const getFillStyle = (status: VisitStatus, isHovered: boolean, _isRegionSelected: boolean) => {
    if (status === "visited") {
      return isDarkMode ? "url(#neon-visited-gradient)" : "url(#light-visited-gradient)";
    }
    if (status === "transit") {
      return isDarkMode ? "#065F46" : "#A7F3D0";
    }
    return isHovered
      ? (isDarkMode ? "#334155" : "#CBD5E1")
      : (isDarkMode ? "#1E293B" : "#E2E8F0");
  };

  const hoveredPref = hoveredCode ? PREFECTURE_MAP_BY_CODE.get(hoveredCode) : null;
  const hoveredRecord = hoveredCode ? records[hoveredCode] : null;

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full bg-white dark:bg-[#151D2A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-3 sm:p-4 transition-colors duration-200"
    >
      {/* Map Control Bar (Above SVG Map - Dedicated Header Bar to Never Overlap Hokkaido) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <MapLegend />

          {/* Shinkansen Layer Toggle */}
          <button
            onClick={() => setShowShinkansen(!showShinkansen)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
              showShinkansen
                ? "bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
            title="신칸센 철도 노선 오버레이 표시/숨김"
          >
            <Train className="w-3.5 h-3.5" />
            <span>신칸센 노선도</span>
          </button>

          {/* City Pins Layer Toggle */}
          <button
            onClick={() => setShowCityPins(!showCityPins)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
              showCityPins
                ? "bg-rose-600 dark:bg-cyan-500 text-white dark:text-slate-900 border-rose-500 dark:border-cyan-400 shadow-rose-500/20"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
            title="방문 도시 핀 마커 표시/숨김"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>도시 핀 ({projectedCityPins.length})</span>
          </button>
        </div>

        {selectedTrip && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-rose-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-2xs animate-in fade-in duration-150">
            <Luggage className="w-3.5 h-3.5" />
            <span>선택 여행: {selectedTrip.emoji || "🧳"} {selectedTrip.title}</span>
            {onClearTrip && (
              <button
                onClick={onClearTrip}
                className="p-0.5 rounded-full hover:bg-white/20 dark:hover:bg-slate-900/20 transition-colors"
                title="여행 강조 해제"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {selectedRegion && !selectedTrip && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-2xs animate-in fade-in duration-150">
            <span>단일 권역 강조: {selectedRegion}</span>
            {onClearRegion && (
              <button
                onClick={onClearRegion}
                className="p-0.5 rounded-full hover:bg-white/20 dark:hover:bg-slate-900/20 transition-colors"
                title="범위 선택 해제"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Zoom & Pan Controls Pad */}
      <div className="absolute top-16 right-6 z-20 flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-1.5 space-y-1 transition-all">
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= 5}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="지도 확대 (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="text-[10px] font-extrabold text-center text-blue-600 dark:text-cyan-400 py-0.5 select-none font-mono">
          {Math.round(zoom * 100)}%
        </div>
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="지도 축소 (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetZoom}
          disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="지도 화면 초기화"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Container with Zoom & Drag Support */}
      <svg
        viewBox="0 0 850 920"
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          handleMouseMoveMap(e);
        }}
        onMouseUp={handleMouseUpMap}
        onMouseLeave={() => {
          handleMouseLeave();
          handleMouseUpMap();
          setHoveredCityPin(null);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full h-auto max-h-[850px] drop-shadow-sm select-none ${
          zoom > 1 || pan.x !== 0 || pan.y !== 0
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default"
        }`}
      >
        <defs>
          <linearGradient id="light-visited-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="neon-visited-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#0072FF" />
          </linearGradient>

          <filter id="map-drop-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="4"
              floodOpacity={isDarkMode ? "0.4" : "0.08"}
              floodColor={isDarkMode ? "#00F0FF" : "#0F172A"}
            />
          </filter>
        </defs>

        {/* Master Zoom & Pan Transform Group */}
        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{
            transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)",
            transformOrigin: "0 0",
          }}
        >
          {/* Okinawa Bottom-Right Corner Inset Line */}
          <path
            d="M 520 900 L 520 720 L 830 720"
            fill="none"
            stroke={isDarkMode ? "#38BDF8" : "#94A3B8"}
            strokeOpacity={isDarkMode ? "0.4" : "1"}
            strokeWidth="1.2"
          />

          {/* Prefectures Path Layer */}
          <g filter="url(#map-drop-shadow)">
            {featurePaths.map(({ code, d }: { code: number; d: string }) => {
              const pref = PREFECTURE_MAP_BY_CODE.get(code);
              const record = records[code];
              const status: VisitStatus = record?.status || "unvisited";
              const isSelected = selectedCode === code;
              const isRegionSelected = Boolean(selectedRegion && pref?.region === selectedRegion);
              const isHovered = hoveredCode === code;

              return (
                <path
                  key={`pref-path-${code}`}
                  d={d}
                  fill={getFillStyle(status, isHovered, isRegionSelected)}
                  stroke={
                    isSelected
                      ? (isDarkMode ? "#00F0FF" : "#1D4ED8")
                      : isRegionSelected
                      ? (isDarkMode ? "#38BDF8" : "#2563EB")
                      : isHovered
                      ? (isDarkMode ? "#94A3B8" : "#64748B")
                      : (isDarkMode ? "#0F172A" : "#FFFFFF")
                  }
                  strokeWidth={isSelected ? 3.5 : isRegionSelected ? 2.5 : 1.2}
                  strokeLinejoin="round"
                  className="transition-all duration-150 cursor-pointer hover:brightness-110"
                  onClick={() => onSelectPrefecture(code)}
                  onMouseMove={(e) => handleMouseMove(e, code)}
                  onMouseLeave={handleMouseLeave}
                  style={
                    isDarkMode && (status === "visited" || isRegionSelected)
                      ? { filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.4))" }
                      : undefined
                  }
                />
              );
            })}
          </g>

          {/* 🚄 Shinkansen Railway Overlay Layer */}
          {showShinkansen && (
            <g className="pointer-events-none transition-all duration-300">
              {projectedShinkansenLines.map((line) => (
                <g key={line.id}>
                  {/* Underglow for Railway Line */}
                  <path
                    d={line.pathD}
                    fill="none"
                    stroke={isDarkMode ? line.darkColor : line.color}
                    strokeWidth="5.5"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Main Railway Line (Dashed Style) */}
                  <path
                    d={line.pathD}
                    fill="none"
                    stroke={isDarkMode ? line.darkColor : line.color}
                    strokeWidth="2.8"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Station Dots & Name Labels */}
                  {line.projectedStations.map((st, idx) => (
                    <g key={`${line.id}-${st.nameKo}-${idx}`}>
                      <circle
                        cx={st.px}
                        cy={st.py}
                        r="3.5"
                        fill="#FFFFFF"
                        stroke={isDarkMode ? line.darkColor : line.color}
                        strokeWidth="2"
                        className="shadow-sm"
                      />
                      <text
                        x={st.px + 5}
                        y={st.py - 5}
                        className="text-[8px] font-extrabold fill-slate-800 dark:fill-white"
                        style={{
                          paintOrder: "stroke fill",
                          stroke: isDarkMode ? "#0F172A" : "#FFFFFF",
                          strokeWidth: "2px",
                        }}
                      >
                        {st.nameKo}
                      </text>
                    </g>
                  ))}
                </g>
              ))}
            </g>
          )}

          {/* Dedicated Top Layer for Prefecture Text Labels */}
          <g className="pointer-events-none">
            {featurePaths.map(({ code, centroid }: { code: number; centroid: [number, number] }) => {
              const pref = PREFECTURE_MAP_BY_CODE.get(code);
              const record = records[code];
              const status: VisitStatus = record?.status || "unvisited";
              const isSelected = selectedCode === code;

              if (!pref || !centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return null;

              return (
                <text
                  key={`pref-label-${code}`}
                  x={centroid[0]}
                  y={centroid[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  strokeLinejoin="round"
                  className={`text-[10px] font-bold transition-all ${
                    status === "visited"
                      ? "fill-white"
                      : isDarkMode
                      ? "fill-slate-100"
                      : "fill-slate-800"
                  } ${isSelected ? "text-[11px] font-extrabold fill-blue-950 dark:fill-cyan-200" : ""}`}
                  style={{
                    paintOrder: "stroke fill",
                    stroke: status === "visited"
                      ? (isDarkMode ? "rgba(2, 132, 199, 0.9)" : "rgba(30, 64, 175, 0.5)")
                      : (isDarkMode ? "#0F172A" : "#FFFFFF"),
                    strokeWidth: status === "visited" ? "2.5px" : "3px",
                  }}
                >
                  {pref.nameKo}
                </text>
              );
            })}
          </g>

          {/* 📍 Interactive City Pins Layer */}
          {showCityPins && projectedCityPins.length > 0 && (
            <g className="city-pins-layer">
              {projectedCityPins.map((pin) => {
                const isPrefSelected = selectedCode === pin.prefectureCode;
                const isHovered = hoveredCityPin?.id === pin.id;
                // Show text badge label if: map is zoomed in (zoom >= 1.4), OR this prefecture is selected, OR this pin is hovered
                const showBadgeText = zoom >= 1.4 || isPrefSelected || isHovered;

                return (
                  <g
                    key={`city-pin-${pin.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPrefecture(pin.prefectureCode);
                    }}
                    onMouseEnter={(e) => {
                      handleCityPinHover(e, pin);
                    }}
                    onMouseLeave={() => setHoveredCityPin(null)}
                    className="cursor-pointer group"
                  >
                    {/* Ring highlight for selected or hovered pins */}
                    {(isPrefSelected || isHovered) && (
                      <circle
                        cx={pin.px}
                        cy={pin.py}
                        r="8.5"
                        fill="none"
                        stroke={isDarkMode ? "#00F0FF" : "#EF4444"}
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Pin Marker Outer Circle */}
                    <circle
                      cx={pin.px}
                      cy={pin.py}
                      r={isHovered || isPrefSelected ? "5.5" : "4"}
                      fill={isDarkMode ? "#00F0FF" : "#EF4444"}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="transition-all shadow-md"
                    />

                    {/* Pin Center Dot */}
                    <circle
                      cx={pin.px}
                      cy={pin.py}
                      r="1.6"
                      fill="#FFFFFF"
                      className="pointer-events-none"
                    />

                    {/* Multi-Visit Count Badge (e.g. x2, x3, x5) */}
                    {pin.visitCount > 1 && (
                      <g transform={`translate(${pin.px + 7}, ${pin.py - 7})`} className="pointer-events-none">
                        <circle
                          r="6"
                          fill={isDarkMode ? "#0284C7" : "#DC2626"}
                          stroke="#FFFFFF"
                          strokeWidth="1.2"
                          className="shadow-sm"
                        />
                        <text
                          x="0"
                          y="2.5"
                          textAnchor="middle"
                          className="text-[7.5px] font-black fill-white"
                        >
                          {`x${pin.visitCount}`}
                        </text>
                      </g>
                    )}

                    {/* City Name Badge Label (Rendered adaptively when zoomed in, selected, or hovered) */}
                    {showBadgeText && (
                      <g transform={`translate(${pin.px}, ${pin.py - 12})`} className="pointer-events-none transition-all duration-150 animate-in fade-in">
                        <rect
                          x="-24"
                          y="-10"
                          width="48"
                          height="13"
                          rx="3.5"
                          fill={isDarkMode ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.92)"}
                          stroke={isDarkMode ? "#38BDF8" : "#F87171"}
                          strokeWidth="0.8"
                          className="drop-shadow-xs"
                        />
                        <text
                          x="0"
                          y="-2"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={`text-[8px] font-extrabold select-none ${
                            isDarkMode ? "fill-cyan-300" : "fill-red-600"
                          }`}
                        >
                          {pin.cityNameKo.length > 5 ? `${pin.cityNameKo.slice(0, 4)}..` : pin.cityNameKo}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>

      {/* Prefecture Tooltip */}
      {tooltipPos && hoveredPref && !hoveredCityPin && (
        <div
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
          className="absolute pointer-events-none transform -translate-x-1/2 z-30 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm space-y-0.5 border border-slate-700 animate-in fade-in duration-100 whitespace-nowrap"
        >
          <div className="font-semibold flex items-center space-x-1.5">
            <span>{hoveredPref.nameKo}</span>
            <span className="text-[10px] text-slate-400 font-normal">({hoveredPref.nameJa})</span>
          </div>
          <div className="flex items-center space-x-1 text-[11px]">
            <span className="text-slate-400">상태:</span>
            <span
              className={`font-semibold ${
                hoveredRecord?.status === "visited"
                  ? "text-blue-400"
                  : hoveredRecord?.status === "transit"
                  ? "text-emerald-400"
                  : "text-slate-300"
              }`}
            >
              {hoveredRecord?.status === "visited"
                ? "방문 완료"
                : hoveredRecord?.status === "transit"
                ? "경유함"
                : "미방문"}
            </span>
          </div>
        </div>
      )}

      {/* City Pin Tooltip Card */}
      {cityPinTooltipPos && hoveredCityPin && (
        <div
          style={{
            left: `${cityPinTooltipPos.x}px`,
            top: `${cityPinTooltipPos.y}px`,
          }}
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full z-40 bg-slate-900/95 text-white text-xs px-3 py-2 rounded-xl shadow-xl backdrop-blur-md space-y-1 border border-slate-700 animate-in fade-in duration-100 min-w-[140px]"
        >
          <div className="font-extrabold flex items-center space-x-1.5 text-rose-400 dark:text-cyan-300 border-b border-slate-800 pb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{hoveredCityPin.cityNameKo}</span>
            {hoveredCityPin.cityNameJa && (
              <span className="text-[10px] text-slate-400 font-normal">({hoveredCityPin.cityNameJa})</span>
            )}
          </div>
          <div className="text-[11px] text-slate-300 space-y-0.5 pt-0.5">
            <div>소속: <span className="font-semibold text-slate-200">{hoveredCityPin.prefectureNameKo}</span></div>
            {hoveredCityPin.visitedAt && (
              <div>방문 시기: <span className="font-semibold text-amber-300">{hoveredCityPin.visitedAt}</span></div>
            )}
            {hoveredCityPin.notes && (
              <div className="text-slate-400 italic text-[10px] truncate max-w-[180px]">"{hoveredCityPin.notes}"</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
