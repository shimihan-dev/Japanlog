import React from "react";
import type { VisitStatus } from "../types/travel";

interface StatusSelectorProps {
  status: VisitStatus;
  onChangeStatus: (newStatus: VisitStatus) => void;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  status,
  onChangeStatus,
}) => {
  return (
    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChangeStatus("unvisited")}
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
          status === "unvisited"
            ? "bg-white text-slate-700 shadow-sm"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        미방문
      </button>

      <button
        type="button"
        onClick={() => onChangeStatus("transit")}
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
          status === "transit"
            ? "bg-white text-emerald-700 shadow-sm"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        경유
      </button>

      <button
        type="button"
        onClick={() => onChangeStatus("visited")}
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
          status === "visited"
            ? "bg-white text-blue-700 shadow-sm"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        방문
      </button>
    </div>
  );
};
