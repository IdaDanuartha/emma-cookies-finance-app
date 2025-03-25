import { z } from "zod";

export const ALLOW_MIME_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/svg", "image/webp"];

export const schemaSignIn = z.object({
	email: z
		.string({ required_error: "Email wajib diisi" })
		.email({ message: "Email tidak valid" }),
	password: z
		.string({ required_error: "Password wajib diisi" })
		.min(6, { message: "Password harus memiliki minimal 6 karakter" }),
});

export const schemaSource = z.object({
	name: z
		.string({ required_error: "Sumber pendapatan wajib diisi" })
		.min(1, { message: "Sumber pendapatan wajib diisi" }),
	location: z.string().optional()
});

export const schemaFinance = z.object({
	sourceId: z
		.string({ required_error: "Sumber pendapatan wajib diisi" })
		.min(1, { message: "Sumber pendapatan wajib diisi" }),
	type: z
		.string({ required_error: "Jenis keuangan wajib diisi" })
		.min(1, { message: "Jenis keuangan wajib diisi" }),
	amount: z
		.string({ required_error: "Jumlah wajib diisi", message: "Jumlah harus berupa angka" })
		.min(1, { message: "Jumlah wajib diisi" }),
	description: z
		.string()
		.optional(),
	date: z
		.string({ required_error: "Tanggal wajib diisi" })
		.min(1, { message: "Tanggal wajib diisi" }),
});

export const schemaUser = z.object({
	name: z
		.string({ required_error: "Nama wajib diisi" })
		.min(4, { message: "Name harus memiliki minimal 4 karakter" }),
	profile_image: z
		.any()
		.refine((files: FileList | File[]) => files && files.length === 1, {
		  message: "Upload hanya 1 gambar saja",
		})
		.refine((files: FileList | File[]) => {
		  const file = files[0];
		  return file && ALLOW_MIME_TYPES.includes(file.type);
		}, {
		  message: "File yang diupload harus berupa image (jpg, png, webp)",
		}),	
});