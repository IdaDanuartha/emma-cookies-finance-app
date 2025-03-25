"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

export default function DetailSourceModal({
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
    name: "",
    location: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id || "",
        name: data.name || "",
        location: data.location || "",
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
          Detail Sumber Pendapatan
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label className="mb-2">Nama Sumber</Label>
            <Input
              name="name"
              value={form.name}
              type="text"
              disabled
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label className="mb-2">Lokasi (opsional)</Label>
            <Input
              name="location"
              value={form.location === '' ? '-' : form.location}
              type="text"
              disabled
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
