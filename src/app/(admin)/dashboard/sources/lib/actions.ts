"use server";

import { schemaSource } from "@/lib/schema";
import supabase from "@/lib/supabase";
import { ActionResult } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export async function postSource(_: unknown, formData: FormData): Promise<ActionResult> {
    const validate = schemaSource.safeParse({
        name: formData.get("name"),
        location: formData.get("location"),
    });

    if (!validate.success) {
        return {
            success: false,
            message: validate.error.errors[0].message,
        };
    }

    try {
        const { error } = await supabase.from("sources").insert([
            {
                id: uuidv4(),
                name: validate.data.name,
                location: validate.data.location,
            },
        ]);

        if (error) throw error; // Handle error if insert fails
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            message: "Gagal menambahkan sumber pendapatan baru",
        };
    }

    return { 
        success: true, 
        message: "Sumber pendapatan berhasil ditambahkan",
    };
}

export async function updateSource(_: unknown, formData: FormData, id: number | undefined): Promise<ActionResult> {
    const validate = schemaSource.safeParse({
        name: formData.get("name"),
        location: formData.get("location"),
    });

    if (!validate.success) {
        return {
            success: false,
            message: validate.error.errors[0].message,
        };
    }

    try {
        const { error } = await supabase.from("sources").update({
            name: validate.data.name,
            location: validate.data.location,
            updatedAt: new Date().toISOString()
        }).eq('id', id); // Update where id matches

        if (error) throw error; // Handle error if update fails
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
            message: "Gagal melakukan perubahan pada sumber pendapatan " + validate.data.name,
        };
    }

    return { 
        success: true,
        message: "Berhasil menyimpan perubahan pada data sumber pendapatan",
    };
}

export async function deleteSource(_: unknown, id: number | undefined): Promise<ActionResult> {
    try {
        const { error } = await supabase.from("sources").delete().eq('id', id); // Delete where id matches

        if (error) throw error; // Handle error if delete fails
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
            message: "Gagal menghapus sumber pendapatan",
        };
    }

    return { 
        success: true,
        message: "Berhasil menghapus sumber pendapatan",
    };
}