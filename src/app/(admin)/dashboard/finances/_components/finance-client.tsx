"use client";

import { useModal } from "@/hooks/useModal";
import { ChevronDownIcon, CirclePlus, CircleX, Download, Search } from "lucide-react";
import Button from "@/components/ui/button/Button";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Table from "@/components/tables/Table";
import { Finance } from "@/types/finance";
import AddFinanceModal from "./modal/add-finance-modal";
import { useEffect, useState } from "react";
import EditFinanceModal from "./modal/edit-finance-modal";
import DeleteFinanceModal from "./modal/delete-finance-modal";
import { searchFinances } from "../lib/data";
import DetailFinanceModal from "./modal/detail-finance-modal";
import * as XLSX from "xlsx";
import { formatDate, formatRupiah } from "@/utils/format";
import Select from "@/components/form/Select";
import { getSourceOptions } from "@/utils/get_source_options";

export default function FinanceClient({ data }: { data: Finance[]  }) {
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
  
  const [finances, setFinances] = useState<Finance[]>(data);
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { name: "Sumber", key: "sources", have_relation: true, relation_key: "name" },
    { name: "Jenis", key: "type" },
    { name: "Jumlah", key: "amount", is_format_rupiah: true },
    { name: "Tanggal", key: "date", is_format_date: true },
  ];

  const handleNewData = (newFinance: Finance) => {
    setFinances((prev) => [newFinance, ...prev]);
    closeAddModal();
  };

  const handleUpdatedData = (updatedFinance: Finance) => {
    setFinances((prev) => [
      updatedFinance,
      ...prev.filter((item) => item.id !== updatedFinance.id),
    ]);
    closeEditModal();
  };

  const handleDeletedData = (id: string) => {
    setFinances((prev) => prev.filter((item) => item.id !== id));
    closeDeleteModal();
  };

  const handleEdit = (finance: Finance) => {
    setSelectedFinance(finance);
    openEditModal();
  };
  
  const handleDetail = (finance: Finance) => {
    setSelectedFinance(finance);
    openDetailModal();
  };

  const handleDelete = (finance: Finance) => {
    setSelectedFinance(finance);
    openDeleteModal();
  };  

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
  
    if (term.trim() === "") {
      setFinances(data);
      return;
    }
  
    const result = await searchFinances(term);
    setFinances(result);  
  };  

  const handleExportExcel = () => {
    const exportData = finances.map(({ sources, type, amount, description, date }) => ({
      "Sumber Pendapatan": sources.name,
      "Jenis": type,
      "Jumlah": formatRupiah(amount),
      "Deskripsi": description,
      "Tanggal": formatDate(date, false)
    }));

    // Prepare worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create a workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Finances");
  
    // Export to file
    XLSX.writeFile(workbook, "data-keuangan.xlsx");
  };

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>();

  const [sourceOptions, setSourceOptions] = useState([]);
  useEffect(() => {
    getSourceOptions().then(setSourceOptions);
  }, []);

  useEffect(() => {
    let filtered = [...data];

    // Filter by source
    if (selectedSource) {
      filtered = filtered.filter((finance) => finance.sourceId === selectedSource);
    }
  
    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(finance => finance.type === selectedType);
    }
  
    // Filter by period
    if (selectedPeriod) {
      const now = new Date();
      filtered = filtered.filter(finance => {
        const date = new Date(finance.date);
        if (selectedPeriod === "day") {
          return date.toDateString() === now.toDateString();
        } else if (selectedPeriod === "weekly") {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return date >= startOfWeek && date <= endOfWeek;
        } else if (selectedPeriod === "monthly") {
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        } else if (selectedPeriod === "yearly") {
          return date.getFullYear() === now.getFullYear();
        }
      });
    }
  
    setFinances(filtered);
  }, [selectedSource, data, selectedType, selectedPeriod]);
  

  const typeOptions = [
    { value: "pemasukan", label: "Pemasukan" },
    { value: "pengeluaran", label: "Pengeluaran" },
  ];
  const periodOptions = [
    { value: "day", label: "Hari Ini" },
    { value: "weekly", label: "Minggu Ini" },
    { value: "monthly", label: "Bulan Ini" },
    { value: "yearly", label: "Tahun Ini" },
  ];

  const clearFilter = () => {
    setSelectedType(null);
    setSelectedSource(null);
    setSelectedPeriod(null);
    setSearchTerm("");
    setFinances(data); // Reset to original data
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
          title="Data Keuangan"
          desc="Kelola keuangan Anda dan lihat grafik keuangan per harian, mingguan, bulanan bahkan tahunan di halaman dashboard"
        >
          <form className="relative">
            <Input
              placeholder="Cari data keuangan..."
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <Search size={15} />
            </span>
          </form>
          <div className="flex items-center justify-end space-x-2">
            <div className="relative">
              <Select
                options={sourceOptions}
                onChange={(value) => setSelectedSource(value)} 
                value={
                  selectedSource
                  ? sourceOptions.find(opt => opt.value === selectedSource)
                  : null
                }
                placeholder="Sumber Pendapatan"
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon size={18} />
              </span>
            </div>
            <div className="relative">
              <Select
                options={typeOptions}
                onChange={(value) => setSelectedType(value)}
                value={
                  selectedType
                  ? typeOptions.find(opt => opt.value === selectedType)
                  : null
                }
                placeholder="Jenis Keuangan"
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon size={18} />
              </span>
            </div>
            <div className="relative">
              <Select
                options={periodOptions}
                onChange={(value) => setSelectedPeriod(value)}
                value={
                  selectedPeriod
                  ? periodOptions.find(opt => opt.value === selectedPeriod)
                  : null
                }
                placeholder="Filter Waktu"
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon size={18} />
              </span>
            </div>
            <span onClick={clearFilter} className="border border-gray-300 cursor-pointer p-2.5 rounded-lg">
              <CircleX className="text-red-600" />
            </span>
          </div>
          <Table data={finances} columns={columns} handleDetail={handleDetail} handleEdit={handleEdit} handleDelete={handleDelete} />
        </ComponentCard>
      </div>

      <AddFinanceModal isOpen={isAddModalOpen} onSuccess={handleNewData} closeModal={closeAddModal} />
      <DetailFinanceModal isOpen={isDetailModalOpen} closeModal={closeDetailModal} data={selectedFinance} />
      <EditFinanceModal isOpen={isEditModalOpen} onSuccess={handleUpdatedData} closeModal={closeEditModal} data={selectedFinance} />
      <DeleteFinanceModal isOpen={isDeleteModalOpen} onSuccess={handleDeletedData} closeModal={closeDeleteModal} data={selectedFinance} />
    </>
  );
}