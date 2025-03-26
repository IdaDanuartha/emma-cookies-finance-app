// ChartTab.tsx
import React from "react";

type Filter = "day" | "weekly" | "monthly" | "yearly";

interface ChartTabProps {
  selected: Filter;
  onChange: (value: Filter) => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ selected, onChange }) => {
  const getButtonClass = (option: Filter) =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="grid xsm:w-auto w-full xsm:grid-cols-4 grid-cols-2 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      {(["day", "weekly", "monthly", "yearly"] as Filter[]).map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`px-3 py-2 font-medium w-full text-nowrap rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(filter)}`}
        >
          {{
            day: "Hari Ini",
            weekly: "Minggu Ini",
            monthly: "Bulan Ini",
            yearly: "Tahun Ini",
          }[filter]}
        </button>
      ))}
    </div>
  );
};

export default ChartTab;
