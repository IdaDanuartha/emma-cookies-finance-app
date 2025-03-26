"use client";

import { useState } from "react";
import BasicTable from "./BasicTable";
import Pagination from "./Pagination";
import { Column } from "@/types/column";

type TableProps<T extends { id: string }> = {
  data: T[];
  columns: Column[];
  itemsPerPage?: number;
  handleDetail: (data: T) => void;
  handleEdit: (data: T) => void;
  handleDelete: (data: T) => void;
};

function Table<T extends { id: string }>({
  data,
  columns = [],
  itemsPerPage = 10,
  handleDetail,
  handleEdit,
  handleDelete,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <>
      <BasicTable<T>
        data={currentItems}
        columns={columns}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        handleDetail={handleDetail}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}

export default Table;