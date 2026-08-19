import React from "react";
import type { Trip } from "../types/travel";

interface LandingStickerProps {
  trip?: Trip;
  dateStr?: string;
  className?: string;
}

const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

// Helper to format date string "YYYY.MM.DD" into Japanese Passport format "DD.MMM.YYYY"
function formatPassportDate(dateRaw?: string): string {
  if (!dateRaw) return "01.JAN.2026";
  const clean = dateRaw.trim().replace(/\./g, "-");
  const parts = clean.split("-");

  if (parts.length >= 3) {
    const y = parts[0];
    const mIdx = parseInt(parts[1], 10) - 1;
    const d = parts[2].padStart(2, "0");
    const mStr = MONTH_NAMES[mIdx] || "JAN";
    return `${d}.${mStr}.${y}`;
  }
  return dateRaw;
}

// Mini SVG QR Code vector to render realistic QR code on sticker
const MiniQRCodeSVG: React.FC = () => (
  <svg className="w-9 h-9 shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h9v9h-9V2zm2 2v5h5V4h-5zM2 13h9v9H2v-9zm2 2v5h5v-5H4zm14 0h4v2h-4v-2zm-5 0h3v3h-3v-3zm0 4h2v3h-2v-3zm3 0h4v2h-4v-2zm-3-2h2v2h-2v-2zm5 2h2v3h-2v-3z" />
  </svg>
);

export const LandingSticker: React.FC<LandingStickerProps> = ({
  trip,
  dateStr,
  className = "",
}) => {
  const permitDate = formatPassportDate(trip?.startDate || dateStr);
  const untilDate = formatPassportDate(trip?.endDate || dateStr);
  const serialNo = trip?.id ? `LHLY${trip.id.substring(0, 6).toUpperCase()}` : "LHLY6866720";

  return (
    <div
      className={`relative bg-[#F3F6F4] dark:bg-[#121A24] border border-slate-300 dark:border-slate-700 rounded-xl p-3 shadow-lg select-none font-mono text-slate-800 dark:text-slate-100 overflow-hidden ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(215, 232, 225, 0.4) 0%, rgba(243, 246, 244, 0.95) 100%)`,
      }}
    >
      {/* Background Micro Guilloche Lines & Fuji Watermark SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-12 pointer-events-none text-teal-900 dark:text-cyan-300"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 120"
        preserveAspectRatio="none"
      >
        <path d="M0,80 Q50,40 100,80 T200,80 M0,90 Q50,50 100,90 T200,90 M0,100 Q50,60 100,100 T200,100" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <polygon points="100,30 140,80 60,80" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="150" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>

      {/* Red Inspection Circular Stamp Ink Seal Overlay */}
      <div className="absolute right-2 top-2 w-11 h-11 rounded-full border-2 border-red-600/70 dark:border-red-500/70 flex flex-col items-center justify-center text-red-600 dark:text-red-500 transform rotate-12 opacity-85 pointer-events-none font-serif-jp">
        <span className="text-[7px] font-bold tracking-tighter leading-none">入国審査官</span>
        <span className="text-[11px] font-black leading-tight">済</span>
        <span className="text-[6px] tracking-widest font-sans font-bold leading-none">JAPAN</span>
      </div>

      {/* Header Accent Bar */}
      <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-1 mb-2 text-[9px] font-sans">
        <span className="font-mono tracking-widest text-[8px] font-bold text-slate-600 dark:text-slate-400">
          JAPAN IMMIGRATION INSPECTOR
        </span>
        <span className="font-serif-jp text-[#E63946] dark:text-[#FF5A65] font-extrabold text-[11px] tracking-widest">
          上 陸 許 可
        </span>
      </div>

      {/* Main Landing Permission Content Grid */}
      <div className="space-y-1 text-[10px] leading-tight font-mono relative z-10">
        <div className="flex justify-between items-baseline font-bold text-slate-900 dark:text-white">
          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-sans tracking-wide">LANDING PERMISSION</span>
        </div>

        {/* Date of Permit */}
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-sans">許可年月日 Date of permit:</span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 font-sans-outfit text-xs">{permitDate}</span>
        </div>

        {/* Until Date */}
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-sans">在留期限 Until:</span>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 font-sans-outfit text-xs">{untilDate}</span>
        </div>

        {/* Status & Duration */}
        <div className="flex justify-between items-center text-[9.5px] pt-1 border-t border-slate-200 dark:border-slate-800 mt-1">
          <span className="font-bold text-slate-800 dark:text-slate-200 font-serif-jp">短期滯在 Temporary Visitor</span>
          <span className="font-extrabold text-[#E63946] dark:text-[#FF5A65] font-mono text-[10px]">90 days</span>
        </div>
      </div>

      {/* Bottom Passport QR Code & Serial Footer */}
      <div className="mt-2.5 pt-1.5 border-t border-slate-300 dark:border-slate-700 flex items-center justify-between">
        <div className="space-y-0.5 font-mono text-[8px] text-slate-500 dark:text-slate-400">
          <p className="font-bold tracking-wider text-slate-800 dark:text-slate-200 text-[9px]">{serialNo}</p>
          <p className="text-[#E63946] dark:text-[#FF5A65] font-serif-jp font-bold text-[9px]">JAPANLOG OFFICIAL</p>
        </div>

        <MiniQRCodeSVG />
      </div>
    </div>
  );
};
