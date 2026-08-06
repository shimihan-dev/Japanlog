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
    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 transition-colors">
      <button
        type="button"
        onClick={() => onChangeStatus("unvisited")}
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
          status === "unvisited"
            ? "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
      >
        미방문
      </button>

      <button
        type="button"
        onClick={() => onChangeStatus("transit")}
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
          status === "transit"
            ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
      >
        경유
      </button>

      <button
        type="button"
        onClick={() => onChangeStatus("visited")}
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
          status === "visited"
            ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-cyan-300 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
      >
        방문
      </button>
    </div>
  );
};
