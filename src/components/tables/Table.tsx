"use client"

import { useState } from "react";
import BasicTable from "./BasicTable";
import Pagination from "./Pagination";

type TableProps = {
    data: object;
    columns: array;
    itemsPerPage: number;
    handleDetail: number;
    handleEdit: number;
    handleDelete: number;
};

const Table: React.FC<TableProps> = ({
    data,
    columns = [],
    itemsPerPage = 10,
    handleDetail,
    handleEdit,
    handleDelete,
}) => {  
    const [currentPage, setCurrentPage] = useState(1); // Manage current page state

    // Calculate the index of the first and last item on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); // Get current items

    const totalPages = Math.ceil(data.length / itemsPerPage); // Calculate total pages
    
    return (
        <>
            <BasicTable data={currentItems} columns={columns} currentPage={currentPage} pageSize={itemsPerPage} handleDetail={handleDetail} handleEdit={handleEdit} handleDelete={handleDelete} />
            <div className="flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    )
}

export default Table