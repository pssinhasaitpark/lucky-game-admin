import React, { useState } from "react";

const CommonTable = ({
  columns,
  data,
  className = "",
  rowsPerPage = 10,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const actionColumn = columns.find((col) => col.isAction);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  // Slice data for current page
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 overflow-x-auto ${className}`}
    >
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className="py-3 px-4 text-gray-500 dark:text-gray-300 text-sm font-semibold whitespace-nowrap"
                style={{ width: col.width || "auto" }}
              >
                {col.title}
              </th>
            ))}
            {actionColumn && <th className="py-3 px-4"></th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actionColumn ? 1 : 0)}
                className="text-center py-6 text-gray-400 dark:text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
          {paginatedData.map((row) => (
            <tr
              key={row._id || row.id || Math.random().toString(36).substr(2, 9)}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-4 px-4 text-gray-700 dark:text-gray-200 text-sm whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {/* Uncomment below if actionColumn needed */}
              {/* {actionColumn && (
                <td className="py-4 px-4 text-sm whitespace-nowrap">
                  {actionColumn.render(row)}
                </td>
              )} */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommonTable;
