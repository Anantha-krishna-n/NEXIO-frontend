import React from "react";

interface Column {
  label: string;
  key: string;
  render?: (value: any) => React.ReactNode;
}

interface Action<T> {
  label: (row: T) => string;
  onClick: (row: T) => void;
  className?: (row: T) => string;
  disabled?: (row: T) => boolean;
}

interface ReusableTableProps<T> {
  columns: Column[];
  data: T[];
  actions?: Action<T>[];
}

const ReusableTable = <T extends Record<string, any> & { _id: string }>({
  columns,
  data,
  actions = [],
}: ReusableTableProps<T>) => {
  return (
    <table className="w-full bg-white rounded-lg shadow-md">
      <thead>
        <tr className="border-b">
          {columns.map((col) => (
            <th key={col.key} className="py-2 px-4 text-left">{col.label}</th>
          ))}
          {actions.length > 0 && <th className="py-2 px-4 text-left">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id} className="border-b">
            {columns.map((col) => (
              <td key={col.key} className="py-2 px-4">
                {col.render ? col.render(row[col.key as keyof T]) : row[col.key as keyof T]}
              </td>
            ))}
            {actions.length > 0 && (
              <td className="py-2 px-4">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => action.onClick(row)}
                    className={action.className ? action.className(row) : "px-4 py-2 rounded-lg bg-blue-500 text-white"}
                    disabled={action.disabled ? action.disabled(row) : false}
                  >
                    {action.label(row)}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReusableTable;
