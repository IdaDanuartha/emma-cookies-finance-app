import supabase from "@/lib/supabase";

export async function getSources() {
    try {
        const { data, error } = await supabase.from('sources').select('*').order("updatedAt", {
            ascending: false
        });

        if (error) throw error;

        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function searchSources(term: string) {
    try {
      const { data, error } = await supabase
        .from("sources")
        .select("*")
        .or(`name.ilike.%${term}%,location.ilike.%${term}%`)
        .order("updatedAt", { ascending: false });
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
}  

export async function getSourceById(id: string) {
    try {
        const { data, error } = await supabase
            .from('sources')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}