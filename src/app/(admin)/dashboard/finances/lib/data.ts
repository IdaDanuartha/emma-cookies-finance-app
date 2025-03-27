import supabase from "@/lib/supabase";
import { getSourceById } from "../../sources/lib/data";

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
    const now = new Date();
    let fromDate: Date;

    switch (filter) {
      case 'day':
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week': {
        const dayOfWeek = now.getDay(); // 0 = Sunday
        const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Get last Monday
        fromDate = new Date(now.getFullYear(), now.getMonth(), diffToMonday);
        break;
      }
      case 'month':
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
      default:
        fromDate = new Date(now.getFullYear(), 0, 1);
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

export async function getTotalAmountsByType(type: 'pemasukan' | 'pengeluaran') {
  try {
    const { data, error } = await supabase
      .from('finances')
      .select('amount')
      .eq('type', type);

    if (error) throw error;

    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);

    return total;
  } catch (error) {
    console.error(error);
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