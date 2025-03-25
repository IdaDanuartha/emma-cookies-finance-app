import supabase from "@/lib/supabase";

export async function getSourceOptions() {
    try {
      const { data, error } = await supabase
        .from("sources")
        .select("id, name")
        .order("updatedAt", { ascending: false });
  
      if (error) throw error;
  
      return data.map((source) => ({
        value: source.id,
        label: source.name,
      }));
    } catch (error) {
      console.error("Failed to fetch source options:", error);
      return [];
    }
  }
  