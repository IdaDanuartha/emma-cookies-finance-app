import supabase from "@/lib/supabase";

export async function getSourceOptions() {
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

    return [
      { value: "", label: "Semua" },
      ...options,
    ];
  } catch (error) {
    console.error("Failed to fetch source options:", error);
    return [
      { value: "", label: "Semua" },
    ];
  }
}