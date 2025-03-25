"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { formatDate, formatRupiah } from "@/utils/format";

export default function DetailFinanceModal({
  isOpen,
  closeModal,
  data
}: {
  isOpen: boolean
  closeModal: () => void
  data
}) {
  const [form, setForm] = useState({
    id: "",
    sourceName: "",
    type: "",
    amount: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id || "",
        sourceName: data.sources.name || "",
        type: data.type || "",
        amount: data.amount || "",
        description: data.description || "",
        date: data.date || "",
      });
    }
  }, [data]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <form>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Detail Keuangan
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
            <Label className="mb-2">Sumber Pendapatan</Label>
            <Input
              name="amount"
              value={form.sourceName}
              type="text"
              disabled
            />
          </div>
          
          <div className="col-span-1">
            <Label className="mb-2">Jenis Keuangan</Label>
            <Input
              name="amount"
              value={form.type}
              type="text"
              className="capitalize"
              disabled
            />
          </div>

          <div className="col-span-1">
            <Label className="mb-2">Jumlah</Label>
            <Input
              name="amount"
              value={formatRupiah(form.amount)}
              type="text"
              disabled
            />
          </div>
          
          <div className="col-span-1">
            <Label className="mb-2">Tanggal</Label>
            <Input
              name="date"
              value={formatDate(form.date, false)}
              type="text"
              disabled
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label className="mb-2">Deskripsi (opsional)</Label>
            <Input
              name="description"
              value={form.description}
              type="text"
              disabled
              placeholder="-"
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={closeModal} type="button">
            Batal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
