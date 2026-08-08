import React, { useEffect, useState, useMemo, useRef } from "react";
import * as d3Geo from "d3-geo";
import type { TravelRecordsMap, VisitStatus } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { MapLegend } from "./MapLegend";
import { X } from "lucide-react";

interface JapanMapProps {
  records: TravelRecordsMap;
  selectedCode: number | null;
  selectedRegion?: string | null;
  onSelectPrefecture: (code: number) => void;
  onClearRegion?: () => void;
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

export const JapanMap: React.FC<JapanMapProps> = ({
  records,
  selectedCode,
  selectedRegion = null,
  onSelectPrefecture,
  onClearRegion,
  isDarkMode = false,
}) => {
  const [geoFeatures, setGeoFeatures] = useState<GeoFeature[]>([]);
  const [hoveredCode, setHoveredCode] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  // Configure Mercator projections for Hokkaido inset, Mainland, and Okinawa inset
  const { featurePaths } = useMemo(() => {
    const width = 800;
    const height = 700;

    const hokkaidoProjection = d3Geo
      .geoMercator()
      .center([142.6, 43.4])
      .scale(2300)
      .translate([195, 190]);

    const mainlandProjection = d3Geo
      .geoMercator()
      .center([137.2, 36.4])
      .scale(2950)
      .translate([width / 2 + 95, height / 2 - 15]);

    const okinawaProjection = d3Geo
      .geoMercator()
      .center([127.98, 26.47])
      .scale(6200)
      .translate([635, 595]);

    const hokkaidoPath = d3Geo.geoPath().projection(hokkaidoProjection);
    const mainlandPath = d3Geo.geoPath().projection(mainlandProjection);
    const okinawaPath = d3Geo.geoPath().projection(okinawaProjection);

    const paths = processedGeoFeatures.map((feat: any) => {
      const code = feat.properties.id;
      let pathGenerator = mainlandPath;
      if (code === 1) {
        pathGenerator = hokkaidoPath;
      } else if (code === 47) {
        pathGenerator = okinawaPath;
      }

      const d = pathGenerator(feat as any) || "";
      const rawCentroid = pathGenerator.centroid(feat as any);

      let centroid = rawCentroid;
      if (rawCentroid && !isNaN(rawCentroid[0]) && !isNaN(rawCentroid[1])) {
        let [cx, cy] = rawCentroid;
        if (code === 30) cy -= 4; // Wakayama label Y shift
        if (code === 46) { cx += 5; cy -= 30; } // Kagoshima label Y shift
        if (code === 42) { cx += 10; cy -= 5; } // Nagasaki label shift
        centroid = [cx, cy];
      }

      return { code, feature: feat, d, centroid };
    });

    return { featurePaths: paths };
  }, [processedGeoFeatures]);

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

  const getFillStyle = (status: VisitStatus, isHovered: boolean, isRegionSelected: boolean) => {
    if (status === "visited") {
      return isDarkMode ? "url(#neon-visited-gradient)" : "url(#light-visited-gradient)";
    }
    if (status === "transit") {
      return isDarkMode ? "#065F46" : "#A7F3D0";
    }
    if (isRegionSelected) {
      return isDarkMode ? "#1E3A8A" : "#DBEAFE";
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
      className="relative w-full bg-white dark:bg-[#151D2A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 transition-colors duration-200"
    >
      {/* Map Legend & Active Region Indicator */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <MapLegend />
        </div>

        {selectedRegion && (
          <div className="pointer-events-auto flex items-center space-x-2 px-3 py-1.5 bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-md animate-in fade-in duration-150">
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

      {/* SVG Container */}
      <svg viewBox="0 0 800 700" className="w-full h-auto max-h-[640px] drop-shadow-sm select-none">
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

        {/* 1. Hokkaido Top-Left Corner Inset Box Line */}
        <path
          d="M 30 330 L 340 330 L 340 40"
          fill="none"
          stroke={isDarkMode ? "#38BDF8" : "#94A3B8"}
          strokeOpacity={isDarkMode ? "0.4" : "1"}
          strokeWidth="1.2"
        />

        {/* 2. Okinawa Bottom-Right Corner Inset Line */}
        <path
          d="M 500 670 L 500 520 L 780 520"
          fill="none"
          stroke={isDarkMode ? "#38BDF8" : "#94A3B8"}
          strokeOpacity={isDarkMode ? "0.4" : "1"}
          strokeWidth="1.2"
        />

        {/* Prefectures Path Layers */}
        <g filter="url(#map-drop-shadow)">
          {featurePaths.map(({ code, d, centroid }: { code: number; d: string; centroid: [number, number] }) => {
            const pref = PREFECTURE_MAP_BY_CODE.get(code);
            const record = records[code];
            const status: VisitStatus = record?.status || "unvisited";
            const isSelected = selectedCode === code;
            const isRegionSelected = Boolean(selectedRegion && pref?.region === selectedRegion);
            const isHovered = hoveredCode === code;

            return (
              <g key={`pref-group-${code}`}>
                <path
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

                {/* Prefecture Label */}
                {pref && centroid && !isNaN(centroid[0]) && !isNaN(centroid[1]) && (
                  <text
                    x={centroid[0]}
                    y={centroid[1]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                    strokeLinejoin="round"
                    className={`text-[10px] font-semibold transition-all ${
                      status === "visited"
                        ? "fill-white"
                        : isDarkMode
                        ? "fill-slate-200"
                        : "fill-slate-700"
                    } ${isSelected ? "text-[11px] font-extrabold fill-blue-900 dark:fill-cyan-200" : ""}`}
                    style={{
                      paintOrder: "stroke fill",
                      stroke: status === "visited"
                        ? (isDarkMode ? "rgba(2, 132, 199, 0.9)" : "rgba(30, 64, 175, 0.4)")
                        : (isDarkMode ? "#0F172A" : "#FFFFFF"),
                      strokeWidth: status === "visited" ? "2px" : "2.5px",
                    }}
                  >
                    {pref.nameKo}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {tooltipPos && hoveredPref && (
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
    </div>
  );
};
