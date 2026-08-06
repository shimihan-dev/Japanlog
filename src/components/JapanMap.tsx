import React, { useEffect, useState, useMemo } from "react";
import * as d3Geo from "d3-geo";
import type { TravelRecordsMap, VisitStatus } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { MapLegend } from "./MapLegend";


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

  // Process GeoJSON features: filter Tokyo remote islands (Izu/Ogasawara) and Okinawa minor islands
  const processedGeoFeatures = useMemo(() => {
    return geoFeatures.map((feat) => {
      const code = feat.properties.id;
      if (code === 13) {
        // Tokyo: keep mainland Kanto area only (latitude >= 35.0 N)
        const filteredCoords = feat.geometry.coordinates.filter((poly: any) => {
          const bounds = d3Geo.geoBounds({ type: "Polygon", coordinates: poly });
          return bounds[0][1] >= 35.0;
        });
        return {
          ...feat,
          geometry: { ...feat.geometry, coordinates: filteredCoords },
        };
      }
      if (code === 47) {
        // Okinawa: keep Okinawa Main Island only
        const filteredCoords = feat.geometry.coordinates.filter((poly: any) => {
          const bounds = d3Geo.geoBounds({ type: "Polygon", coordinates: poly });
          const area = d3Geo.geoArea({ type: "Polygon", coordinates: poly });
          return (
            bounds[0][0] >= 127.5 &&
            bounds[1][0] <= 128.4 &&
            bounds[0][1] >= 26.0 &&
            bounds[1][1] <= 26.9 &&
            area > 0.000005
          );
        });
        return {
          ...feat,
          geometry: { ...feat.geometry, coordinates: filteredCoords },
        };
      }
      return feat;
    });
  }, [geoFeatures]);

  // Configure Mercator projections for Hokkaido inset, Mainland, and Okinawa inset
  const { featurePaths } = useMemo(() => {
    const width = 800;
    const height = 700;

    // 1. Hokkaido Inset Projection (Code 1) -> Top Left
    const hokkaidoProjection = d3Geo
      .geoMercator()
      .center([142.6, 43.4])
      .scale(2300)
      .translate([260, 190]);

    // 2. Mainland Projection (Codes 2 to 46) -> Center/Right
    const mainlandProjection = d3Geo
      .geoMercator()
      .center([137.2, 36.4])
      .scale(3100)
      .translate([width / 2 + 100, height / 2 + 10]);

    // 3. Okinawa Inset Projection (Code 47) -> Bottom Right Corner
    const okinawaProjection = d3Geo
      .geoMercator()
      .center([127.98, 26.47])
      .scale(4200)
      .translate([640, 600]);

    const hokkaidoPath = d3Geo.geoPath().projection(hokkaidoProjection);
    const mainlandPath = d3Geo.geoPath().projection(mainlandProjection);
    const okinawaPath = d3Geo.geoPath().projection(okinawaProjection);

    const paths = processedGeoFeatures.map((feat) => {
      const code = feat.properties.id;
      let pathGenerator = mainlandPath;
      if (code === 1) {
        pathGenerator = hokkaidoPath;
      } else if (code === 47) {
        pathGenerator = okinawaPath;
      }

      const d = pathGenerator(feat as any) || "";
      const centroid = pathGenerator.centroid(feat as any);
      return { code, feature: feat, d, centroid };
    });

    return { featurePaths: paths };
  }, [processedGeoFeatures]);

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
      return isHovered ? "#2563EB" : "#3B82F6"; // Rich Blue / Vibrant Blue
    }
    if (status === "transit") {
      return "url(#transit-stripe-pattern)";
    }
    return isHovered ? "#CBD5E1" : "#EEF2F6"; // Slate hover / Soft crisp grey
  };

  const getPrefNameLabel = (code: number, nameKo: string) => {
    if (code === 1) return "홋카이도";
    return nameKo.replace(/현|부|도$/, "");
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
    <div className="relative w-full bg-slate-50/50 rounded-2xl border border-slate-200/80 shadow-sm p-4 overflow-hidden flex flex-col items-center space-y-3">
      {/* Main SVG Container */}
      <div className="w-full max-w-[850px] aspect-[4/3.4] relative">
        <svg
          viewBox="0 0 800 700"
          className="w-full h-full select-none"
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

            {/* Subtle Drop Shadow for Prefectures */}
            <filter id="map-drop-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Inset Frame Lines matching design */}
          {/* 1. Hokkaido Top-Left Inset Line */}
          <path
            d="M 40 330 L 360 330 L 360 40"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />

          {/* 2. Okinawa Bottom-Right Corner Inset Line */}
          <path
            d="M 500 670 L 500 520 L 780 520"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />

          {/* Prefectures Path Layers */}
          <g filter="url(#map-drop-shadow)">
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
                    stroke={isSelected ? "#1D4ED8" : isHovered ? "#64748B" : "#FFFFFF"}
                    strokeWidth={isSelected ? 3 : 1.2}
                    strokeLinejoin="round"
                    className="transition-all duration-150 cursor-pointer hover:brightness-95"
                    onClick={() => onSelectPrefecture(code)}
                    onMouseMove={(e) => handleMouseMove(e, code)}
                    onMouseLeave={handleMouseLeave}
                  />

                  {/* Prefecture Label */}
                  {pref && centroid && !isNaN(centroid[0]) && !isNaN(centroid[1]) && (
                    <text
                      x={centroid[0]}
                      y={centroid[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      pointerEvents="none"
                      className={`text-[10px] font-semibold transition-all ${
                        status === "visited"
                          ? "fill-white"
                          : "fill-slate-700"
                      } ${isSelected ? "text-[11px] font-extrabold fill-blue-900" : ""}`}
                      style={{
                        paintOrder: "stroke fill",
                        stroke: status === "visited" ? "rgba(30, 64, 175, 0.4)" : "#FFFFFF",
                        strokeWidth: status === "visited" ? "1.5px" : "2.5px",
                        strokeLinejoin: "round",
                      }}
                    >
                      {getPrefNameLabel(code, pref.nameKo)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
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

      {/* Legend below the map container */}
      <div className="w-full pt-1">
        <MapLegend />
      </div>
    </div>
  );
};

