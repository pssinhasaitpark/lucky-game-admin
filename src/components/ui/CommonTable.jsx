import React from "react";

const CommonTable = ({ columns, data, className = "" }) => {
  const actionColumn = columns.find((col) => col.isAction);

  return (
    <div
      className={`bg-white rounded-lg shadow p-6 overflow-x-auto ${className}`}
    >
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="py-3 px-4 text-gray-500 text-sm font-semibold whitespace-nowrap"
                style={{ width: col.width || "auto" }}
              >
                {col.title}
              </th>
            ))}
            {actionColumn && <th className="py-3 px-4"></th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actionColumn ? 1 : 0)}
                className="text-center py-6 text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr
              key={row._id || row.id || Math.random().toString(36).substr(2, 9)}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-4 px-4 text-gray-700 text-sm whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {/* {actionColumn && (
                <td className="py-4 px-4 text-sm whitespace-nowrap">
                  {actionColumn.render(row)}
                </td>
              )} */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommonTable;
