import React, { useEffect, useState, useMemo, useRef } from "react";
import * as d3Geo from "d3-geo";
import type { TravelRecordsMap, VisitStatus } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { SHINKANSEN_LINES } from "../data/shinkansenRoutes";
import { MapLegend } from "./MapLegend";
import { X, Train, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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
  const [showShinkansen, setShowShinkansen] = useState<boolean>(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Zoom & Pan State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(5, Math.round((prev + 0.25) * 100) / 100));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(1, Math.round((prev - 0.25) * 100) / 100);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Wheel Zoom Handler
  const handleWheel = (e: React.WheelEvent) => {
    // Zoom centered on map container
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((prev) => {
      const next = Math.min(5, Math.max(1, Math.round((prev + delta) * 100) / 100));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
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

  // Unified Mercator Projection for natural contiguous Japan (Hokkaido sitting naturally above Aomori)
  const { featurePaths, projectedShinkansenLines } = useMemo(() => {
    const width = 850;
    const height = 920;

    // Single unified projection mapping Hokkaido naturally above Aomori over Tsugaru Strait with complete unclipped coverage
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
      if (code === 47) {
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

    return { featurePaths: paths, projectedShinkansenLines };
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
        </div>

        {selectedRegion && (
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
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          handleMouseMoveMap(e);
        }}
        onMouseUp={handleMouseUpMap}
        onMouseLeave={() => {
          handleMouseLeave();
          handleMouseUpMap();
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
          transform={`translate(${425 + pan.x}, ${460 + pan.y}) scale(${zoom}) translate(-425, -460)`}
          className="transition-transform duration-75 origin-center"
        >
          {/* Okinawa Bottom-Right Corner Inset Line */}
          <path
            d="M 520 900 L 520 720 L 830 720"
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
