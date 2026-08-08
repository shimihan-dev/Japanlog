import React, { useEffect, useState, useMemo, useRef } from "react";
import * as d3Geo from "d3-geo";
import type { TravelRecordsMap, VisitStatus } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { MapLegend } from "./MapLegend";
import { SHINKANSEN_ROUTES } from "../data/transitRoutes";
import { Train } from "lucide-react";

interface JapanMapProps {
  records: TravelRecordsMap;
  selectedCode: number | null;
  onSelectPrefecture: (code: number) => void;
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
  onSelectPrefecture,
  isDarkMode = false,
}) => {
  const [geoFeatures, setGeoFeatures] = useState<GeoFeature[]>([]);
  const [hoveredCode, setHoveredCode] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [showShinkansen, setShowShinkansen] = useState<boolean>(false);
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
    return geoFeatures.map((feat) => {
      let code = feat.properties.id || (feat as any).id;
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
  const { featurePaths, shinkansenPathData } = useMemo(() => {
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

    const paths = processedGeoFeatures.map((feat) => {
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
        if (code === 30) cy -= 4;
        if (code === 46) { cx += 5; cy -= 30; }
        if (code === 42) { cx += 10; cy -= 5; }
        centroid = [cx, cy];
      }

      return { code, feature: feat, d, centroid };
    });

    const projectedShinkansen = SHINKANSEN_ROUTES.map((route) => {
      const projectedPoints = route.stations.map((st) => {
        const proj = st.prefCode === 1 ? hokkaidoProjection : mainlandProjection;
        const [x, y] = proj([st.lng, st.lat]) || [0, 0];
        return { ...st, x, y };
      });

      const pathD = projectedPoints
        .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
        .join(" ");

      return { ...route, points: projectedPoints, pathD };
    });

    return { featurePaths: paths, shinkansenPathData: projectedShinkansen };
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

  const getFillStyle = (status: VisitStatus, isHovered: boolean) => {
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
      className="relative w-full bg-white dark:bg-[#151D2A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 transition-colors duration-200"
    >
      {/* Map Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <MapLegend />
        </div>

        <button
          type="button"
          onClick={() => setShowShinkansen((prev) => !prev)}
          className={`pointer-events-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${
            showShinkansen
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white border-transparent shadow-blue-500/20"
              : "bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          <Train className={`w-3.5 h-3.5 ${showShinkansen ? "animate-pulse" : ""}`} />
          <span>신칸센 노선 레이어</span>
        </button>
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

          <filter id="shinkansen-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <path
          d="M 30 330 L 340 330 L 340 40"
          fill="none"
          stroke={isDarkMode ? "#38BDF8" : "#94A3B8"}
          strokeOpacity={isDarkMode ? "0.4" : "1"}
          strokeWidth="1.2"
        />

        <path
          d="M 500 670 L 500 520 L 780 520"
          fill="none"
          stroke={isDarkMode ? "#38BDF8" : "#94A3B8"}
          strokeOpacity={isDarkMode ? "0.4" : "1"}
          strokeWidth="1.2"
        />

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
                  stroke={
                    isSelected
                      ? (isDarkMode ? "#00F0FF" : "#1D4ED8")
                      : isHovered
                      ? (isDarkMode ? "#94A3B8" : "#64748B")
                      : (isDarkMode ? "#0F172A" : "#FFFFFF")
                  }
                  strokeWidth={isSelected ? 3 : 1.2}
                  strokeLinejoin="round"
                  className="transition-all duration-150 cursor-pointer hover:brightness-110"
                  onClick={() => onSelectPrefecture(code)}
                  onMouseMove={(e) => handleMouseMove(e, code)}
                  onMouseLeave={handleMouseLeave}
                  style={
                    isDarkMode && status === "visited"
                      ? { filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.4))" }
                      : undefined
                  }
                />

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

          {showShinkansen && (
            <g pointerEvents="none" filter="url(#shinkansen-glow)">
              {shinkansenPathData.map((route) => (
                <g key={route.id}>
                  <path
                    d={route.pathD}
                    fill="none"
                    stroke={route.color}
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                    strokeLinecap="round"
                    className="animate-pulse opacity-90"
                  />
                  {route.points.map((st, i) => (
                    <g key={`${route.id}-st-${i}`}>
                      <circle
                        cx={st.x}
                        cy={st.y}
                        r="3.5"
                        fill="#FFFFFF"
                        stroke={route.color}
                        strokeWidth="2"
                      />
                    </g>
                  ))}
                </g>
              ))}
            </g>
          )}
        </g>
      </svg>

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
