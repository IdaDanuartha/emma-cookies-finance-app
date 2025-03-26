"use server";

import { schemaFinance } from "@/lib/schema";
import supabase from "@/lib/supabase";
import { ActionResult } from "next/dist/server/app-render/types";
import { v4 as uuidv4 } from 'uuid';

export async function postFinance(_: unknown, formData: FormData): Promise<ActionResult> {
    const validate = schemaFinance.safeParse({
        sourceId: formData.get("sourceId"),
        type: formData.get("type"),
        amount: formData.get("amount"),
        description: formData.get("description"),
        date: formData.get("date"),
    });

    if (!validate.success) {
        return {
            success: false,
            message: validate.error.errors[0].message,
        };
    }

    try {
        const { error } = await supabase.from("finances").insert([
            {
                id: uuidv4(),
                sourceId: validate.data.sourceId,
                type: validate.data.type,
                amount: validate.data.amount,
                description: validate.data.description,
                date: validate.data.date,
            },
        ]);

        if (error) throw error; // Handle error if insert fails
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Gagal menambahkan data keuangan",
        };
    }

    return { 
        success: true, 
        message: "Keuangan berhasil ditambahkan",
    };
}

export async function updateFinance(_: unknown, formData: FormData, id: string | undefined): Promise<ActionResult> {
    const validate = schemaFinance.safeParse({
        sourceId: formData.get("sourceId"),
        type: formData.get("type"),
        amount: formData.get("amount"),
        description: formData.get("description"),
        date: formData.get("date"),
    });

    if (!validate.success) {
        return {
            success: false,
            message: validate.error.errors[0].message,
        };
    }

    try {
        const { error } = await supabase.from("finances").update({
            sourceId: validate.data.sourceId,
            type: validate.data.type,
            amount: validate.data.amount,
            description: validate.data.description,
            date: validate.data.date,
            updatedAt: new Date().toISOString()
        }).eq('id', id); // Update where id matches

        if (error) throw error; // Handle error if update fails
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Gagal melakukan perubahan pada data keuangan",
        };
    }

    return { 
        success: true,
        message: "Berhasil menyimpan perubahan pada data keuangan",
    };
}

export async function deleteFinance(_: unknown, id: string | undefined): Promise<ActionResult> {
    try {
        const { error } = await supabase.from("finances").delete().eq('id', id); // Delete where id matches

        if (error) throw error; // Handle error if delete fails
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Gagal menghapus keuangan",
        };
    }

    return { 
        success: true,
        message: "Berhasil menghapus keuangan",
    };
}