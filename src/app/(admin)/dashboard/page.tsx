import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/analytics/EcommerceMetrics";
import React from "react";
import SourceSalesChart from "@/components/analytics/SourceSalesChart";
import StatisticsChart from "@/components/analytics/StatisticsChart";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />

        <SourceSalesChart />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>
    </div>
  );
}
