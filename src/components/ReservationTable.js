import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  AddReservation,
  UpdateReservation,
  GetReservations,
  DeleteReservation,
} from "./firebase"; // Importez vos fonctions CRUD pour les réservations.
import ReservationForm from "./ReservationForm.js";

function ReservationTable({
  currentUser,
  material,
  totalQuantity,
  quantityAvailable,
  setQuantityAvailable,
}) {
  const [reservations, setReservations] = useState([]);
  const [isEditPopUpOpen, setIsEditPopUpOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const loadReservations = async () => {
    const reservationsData = await GetReservations(material.id);
    const formattedReservations = reservationsData.map((reservation) => ({
      ...reservation,
      date: reservation.date?.toDate().toLocaleString() || "No Date",
    }));
    setReservations(formattedReservations);

    // Recalculer la quantité réservée après avoir défini les réservations
    const reservedQuantity = formattedReservations.reduce(
      (total, reservation) => total + Number(reservation.quantity || 0),
      0
    );
    setQuantityAvailable(totalQuantity - reservedQuantity);
  };

  // Utilisation de useEffect pour éviter les appels répétés
  useEffect(() => {
    loadReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material.id]); // Recharger uniquement si material.id change

  const openEditPopUp = (reservation) => {
    setSelectedReservation(reservation);
    setIsEditPopUpOpen(true);
  };

  const closeEditPopUp = () => {
    setIsEditPopUpOpen(false);
    setSelectedReservation(null);
  };

  const columns = useMemo(
    () => [
      { Header: "Nom d'utilisateur", accessor: "userName" },
      { Header: "Projet", accessor: "projetName" },
      { Header: "Quantité", accessor: "quantity" },
      { Header: "Date", accessor: "date" },
      {
        id: "edit",
        Header: "",
        Cell: ({ row }) => (
          <button
            onClick={() => openEditPopUp(row.original)}
            className="text-blue-500 hover:underline w-1"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        ),
      },
    ],
    []
  );

  // Initialisation de React Table
  const tableInstance = useTable(
    {
      columns,
      data: reservations,
    },
    useFilters,
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handleAddReservation = async (newReservation) => {
    console.log(newReservation);
    await AddReservation(currentUser, material.id, newReservation);
    loadReservations(); // Rechargez les réservations après ajout
    closeEditPopUp();
  };

  const handleUpdateReservation = async (updatedReservation) => {
    if (selectedReservation) {
      await UpdateReservation(
        material.id,
        selectedReservation.id,
        updatedReservation
      );
      loadReservations(); // Rechargez les réservations après mise à jour
      closeEditPopUp();
    }
  };

  const handleDeleteReservation = async (updatedReservation) => {
    if (selectedReservation) {
      await DeleteReservation(material.id, selectedReservation.id);
      loadReservations(); // Rechargez les réservations après mise à jour
      closeEditPopUp();
    }
  };

  return (
    <div>
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
                  className="px-6 py-2 border-b-2 border-gray-200 cursor-pointer"
                  key={column.id}
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
                className="hover:bg-gray-100"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-6 py-4 border-b border-gray-200"
                    key={cell.column.id}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => openEditPopUp(null)} // Null pour ajouter une nouvelle réservation
          className={`px-4 py-2 rounded ${
            quantityAvailable === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          disabled={quantityAvailable === 0} // Désactiver le bouton si la quantité disponible est 0
        >
          <FontAwesomeIcon icon={faPlus} /> Ajouter une réservation
        </button>
      </div>

      {/* Popup D'ajout / modification de réservation */}
      {isEditPopUpOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 bg-white rounded shadow-lg relative w-11/12 max-w-lg">
            <ReservationForm
              material={material}
              quantityAvailable={quantityAvailable}
              reservation={selectedReservation}
              onSave={
                selectedReservation
                  ? handleUpdateReservation
                  : handleAddReservation
              }
              onCancel={closeEditPopUp}
              onDelete={selectedReservation ? handleDeleteReservation : null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationTable;
