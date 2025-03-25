import supabase from "@/lib/supabase";

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

export async function getTotalAmountsBySource() {
  try {
    const { data, error } = await supabase
      .from('finances')
      .select(`
        sourceId,
        sources(name),
        amount
      `);

    if (error) throw error;

    const grouped = data.reduce((acc, item) => {
      const sourceId = item.sourceId;
      const name = item.sources?.name || "Unknown";

      if (!acc[sourceId]) {
        acc[sourceId] = { name, total: 0 };
      }

      acc[sourceId].total += item.amount || 0;

      return acc;
    }, {} as Record<string, { name: string; total: number }>);

    console.log(grouped)
    // Ubah menjadi array agar bisa dipakai di chart
    const result = Object.values(grouped);
    console.log(result)

    return result;
  } catch (error) {
    console.error("Error fetching grouped totals:", error);
    return [];
  }
}

export async function getTotalAmounts() {
  try {
      const { data, error } = await supabase
        .from('finances')
        .select('amount');

      if (error) throw error;

      const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);

      return total;
  } catch (error) {
      console.error(error);
      return [];
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