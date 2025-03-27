import supabase from "@/lib/supabase";

export async function getSourceOptions(showAllOption = true) {
  try {
    const { data, error } = await supabase
      .from("sources")
      .select("id, name")
      .order("updatedAt", { ascending: false });

    if (error) throw error;

    const options = data.map((source) => ({
      value: source.id,
      label: source.name,
    }));

    const allOption = { value: "", label: "Semua" };

    if(showAllOption) {
      return [
        allOption,
        ...options,
      ];
    }
    return [
      ...options,
    ];

  } catch (error) {
    console.error("Failed to fetch source options:", error);
    if(showAllOption) {
      return [
        { value: "", label: "Semua" },
      ];
    } else {
      return []
    }
  }
}