import React from "react";
import { HandCoins, Store } from "lucide-react";
import { getSources } from "@/app/(admin)/dashboard/sources/lib/data";
import { getTotalAmountsByType } from "@/app/(admin)/dashboard/finances/lib/data";
import { formatRupiah } from "@/utils/format";

export const EcommerceMetrics = async () => {
  const totalSources = await getSources()
  const totalIncomes = await getTotalAmountsByType('pemasukan')
  const totalExpenses = await getTotalAmountsByType('pengeluaran')

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Store className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Sumber Pendapatan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalSources.length}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <HandCoins className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Pemasukan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatRupiah(totalIncomes)}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <HandCoins className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Pengeluaran
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatRupiah(totalExpenses)}
            </h4>
          </div>
        </div>
      </div>

    </div>
  );
};
