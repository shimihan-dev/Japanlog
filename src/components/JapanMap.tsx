import React, { useEffect, useState, useMemo } from "react";
import * as d3Geo from "d3-geo";
import type { TravelRecordsMap, VisitStatus } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { MapLegend } from "./MapLegend";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface JapanMapProps {
  records: TravelRecordsMap;
  selectedCode: number | null;
  onSelectPrefecture: (code: number) => void;
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
  onSelectPrefecture,
}) => {
  const [geoFeatures, setGeoFeatures] = useState<GeoFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCode, setHoveredCode] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Fetch GeoJSON on mount
  useEffect(() => {
    fetch("/japan.geojson")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.features) {
          setGeoFeatures(data.features);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Japan GeoJSON map data:", err);
        setLoading(false);
      });
  }, []);

  // Configure main Mercator projection for Japan mainland
  const { featurePaths } = useMemo(() => {
    const width = 800;
    const height = 700;

    // Mercator centered around Japan [137.5, 37.5]
    const projection = d3Geo
      .geoMercator()
      .center([137.5, 37.5])
      .scale(1800 * zoomLevel)
      .translate([width / 2, height / 2]);

    const path = d3Geo.geoPath().projection(projection);

    const paths = geoFeatures.map((feat) => {
      const code = feat.properties.id;
      const d = path(feat as any) || "";
      const centroid = path.centroid(feat as any);
      return { code, feature: feat, d, centroid };
    });

    return { featurePaths: paths };
  }, [geoFeatures, zoomLevel]);

  // Handle tooltip positioning
  const handleMouseMove = (e: React.MouseEvent, code: number) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top - 40,
    });
    setHoveredCode(code);
  };

  const handleMouseLeave = () => {
    setHoveredCode(null);
    setTooltipPos(null);
  };

  const hoveredPref = hoveredCode ? PREFECTURE_MAP_BY_CODE.get(hoveredCode) : null;
  const hoveredRecord = hoveredCode ? records[hoveredCode] : null;

  const getFillStyle = (status: VisitStatus, isHovered: boolean) => {
    if (status === "visited") {
      return isHovered ? "#1D4ED8" : "#3B82F6"; // Dark Blue / Blue
    }
    if (status === "transit") {
      return "url(#transit-stripe-pattern)";
    }
    return isHovered ? "#CBD5E1" : "#E2E8F0"; // Slate hover / Slate light
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">일본 47개 도도부현 지도 데이터를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-50/50 rounded-2xl border border-slate-200/80 shadow-sm p-4 overflow-hidden flex flex-col items-center">
      {/* Top Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="확대"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.7))}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="축소"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="초기화"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Box at top-left */}
      <div className="absolute top-4 left-4 z-10 hidden sm:block">
        <MapLegend />
      </div>

      {/* Main SVG Container */}
      <div className="w-full max-w-[850px] aspect-[4/3.4] relative cursor-grab active:cursor-grabbing">
        <svg
          viewBox="0 0 800 700"
          className="w-full h-full drop-shadow-sm select-none"
        >
          <defs>
            {/* Transit status diagonal stripe pattern */}
            <pattern
              id="transit-stripe-pattern"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="10" height="10" fill="#A7F3D0" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="#059669"
                strokeWidth="3.5"
              />
            </pattern>
          </defs>

          {/* Prefectures Path Layers */}
          <g>
            {featurePaths.map(({ code, d, centroid }) => {
              const pref = PREFECTURE_MAP_BY_CODE.get(code);
              const record = records[code];
              const status: VisitStatus = record?.status || "unvisited";
              const isSelected = selectedCode === code;
              const isHovered = hoveredCode === code;

              return (
                <g key={`pref-group-${code}`}>
                  <path
                    d={d}
                    fill={getFillStyle(status, isHovered)}
                    stroke={isSelected ? "#1D4ED8" : isHovered ? "#475569" : "#FFFFFF"}
                    strokeWidth={isSelected ? 3 : 1}
                    strokeLinejoin="round"
                    className="transition-colors duration-150 cursor-pointer hover:filter hover:brightness-95"
                    onClick={() => onSelectPrefecture(code)}
                    onMouseMove={(e) => handleMouseMove(e, code)}
                    onMouseLeave={handleMouseLeave}
                  />

                  {/* Optional label for larger prefectures */}
                  {pref && centroid && !isNaN(centroid[0]) && !isNaN(centroid[1]) && (
                    <text
                      x={centroid[0]}
                      y={centroid[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      pointerEvents="none"
                      className={`text-[9px] font-medium transition-all ${
                        status === "visited"
                          ? "fill-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] font-bold"
                          : "fill-slate-700 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                      } ${isSelected ? "text-[11px] font-extrabold fill-blue-900" : ""}`}
                    >
                      {pref.nameKo.replace(/현|부|도$/, "")}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Okinawa Inset Box Line */}
          <path
            d="M 50 560 L 220 560 L 250 670"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Hokkaido Inset Box Line */}
          <path
            d="M 160 30 L 380 30 L 380 230"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </svg>

        {/* Hover Tooltip Overlay */}
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

      {/* Legend below for mobile view */}
      <div className="mt-4 sm:hidden w-full">
        <MapLegend />
      </div>
    </div>
  );
};
