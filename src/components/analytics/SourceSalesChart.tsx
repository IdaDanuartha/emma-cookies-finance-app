'use client';

import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { getTotalAmountsYearly } from "@/app/(admin)/dashboard/finances/lib/data";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function SourceSalesChart() {
  const [options, setOptions] = useState<ApexOptions>();
  const [series, setSeries] = useState<ApexAxisChartSeries>([]);

  useEffect(() => {
    async function loadChart() {
      const totals = await getTotalAmountsYearly();
      
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
          categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
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
          data: totals
        },
      ]);
    }

    loadChart();
  }, []);

  if (!options || !series.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Total Pendapatan Tahun {new Date().getFullYear()}
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
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