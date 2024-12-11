import React, { useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";
import { UpdateReservation } from "../firebase"; // Ajoutez la fonction Firebase pour supprimer une réservation
import { UiButton, UiModal, UiTextLight, UiTitleMain } from "../UI/Ui";
import { ReservationStateTranslate } from "../firebase/MaterialReservations";
import ReservationDetails from "../ReservationManagement/ReservationDetails";

const Reservations = ({ currentUser, reservations, setReservations }) => {
  const [showPopup, setShowPopup] = useState(false); // État pour afficher la pop-up
  const [reservationToDelete, setReservationToDelete] = useState(null); // Réservation sélectionnée pour suppression

  const handleUpdateReservation = async (newState) => {
    if (!reservationToDelete) return;

    try {
      // Mettez à jour en base
      await UpdateReservation(reservationToDelete.id, { state: newState });

      // Mettez à jour localement après succès
      if (newState < 9) {
        // Mettez à jour localement les réservations si newState est inférieur à 9
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.id === reservationToDelete.id
              ? {
                  ...reservation,
                  state: newState,
                  stateExplicit: ReservationStateTranslate(newState),
                }
              : reservation
          )
        );
      } else {
        // Supprimez la réservation si newState est supérieur ou égal à 9
        setReservations((prevReservations) =>
          prevReservations.filter(
            (reservation) => reservation.id !== reservationToDelete.id
          )
        );
      }

      setReservationToDelete(null);
      setShowPopup(false);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("Impossible de supprimer la réservation.");
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Nom du Matériau", accessor: "materialName" },
      { Header: "Quantité", accessor: "quantity" },
      { Header: "Date de Réservation", accessor: "date" },
      { Header: "Projet", accessor: "projectName" },
      { Header: "Statut", accessor: "stateExplicit" },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: reservations,
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handleRowClick = (row) => {
      // Matériau supprimé ou réservation refusée : afficher la pop-up
      setReservationToDelete(row.original);
      setShowPopup(true);
      // Matériau existant : naviguer vers les détails
      //navigate(`/user/${currentUser.uid}/material/${row.original.materialId}`);
  };



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-md rounded-lg">
        <UiTitleMain text={"Mes réservations"} />
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
                    className="px-2 py-2 border-b-2 border-gray-200 cursor-pointer text-left"
                    key={column.id}
                  >
                    <UiTextLight
                      text={column.render("Header")}
                      color={"gray-500"}
                    />
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
              const isMaterialDeleted = !row.original.materialName;
              const isRejected = row.original.state === 8;

              return (
                <tr
                  {...row.getRowProps()}
                  key={row.id || row.original.id}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    isMaterialDeleted || isRejected ? "bg-red-100" : ""
                  }`}
                  onClick={() => handleRowClick(row)}
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-2 py-2 border-b border-gray-200"
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

        {showPopup && (
          <UiModal onClose={() => setShowPopup(false)}>
            <ReservationDetails
              reservation={reservationToDelete}
              setReservation={setReservationToDelete}
              onClose={() => setShowPopup(false)}
              buttons={
                <ActionButtons
                  reservation={reservationToDelete}
                  onAction={handleUpdateReservation}
                />}
            />
          </UiModal>
        )}
      </div>
    </div>
  );
};

export default Reservations;

function ActionButtons({ reservation, onAction }) {
  const actionButtons = useMemo(() => {
    switch (reservation.state) {
      case 0: // En Attente
        return (
          <>
            <UiButton
              text={"Supprimer"}
              color={"red"}
              action={() => onAction(9)}
            />
          </>
        );
      case 5: // Livrée sur site
        return (
          <>
            <UiButton
              text={"Valider Livraison"}
              color={"blue"}
              action={() => onAction(10)}
            />
          </>
        );
        case 8: // Refusée
        return (
          <>
            <UiButton
              text={"Archiver"}
              color={"blue"}
              action={() => onAction(10)}
            />
          </>
        );
      default:
        return (
          <>
          </>
        );
    }
  }, [reservation, onAction]);

  return <div className="flex space-x-2 mt-4">{actionButtons}</div>;
}