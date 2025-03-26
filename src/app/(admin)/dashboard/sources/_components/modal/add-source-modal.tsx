"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { postSource } from "../../lib/actions";
import { schemaSource } from "@/lib/schema";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Source } from "@/types/source";
import { z } from "zod";

export default function AddSourceModal({
  isOpen,
  closeModal,
  onSuccess,
}: {
  isOpen: boolean
  closeModal: () => void
  onSuccess: (newSource: Source) => void
}) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    location: "",
    updatedAt: "",
  });

  type SourceForm = z.infer<typeof schemaSource>;
  const [errors, setErrors] = useState<Partial<Record<keyof SourceForm, string>>>({});

  const validateField = (field: keyof SourceForm, value: string) => {
    const partialObject = { ...form, [field]: value };
    const result = schemaSource.safeParse(partialObject);
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors[field];
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError ? fieldError[0] : "",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof SourceForm, value);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schemaSource.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0] || "",
        location: fieldErrors.location?.[0] || "",
        updatedAt: fieldErrors.updatedAt?.[0] || "",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("location", form.location);
    formData.append("updatedAt", form.updatedAt);

    const response = await postSource(undefined, formData);

    if (response.success) {
        onSuccess(form)
        setForm({ id: "", name: "", location: "", updatedAt: "" });
        toast.success(response.message);
    } else {
        toast.error(response.message);
    }
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <form onSubmit={handleSave}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Tambah Sumber Pendapatan
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label className="mb-2">Nama Sumber</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Contoh: Toko A"
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label className="mb-2">Lokasi (opsional)</Label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              type="text"
              placeholder="Contoh: Jakarta"
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={closeModal} type="button">
            Batal
          </Button>
          <Button size="sm" type="submit">
            Tambah Data
          </Button>
        </div>
      </form>
    </Modal>
  );
}
