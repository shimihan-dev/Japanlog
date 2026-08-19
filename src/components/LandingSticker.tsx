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

// Format "YYYY.MM.DD" to Japanese Passport "DD.MMM.YYYY" (e.g. 20.JUL.2021)
function formatPassportDate(dateRaw?: string, addDays = 0): string {
  if (!dateRaw) return "20.JUL.2026";
  const clean = dateRaw.trim().replace(/\./g, "-");
  const parts = clean.split("-");

  if (parts.length >= 3) {
    let y = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10) - 1;
    let d = parseInt(parts[2], 10);

    if (addDays > 0) {
      const dt = new Date(y, m, d + addDays);
      y = dt.getFullYear();
      m = dt.getMonth();
      d = dt.getDate();
    }

    const dStr = d.toString().padStart(2, "0");
    const mStr = MONTH_NAMES[m] || "JUL";
    return `${dStr}.${mStr}.${y}`;
  }
  return dateRaw;
}

// Generate realistic QR Code SVG grid for Japanese passport sticker
const PassportQRCodeSVG: React.FC = () => (
  <svg className="w-14 h-14 shrink-0 text-slate-900" viewBox="0 0 29 29" fill="currentColor">
    {/* Finder Pattern Top-Left */}
    <rect x="0" y="0" width="7" height="7" />
    <rect x="1" y="1" width="5" height="5" fill="#F0F4F2" />
    <rect x="2" y="2" width="3" height="3" />
    
    {/* Finder Pattern Top-Right */}
    <rect x="22" y="0" width="7" height="7" />
    <rect x="23" y="1" width="5" height="5" fill="#F0F4F2" />
    <rect x="24" y="2" width="3" height="3" />

    {/* Finder Pattern Bottom-Left */}
    <rect x="0" y="22" width="7" height="7" />
    <rect x="1" y="23" width="5" height="5" fill="#F0F4F2" />
    <rect x="2" y="24" width="3" height="3" />

    {/* Alignment & Data Dots */}
    <rect x="9" y="1" width="2" height="2" />
    <rect x="13" y="0" width="3" height="2" />
    <rect x="18" y="1" width="2" height="2" />
    <rect x="9" y="4" width="3" height="1" />
    <rect x="14" y="4" width="2" height="2" />
    <rect x="19" y="4" width="1" height="3" />
    <rect x="9" y="8" width="2" height="2" />
    <rect x="12" y="8" width="5" height="1" />
    <rect x="19" y="8" width="2" height="2" />
    
    <rect x="0" y="9" width="3" height="2" />
    <rect x="5" y="9" width="2" height="2" />
    <rect x="23" y="9" width="4" height="2" />

    <rect x="9" y="12" width="2" height="5" />
    <rect x="13" y="11" width="3" height="2" />
    <rect x="17" y="12" width="2" height="3" />

    <rect x="9" y="18" width="4" height="2" />
    <rect x="15" y="17" width="2" height="4" />
    <rect x="19" y="18" width="3" height="2" />

    <rect x="9" y="22" width="2" height="4" />
    <rect x="13" y="23" width="3" height="2" />
    <rect x="17" y="22" width="4" height="2" />
    <rect x="23" y="24" width="5" height="4" />
  </svg>
);

