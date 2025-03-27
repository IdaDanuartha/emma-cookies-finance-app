"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { getTotalAmountsBySource } from "@/app/(admin)/dashboard/finances/lib/data";
import ChartTab from "../common/ChartTab";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Filter = "day" | "weekly" | "monthly" | "yearly";

export default function StatisticsChart() {
  const [options, setOptions] = useState<ApexOptions>();
  const [series, setSeries] = useState<ApexAxisChartSeries>([]);
  const [selectedTab, setSelectedTab] = useState<Filter>("day");

  useEffect(() => {
    async function loadChart(filter: Filter) {
      // Map UI values to API values
      const mappedFilter = {
        day: "day",
        weekly: "week",
        monthly: "month",
        yearly: "year",
      }[filter] as "day" | "week" | "month" | "year";
      
      const salesData = await getTotalAmountsBySource(mappedFilter);

      const sourceNames = salesData.map((item) => item.name);
      const totals = salesData.map((item) => item.total);

      setOptions({
        colors: ["#465fff"],
        chart: {
          fontFamily: "Outfit, sans-serif",
          type: "bar",
          height: 180,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "39%",
            borderRadius: 5,
            borderRadiusApplication: "end",
          },
        },
        dataLabels: { enabled: false },
        stroke: {
          show: true,
          width: 4,
          colors: ["transparent"],
        },
        xaxis: {
          categories: sourceNames,
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "left",
          fontFamily: "Outfit",
        },
        yaxis: { title: { text: undefined } },
        grid: {
          yaxis: { lines: { show: true } },
        },
        fill: { opacity: 1 },
        tooltip: {
          x: { show: true },
          y: { formatter: (val: number) => `${val}` },
        },
      });

      setSeries([
        {
          name: "Total Pendapatan",
          data: totals,
        },
      ]);
    }

    loadChart(selectedTab);
  }, [selectedTab]);

  if (!options || !series.length) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik Pendapatan
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Lihat laporan pendapatan dari masing-masing sumber tiap hari, minggu, bulan dan tahun
          </p>
        </div>
        <div className="flex items-center w-full gap-3 sm:justify-end">
          <ChartTab selected={selectedTab} onChange={setSelectedTab} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}