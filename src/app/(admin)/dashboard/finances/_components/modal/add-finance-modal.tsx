"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { postFinance } from "../../lib/actions";
import { schemaFinance } from "@/lib/schema";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "@/components/form/Select";
import { getSourceOptions } from "@/utils/get_source_options";
import { ChevronDownIcon } from "lucide-react";
import { Finance } from "@/types/finance";
import { z } from "zod";

export default function AddFinanceModal({
  isOpen,
  closeModal,
  onSuccess,
}: {
  isOpen: boolean
  closeModal: () => void
  onSuccess: (newFinance: Finance) => void
}) {
  const [form, setForm] = useState({
    id: "",
    sourceId: "",
    type: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
    sources: {
      name: "",
    }
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FinanceForm, string>>>({});
  type FinanceForm = z.infer<typeof schemaFinance>;

  const validateField = (field: keyof FinanceForm, value: string) => {
    const partialObject = { ...form, [field]: value };
    const result = schemaFinance.safeParse(partialObject);
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
    validateField(name as keyof FinanceForm, value);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schemaFinance.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        sourceId: fieldErrors.sourceId?.[0] || "",
        type: fieldErrors.type?.[0] || "",
        amount: fieldErrors.amount?.[0] || "",
        description: fieldErrors.description?.[0] || "",
        date: fieldErrors.date?.[0] || "",
      });
      return;
    }

    const formData = new FormData();
    formData.append("sourceId", form.sourceId);
    formData.append("type", form.type);
    formData.append("amount", form.amount.toString());
    formData.append("description", form.description);
    formData.append("date", form.date);

    const response = await postFinance(undefined, formData);
    if (response.success) {
      onSuccess(form)
      setForm({id: "", sourceId: "", type: "", amount: 0, description: "", date: "", sources: {name: ""}});
      toast.success(response.message);
    } else {
        toast.error(response.message);
    }
    closeModal();
  };

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [sourceOptions, setSourceOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getSourceOptions(false).then(setSourceOptions);
  }, []);

  useEffect(() => {
    if (selectedSource !== null) {
      setForm((prev) => ({
        ...prev,
        sourceId: selectedSource,
      }));
      validateField("sourceId", selectedSource);
    }
  }, [selectedSource, validateField]);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const typeOptions = [
    { value: "pemasukan", label: "Pemasukan" },
    { value: "pengeluaran", label: "Pengeluaran" },
  ];

  useEffect(() => {
    if (selectedType !== null) {
      setForm((prev) => ({
        ...prev,
        type: selectedType,
      }));
      validateField("type", selectedType);
    }
  }, [selectedType, validateField]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <form onSubmit={handleSave}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Tambah Keuangan
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label className="mb-2">Sumber Pendapatan</Label>
            <div className="relative">
              <Select
                options={sourceOptions}
                onChange={(value) => {
                  const selected = sourceOptions.find(opt => opt.value === value);
            
                  setSelectedSource(value);
                  setForm((prev) => ({
                    ...prev,
                    sources: {
                      name: selected?.label || "",
                    },
                  }));
                }}              
                defaultValue={
                  selectedSource
                  ? sourceOptions.find(opt => opt.value === selectedSource)?.value
                  : ""
                }
                placeholder="Pilih sumber pendapatan"
                className={errors.sourceId ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon size={18} />
              </span>
            </div>
            {errors.sourceId && (
              <p className="text-sm text-red-500 mt-1">{errors.sourceId}</p>
            )}
          </div>

          <div className="col-span-1">
            <Label className="mb-2">Jenis Keuangan</Label>
            <div className="relative">
              <Select
                options={typeOptions}
                onChange={(value) => setSelectedType(value)} 
                defaultValue={
                  selectedType
                  ? typeOptions.find(opt => opt.value === selectedType)?.value
                  : ""
                }
                placeholder="Pilih jenis keuangan"
                className={errors.type ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon size={18} />
              </span>
            </div>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type}</p>
            )}
          </div>

          <div className="col-span-1">
            <Label className="mb-2">Jumlah</Label>
            <Input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              type="number"
              placeholder="Rp100.000"
              className={errors.amount ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
            )}
          </div>
          
          <div className="col-span-1">
            <Label className="mb-2">Tanggal</Label>
            <Input
              name="date"
              value={form.date}
              onChange={handleChange}
              type="date"
              className={errors.date ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label className="mb-2">Deskripsi (opsional)</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              type="text"
              autoComplete="off"
              placeholder="Deskripsi keuangan..."
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
