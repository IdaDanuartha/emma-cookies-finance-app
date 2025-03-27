"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { updateFinance } from "../../lib/actions";
import { schemaFinance } from "@/lib/schema";
import { toast } from "react-toastify";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "lucide-react";
import { getSourceOptions } from "@/utils/get_source_options";
import { formatDateInput } from "@/utils/format";
import { Finance } from "@/types/finance";
import { z } from "zod";

export default function EditFinanceModal({
  isOpen,
  closeModal,
  onSuccess,
  data
}: {
  isOpen: boolean
  closeModal: () => void
  onSuccess: (newFinance: Finance) => void
  data?: Finance | null
}) {
  const [form, setForm] = useState({
    id: "",
    sourceId: "",
    type: "",
    amount: 0,
    description: "",
    date: "",
    sources: {
      name: ""
    }
  });

  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sourceOptions, setSourceOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id || "",
        sourceId: data.sourceId || "",
        type: data.type || "",
        amount: data.amount || 0,
        description: data.description || "",
        date: data.date ? formatDateInput(data.date) : "",
        sources: {
          name: data.sources.name
        }
      });
      setSelectedSource(data.sourceId);
      setSelectedType(data.type);
    }

  }, [data]);


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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // const result = schemaFinance.safeParse(form);
    // if (!result.success) {
    //   const fieldErrors = result.error.flatten().fieldErrors;
    //   setErrors({
    //     sourceId: fieldErrors.sourceId?.[0] || "",
    //     type: fieldErrors.type?.[0] || "",
    //     amount: fieldErrors.amount?.[0] || "",
    //     description: fieldErrors.description?.[0] || "",
    //     date: fieldErrors.date?.[0] || "",
    //   });
    //   return;
    // }

    const formData = new FormData();
    formData.append("sourceId", form.sourceId);
    formData.append("type", form.type);
    formData.append("amount", form.amount.toString());
    formData.append("description", form.description);
    formData.append("date", form.date);

    const response = await updateFinance(undefined, formData, data?.id);

    if (response.success) {
      onSuccess(form)
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    closeModal();
  };

  useEffect(() => {
    getSourceOptions().then(setSourceOptions);
  }, []);

  useEffect(() => {
    if (selectedSource !== null) {
      const selectedSourceOption = sourceOptions.find(
        (opt) => opt.value === selectedSource
      );
      
      setForm((prev) => ({
        ...prev,
        sourceId: selectedSource,
        sources: {
          name: selectedSourceOption ? selectedSourceOption.label : "",
        },  
      }));
      // validateField("sourceId", selectedSource);
    }
  }, [selectedSource, sourceOptions]);

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
      // validateField("type", selectedType);
    }
  }, [selectedType]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <form onSubmit={handleUpdate}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Edit Sumber Pendapatan
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label className="mb-2">Sumber Pendapatan</Label>
            <div className="relative">
              <Select
                options={sourceOptions}
                onChange={(value) => setSelectedSource(value)} 
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
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