export const LandingSticker: React.FC<LandingStickerProps> = ({
  trip,
  dateStr,
  className = "",
}) => {
  const permitDate = formatPassportDate(trip?.startDate || dateStr);
  const untilDate = formatPassportDate(
    trip?.endDate || trip?.startDate || dateStr,
    trip?.endDate ? 0 : 88
  );

  const rawId = trip?.id || "2034701145";
  const numSerial = (parseInt(rawId.replace(/\D/g, ""), 10) || 2034701145).toString().slice(-10).padStart(10, "2034701145");
  const codeSerial = `LHLY${(rawId.substring(0, 7)).toUpperCase().padStart(7, "6866720")}`;

  return (
    <div
      className={`relative w-[340px] sm:w-[360px] bg-[#EEF4F1] text-slate-900 select-none font-mono shadow-xl border border-slate-300/80 rounded-sm p-3.5 pt-3 overflow-hidden ${className}`}
      style={{
        backgroundImage: `radial-gradient(ellipse at 40% 40%, rgba(200, 230, 222, 0.6) 0%, rgba(238, 244, 241, 0.98) 100%)`,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25), inset 0 0 10px rgba(255, 255, 255, 0.7)",
      }}
    >
      {/* Scalloped Stamp Outer Edges Cutout Effect (우표 톱니 테두리 텍스처) */}
      <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-teal-800/15" />

      {/* Guilloche Fine Security Lines & Mt. Fuji + Cherry Blossom Background SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none text-teal-800"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 220"
      >
        {/* Fine Guilloche Pattern Lines */}
        <path d="M0,40 Q80,10 160,40 T320,40 M0,60 Q80,30 160,60 T320,60 M0,80 Q80,50 160,80 T320,80 M0,100 Q80,70 160,100 T320,100 M0,120 Q80,90 160,120 T320,120 M0,140 Q80,110 160,140 T320,140 M0,160 Q80,130 160,160 T320,160" fill="none" stroke="currentColor" strokeWidth="0.5" />
        
        {/* Mt. Fuji Watermark Outline (Lower-Left) */}
        <g transform="translate(20, 110)">
          <polygon points="50,10 75,70 25,70" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1" />
          <path d="M50,10 L45,25 L50,28 L55,25 Z" fill="currentColor" opacity="0.3" />
          <path d="M20,70 Q50,55 80,70" fill="none" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Cherry Blossom (Sakura) Watermark Outline (Upper-Right) */}
        <g transform="translate(180, 40) scale(0.9)">
          <path d="M50,20 C45,5 30,10 35,25 C20,20 15,35 30,40 C15,45 20,60 35,55 C30,70 45,65 50,50 C55,65 70,70 65,55 C80,60 85,45 70,40 C85,35 80,20 65,25 C70,10 55,5 50,20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="38" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </g>
      </svg>

      {/* Top Header Text */}
      <div className="text-center space-y-0.5 pb-1 border-b border-slate-400/80">
        <h5 className="font-mono tracking-widest text-[9px] font-bold text-slate-800 leading-none">
          JAPAN IMMIGRATION INSPECTOR
        </h5>
        <div className="flex items-center justify-center space-x-3 text-slate-900 py-0.5">
          <span className="font-serif-jp text-lg font-black tracking-[0.3em] leading-none">
            上 陸 許 可
          </span>
        </div>
        <h6 className="font-mono tracking-[0.15em] text-[11px] font-extrabold text-slate-900 leading-none">
          LANDING PERMISSION
        </h6>
      </div>

      {/* Structured Field Table (Matches Real Passport Sticker Layout) */}
      <div className="py-2 space-y-1.5 text-[10.5px] leading-tight font-mono text-slate-900 relative z-10">
        {/* Field 1: Date of permit */}
        <div className="flex justify-between items-center">
          <div className="text-[9.5px] text-slate-700">
            <div>許可年月日</div>
            <div className="text-[8.5px] text-slate-600 font-sans">Date of permit:</div>
          </div>
          <span className="font-mono font-black text-sm text-slate-950 tracking-wider bg-white/40 px-1.5 py-0.5 rounded border border-slate-300/50">
            {permitDate}
          </span>
        </div>

        {/* Field 2: Until */}
        <div className="flex justify-between items-center">
          <div className="text-[9.5px] text-slate-700">
            <div>在留期限</div>
            <div className="text-[8.5px] text-slate-600 font-sans">Until :</div>
          </div>
          <span className="font-mono font-black text-sm text-slate-950 tracking-wider bg-white/40 px-1.5 py-0.5 rounded border border-slate-300/50">
            {untilDate}
          </span>
        </div>

        {/* Field 3: Status */}
        <div className="flex justify-between items-center">
          <div className="text-[9.5px] text-slate-700">
            <div>在留資格</div>
            <div className="text-[8.5px] text-slate-600 font-sans">Status:</div>
          </div>
          <span className="font-serif-jp font-extrabold text-xs text-slate-900 tracking-wide">
            短 期 滯 在 <span className="font-sans font-normal text-[10px] text-slate-700">Temporary Visitor</span>
          </span>
        </div>

        {/* Field 4: Duration */}
        <div className="flex justify-between items-center pt-1 border-t border-slate-400/60">
          <div className="text-[9.5px] text-slate-700 flex items-center space-x-1">
            <span>在留期間</span>
            <span className="text-[8.5px] text-slate-600 font-sans">Duration:</span>
          </div>
          <span className="font-mono font-black text-xs text-slate-950 tracking-wider">
            90days
          </span>
        </div>
      </div>

      {/* Bottom Area: Serial Numbers + QR Code + Cyan Commemorative Stamp */}
      <div className="pt-2 border-t border-slate-400/80 flex items-end justify-between relative z-10">
        <div className="space-y-1">
          {/* Serial Number 1 */}
          <div className="font-mono text-[11px] font-bold tracking-widest text-slate-800">
            {numSerial}
          </div>
          {/* Barcode Code 2 */}
          <div className="font-mono text-xs font-black tracking-widest text-slate-950">
            {codeSerial}
          </div>

          {/* Cyan Commemorative Entry Stamp Box (Bottom Left Overlay) */}
          <div className="inline-block mt-1 px-2 py-0.5 border border-cyan-600 text-cyan-700 transform -rotate-6 rounded text-[10px] font-mono font-black tracking-wider bg-cyan-50/60 shadow-2xs">
            TOKYO 2026
          </div>
        </div>

        {/* Real 2D QR Code Element */}
        <PassportQRCodeSVG />
      </div>
    </div>
  );
};
