import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  AddReservation,
  UpdateReservation,
  GetReservations,
  UpdateMaterialProperty,
} from "../firebase.js"; // Importez vos fonctions CRUD pour les réservations.
import ReservationForm from "./ReservationForm.js";
import { UiButton, UiTextBook, UiTextLightSmall } from "../UI/Ui.js";

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
    if (totalQuantity > 0) {
      // Charger les données de réservation
      const reservationsData = await GetReservations(material.id);
      const formattedReservations = reservationsData.map((reservation) => ({
        ...reservation,
        date: reservation.date?.toDate().toLocaleString() || "No Date",
      }));
      setReservations(formattedReservations);

      // Recalculer la quantité réservée
      const reservedQuantity = formattedReservations.reduce(
        (total, reservation) => total + Number(reservation.quantity || 0),
        0
      );

      // Calculer la nouvelle quantité disponible
      const newQuantityAvailable = totalQuantity - reservedQuantity;

      // Mise à jour locale
      setQuantityAvailable(newQuantityAvailable);

      // Comparer directement avec newQuantityAvailable pour éviter le décalage
      if (newQuantityAvailable !== material.quantityAvailable) {
        // Mettre à jour localement la quantité disponible
        material.quantityAvailable = newQuantityAvailable;

        // Mettre à jour la propriété "quantityAvailable" dans Firestore
        UpdateMaterialProperty(
          { quantityAvailable: newQuantityAvailable },
          material.id
        )
          .then(() => {
            console.log("Quantité disponible mise à jour avec succès !");
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la mise à jour de la quantité disponible :",
              error
            );
          });
      }
    }
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
      { Header: "Réservataire", accessor: "userName" },
      { Header: "Site destination", accessor: "projectName" },
      { Header: "Qt", accessor: "quantity" },
      { Header: "Date", accessor: "date" },
      { Header: "Statut", accessor: "stateExplicit" },
      {
        id: "edit",
        Header: "",
        Cell: ({ row }) => (row.original.state === 0 &&
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
    console.log(currentUser + "\n" + currentUser);
    newReservation.materialName = material.name;
    await AddReservation(
      currentUser,
      material.id,
      newReservation
    );
    loadReservations(); // Rechargez les réservations après ajout
    closeEditPopUp();
  };

  const handleUpdateReservation = async (updatedReservation) => {
    if (selectedReservation) {
      await UpdateReservation(selectedReservation.id, updatedReservation);
      loadReservations(); // Rechargez les réservations après mise à jour
      closeEditPopUp();
    }
  };

  const handleDeleteReservation = async (e) => {
    e.preventDefault();
    if (selectedReservation) {
      await UpdateReservation(selectedReservation.id, {state:10});
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
                  className="px-3 py-2 border-b-2 border-gray-200 cursor-pointer text-left"
                  key={column.id}
                >
                  <UiTextBook text={column.render("Header")} />
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
                    className="px-3 py-1 border-b border-gray-200"
                    key={cell.column.id}
                  >
                    <UiTextLightSmall
                      text={cell.render("Cell")}
                      color={"gray-600"}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4">
        <UiButton
          icon={faPlus}
          text={" Ajouter une réservation"}
          action={() => openEditPopUp(null)}
          enabled={quantityAvailable === 0}
        />
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
