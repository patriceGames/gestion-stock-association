import React, { useMemo, useState } from "react";
import { useTable, useSortBy, useFilters, useRowSelect } from "react-table";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import MaterialForm from "./MaterialForm";

function MaterialTable({ company, currentUser, materials, storageId, currentUserDetail }) {
  const navigate = useNavigate();

  // État pour contrôler l'ouverture de la modale de modification
  const [isEditPopUpOpen, setIsEditPopUpOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const openEditPopUp = (material) => {
    setSelectedMaterial(material);
    setIsEditPopUpOpen(true);
  };

  const closeEditpopUp = () => {
    setIsEditPopUpOpen(false);
    setSelectedMaterial(null);
  };

  const columns = useMemo(
    () => [
      { Header: "Nom", accessor: "name" },
      { Header: "Quantité", accessor: "quantity" },
      { Header: "Catégorie", accessor: "category" },
      { Header: "Etat", accessor: "condition" },
      {
        id: "edit",
        Header: "",
        Cell: ({ row }) => (
          (currentUserDetail?.role === 'admin' && <button
            onClick={() => openEditPopUp(row.original)}
            className="text-blue-500 hover:underline w-1"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>)
        ),
      },
      {
        id: "details",
        Header: "",
        Cell: ({ row }) => (
          <button
            onClick={() =>
              navigate(
                `/company/${company.id}/storage/${storageId}/product/${row.original.id}`
              )
            }
            className="text-blue-500 hover:underline w-1"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        ),
      },
    ],
    [navigate, company, storageId, currentUserDetail]
  );

  // Initialisation de React Table
  const tableInstance = useTable(
    {
      columns,
      data: materials,
    },
    useFilters,
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <input
              type="checkbox"
              {...getToggleAllRowsSelectedProps()}
              indeterminate={
                getToggleAllRowsSelectedProps().indeterminate ? true : undefined
              }
            />
          ),
          Cell: ({ row }) => (
            <input
              type="checkbox"
              {...row.getToggleRowSelectedProps()}
              indeterminate={
                row.getToggleRowSelectedProps().indeterminate ? true : undefined
              }
            />
          ),
        },
        ...columns,
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = tableInstance;

  return (
    <div>
      <table {...getTableProps()} className="min-w-full bg-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id || Math.random()}
            >
              {headerGroup.headers.map((column) => {
                const { key, ...headerProps } = column.getHeaderProps(
                  column.getSortByToggleProps()
                );
                return (
                  <th
                    key={column.id}
                    {...headerProps}
                    className="px-6 py-2 border-b-2 border-gray-200 cursor-pointer"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                );
              })}
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
                className="hover:bg-gray-100"
              >
                {row.cells.map((cell) => {
                  const { key, ...cellProps } = cell.getCellProps();
                  return (
                    <td
                      key={cell.column.id}
                      {...cellProps}
                      className="px-6 py-4 border-b border-gray-200"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4">
        <h3>Éléments sélectionnés :</h3>
        <ul>
          {selectedFlatRows.map((row) => (
            <li key={row.original.id}>{row.original.name}</li>
          ))}
        </ul>
      </div>

      {/* Popup D'édition de matériel */}
      {isEditPopUpOpen && (
        <div className="absolute top-20 w-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="my-10 lg:mx-10 p-4 bg-white rounded shadow-lg relative">
            <div className="flex lg:m-10 items-center justify-center ">
                <MaterialForm
                  baseMaterialId={selectedMaterial.id}
                  closeEditpopUp={closeEditpopUp}
                  company={company}
                  currentUser={currentUser}
                />
              </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default MaterialTable;
