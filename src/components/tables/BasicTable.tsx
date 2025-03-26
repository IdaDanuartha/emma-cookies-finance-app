import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Pencil, Trash } from "lucide-react";
import { formatDate, formatRupiah } from "@/utils/format";
import { Column } from "@/types/column";

// ✅ Remove T from here
type BasicTableProps<T extends { id: string }> = {
  columns: Column[];
  data: T[];
  handleDetail: (item: T) => void;
  handleEdit: (item: T) => void;
  handleDelete: (item: T) => void;
  currentPage: number;
  pageSize: number;
};

// ✅ Add T to the component definition
function BasicTable<T extends { id: string; [key: string]: any }>({
  columns = [],
  data,
  handleDetail,
  handleEdit,
  handleDelete,
  currentPage,
  pageSize,
}: BasicTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  No
                </TableCell>
                {columns.map((column, index) => (
                  <TableCell key={index} className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {column.name}
                  </TableCell>
                ))}
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" />
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    Tidak ada data yang tersedia
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id} className="cursor-pointer">
                    <TableCell onClick={() => handleDetail(item)} className="px-5 py-3 text-gray-700 dark:text-gray-400">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        onClick={() => handleDetail(item)}
                        key={column.key}
                        className="px-5 py-3 capitalize text-gray-700 dark:text-gray-400"
                      >
                        {item[column.key] === "" || item[column.key] == null
                          ? "-"
                          : column.is_format_rupiah
                          ? formatRupiah(item[column.key])
                          : column.is_format_date
                          ? formatDate(item[column.key], false)
                          : column.have_relation && column.relation_key
                          ? item[column.key]?.[column.relation_key]
                          : item[column.key]}                        
                      </TableCell>
                    ))}
                    <TableCell className="px-5 py-3 flex items-center text-gray-700 dark:text-gray-400">
                      <button
                        onClick={() => handleEdit(item)}
                        className="duration-200 hover:bg-amber-100/50 p-2 group rounded-full"
                      >
                        <Pencil size={16} className="group-hover:text-amber-600 duration-200" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="duration-200 hover:bg-red-100/50 p-2 group rounded-full"
                      >
                        <Trash size={16} className="group-hover:text-red-600 duration-200" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default BasicTable;