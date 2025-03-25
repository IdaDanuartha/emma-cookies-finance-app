"use client";

import { useModal } from "@/hooks/useModal";
import { CirclePlus, Download, Search } from "lucide-react";
import Button from "@/components/ui/button/Button";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Table from "@/components/tables/Table";
import { Source } from "@/types/source";
import AddSourceModal from "./modal/add-source-modal";
import { useState } from "react";
import EditSourceModal from "./modal/edit-source-modal";
import DeleteSourceModal from "./modal/delete-source-modal";
import { searchSources } from "../lib/data";
import DetailSourceModal from "./modal/detail-source-modal";
import * as XLSX from "xlsx";
import { formatDate } from "@/utils/format";

export default function SourcePageClient({ data }: { data: Source[]  }) {
  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();
  
  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const {
    isOpen: isDetailModalOpen,
    openModal: openDetailModal,
    closeModal: closeDetailModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  
  const [sources, setSources] = useState<Source[]>(data);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { name: "Nama", key: "name" },
    { name: "Lokasi", key: "location" },
  ];

  const handleNewData = (newSource: Source) => {
    setSources((prev) => [newSource, ...prev]);
    closeAddModal();
  };

  const handleUpdatedData = (updatedSource: Source) => {
    setSources((prev) => [
      updatedSource,
      ...prev.filter((item) => item.id !== updatedSource.id),
    ]);
    closeEditModal();
  };

  const handleDeletedData = (id: string) => {
    setSources((prev) => prev.filter((item) => item.id !== id));
    closeDeleteModal();
  };

  const handleEdit = (source: Source) => {
    setSelectedSource(source);
    openEditModal();
  };
  
  const handleDetail = (source: Source) => {
    setSelectedSource(source);
    openDetailModal();
  };

  const handleDelete = (source: Source) => {
    setSelectedSource(source);
    openDeleteModal();
  };  

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
  
    if (term.trim() === "") {
      setSources(data);
      return;
    }
  
    const result = await searchSources(term);
    setSources(result);  
  };  

  const handleExportExcel = () => {
    const exportData = sources.map(({ name, location, updatedAt }) => ({
      Nama: name,
      Lokasi: location,
      "Terakhir Diperbarui": formatDate(updatedAt)
    }));

    // Prepare worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create a workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sources");
  
    // Export to file
    XLSX.writeFile(workbook, "data-sumber-pendapatan.xlsx");
  };

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        <Button
          className="cursor-pointer text-sm mr-4"
          size="sm"
          variant="outline"
          onClick={handleExportExcel}
        >
          <Download size={15} />
          Export ke Excel
        </Button>
        <Button
          className="cursor-pointer text-sm"
          size="sm"
          variant="primary"
          onClick={openAddModal}
        >
          <CirclePlus size={15} />
          Tambah Data
        </Button>
      </div>

      <div className="space-y-6">
        <ComponentCard
          title="Data Sumber Pendapatan"
          desc="Kelola sumber tempat penghasilan Anda dan lihat pendapatan dari masing-masing toko"
        >
          <form className="relative">
            <Input
              placeholder="Cari data sumber pendapatan..."
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <Search size={15} />
            </span>
          </form>
          <Table data={sources} columns={columns} handleDetail={handleDetail} handleEdit={handleEdit} handleDelete={handleDelete} />
        </ComponentCard>
      </div>

      <AddSourceModal isOpen={isAddModalOpen} onSuccess={handleNewData} closeModal={closeAddModal} />
      <DetailSourceModal isOpen={isDetailModalOpen} closeModal={closeDetailModal} data={selectedSource} />
      <EditSourceModal isOpen={isEditModalOpen} onSuccess={handleUpdatedData} closeModal={closeEditModal} data={selectedSource} />
      <DeleteSourceModal isOpen={isDeleteModalOpen} onSuccess={handleDeletedData} closeModal={closeDeleteModal} data={selectedSource} />
    </>
  );
}