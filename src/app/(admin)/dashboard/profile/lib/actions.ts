import { schemaUser } from "@/lib/schema";
import supabase from "@/lib/supabase";
import { ActionResult } from "next/dist/server/app-render/types";

export async function updateProfile(_: unknown, formData: FormData, id: string | undefined): Promise<ActionResult> {
    const file = formData.get("profile_image") as File | null;

    const validate = schemaUser.safeParse({
        name: formData.get("name"),
    });

    if (!validate.success) {
        return {
            success: false,
            message: validate.error.errors[0].message,
        };
    }

    let profileImageUrl = null;

    if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `profile-${id}-${Date.now()}.${fileExt}`;
        const filePath = `users/${fileName}`;

        const { error: uploadError } = await supabase.storage
        .from("finance-bucket")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
        });

    
        if (uploadError) {
          console.error(uploadError.message);
          return {
            success: false,
            message: "Gagal mengunggah gambar profil",
          };
        }
    
        // 2. Get public URL
        const { data: publicUrlData } = supabase.storage
            .from("finance-bucket")
            .getPublicUrl(filePath);
    
        profileImageUrl = publicUrlData.publicUrl;
      }
    
    try {
        // 3. Update the user table
        const { error } = await supabase
            .from("users")
            .update({
                name: validate.data.name,
                email: validate.data.email,
                profile_image: profileImageUrl ?? undefined, // only update if image exists
                updatedAt: new Date().toISOString(),
            })
            .eq("id", id);

        if (error) throw error;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Gagal melakukan perubahan pada data profil",
        };
    }    

    return { 
        success: true,
        message: "Berhasil menyimpan perubahan pada data profil",
    };
}