import supabase from "@/lib/supabase";
import { getSourceById } from "../../sources/lib/data";
import {
  getStartOfDayGMT8,
  getStartOfWeekGMT8,
  getStartOfMonthGMT8,
  getStartOfYearGMT8,
} from "@/utils/date_utils";

export async function getFinances() {
    try {
        const { data, error } = await supabase
            .from('finances')
            .select(`
                *,
                sources (
                  name,
                  location
                )
            `)
            .order("updatedAt", {
                ascending: false
            }
        );

        if (error) throw error;

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

type FinanceSummary = {
  sourceId: string;
  amount: number;
  date: string;
  sources: {
    name: string;
  }[];
};

export async function getTotalAmountsBySource(filter: 'day' | 'week' | 'month' | 'year' = 'year') {
  try {
    let fromDate: Date;

    switch (filter) {
      case "day":
        fromDate = getStartOfDayGMT8();
        break;
      case "week":
        fromDate = getStartOfWeekGMT8();
        break;
      case "month":
        fromDate = getStartOfMonthGMT8();
        break;
      case "year":
      default:
        fromDate = getStartOfYearGMT8();
        break;
    }

    const { data, error } = await supabase
      .from('finances')
      .select(`
        sourceId,
        sources(name),
        amount,
        date
      `)
      .gte('date', fromDate.toISOString());

    if (error) throw error;

    const grouped: Record<string, { name: string; total: number }> = {};

    for (const item of data as FinanceSummary[]) {
      const sourceId = item.sourceId;

      // Get the source name asynchronously
      const source = await getSourceById(sourceId);
      const name = source?.name || "-";

      if (!grouped[sourceId]) {
        grouped[sourceId] = { name, total: 0 };
      }

      grouped[sourceId].total += item.amount || 0;
    }

    // Return the grouped data as an array
    return Object.values(grouped);
  } catch (error) {
    console.error("Error fetching grouped totals:", error);
    return [];
  }
}

export async function getTotalAmountsByType(
  type: "pemasukan" | "pengeluaran",
  filter: "day" | "week" | "month" | "year" | "all" = "all"
) {
  try {
    let fromDate: Date;

    switch (filter) {
      case "day":
        fromDate = getStartOfDayGMT8();
        break;
      case "week":
        fromDate = getStartOfWeekGMT8();
        break;
      case "month":
        fromDate = getStartOfMonthGMT8();
        break;
      case "year":
        fromDate = getStartOfYearGMT8();
        break;
      case "all":
      default:
        fromDate = new Date(0); // Get all records if filter is "all"
        break;
    }

    const { data, error } = await supabase
      .from("finances")
      .select("amount")
      .eq("type", type)
      .gte("date", fromDate.toISOString());

    if (error) throw error;

    // Calculate the total amount for the selected type
    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);

    return total;
  } catch (error) {
    console.error("Error fetching total amount by type:", error);
    return 0;
  }
}

export async function getTotalAmountsYearly(year = new Date().getFullYear()) {
  try {
    const { data, error } = await supabase
      .from('finances')
      .select('amount, date')
      .gte('date', `${year}-01-01`)
      .lte('date', `${year}-12-31`)
      .eq('type', 'pemasukan');

    if (error) throw error;

    // Initialize array with 12 months
    const monthlyTotals = Array(12).fill(0);

    data.forEach(({ amount, date }) => {
      const month = new Date(date).getMonth();
      monthlyTotals[month] += amount || 0;
    });

    return monthlyTotals;
  } catch (error) {
    console.error(error);
    return Array(12).fill(0);
  }
}

export async function searchFinances(term: string) {
    try {
      const isNumeric = !isNaN(Number(term));
      let query = supabase
        .from("finances")
        .select(`
          *,
          sources!inner (
            name,
            location
          )
        `)
        .order("updatedAt", { ascending: false });
  
      // Build filters
      const filters = [`description.ilike.%${term}%`];
  
      if (isNumeric) {
        filters.push(`amount.eq.${Number(term)}`);
      }
  
    query = query.or(filters.join(","));
  
    query = query.ilike("sources.name", `%${term}%`)
  
      const { data, error } = await query;
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
}  

export async function getFinanceById(id: string) {
    try {
        const { data, error } = await supabase
            .from('finances')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}