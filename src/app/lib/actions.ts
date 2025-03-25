"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const getLoggedInUser = async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if(user) {
        const { data, error } = await supabase
            .from('users')
            .select('name, email, role, profile_image')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data
    }

    return null
}

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
};