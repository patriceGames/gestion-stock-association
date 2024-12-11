import React from "react";
import { UiTextLight, UiTitleSecondary } from "../UI/Ui";

export const ReservationTable = ({ tableInstance, title, onRowClick }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="mb-8">
      <UiTitleSecondary text={title} />
      <table {...getTableProps()} className="min-w-full bg-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id || Math.random()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-2 py-1 border-b-2 border-gray-200 cursor-pointer text-left"
                  key={column.id}
                >
                  <UiTextLight text={column.render("Header")} color={"gray-500"} />
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id || row.original.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => onRowClick(row.original)}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-2 py-1 border-b border-gray-200"
                    key={cell.column.id}
                  >
                    <UiTextLight text={cell.render("Cell")} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
