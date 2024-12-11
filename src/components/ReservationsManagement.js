import React, { useState, useMemo} from "react";
import { useTable, useSortBy } from "react-table";
import { UpdateReservation } from "./firebase"; // Fonction Firebase
import ReservationDetails from "./ReservationManagement/ReservationDetails";
import { UiModal, UiSecondaryCard, UiTitleMain } from "./UI/Ui";
import { ReservationTable } from "./ReservationManagement/Table";
import { ReservationStateTranslate } from "./firebase/MaterialReservations";
import { format } from "date-fns";
import { ReservationActionButtons } from "./ReservationManagement/ActionButtons";

const ReservationManagement = ({ currentUser, company, reservations, setReservations}) => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const pendingReservations = useMemo(
    () => reservations.filter((res) => res.state === 0),
    [reservations]
  );

  const otherReservations = useMemo(
    () => reservations.filter((res) => res.state < 8 && res.state !== 0),
    [reservations]
  );

  const openModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setShowModal(false);
  };

  const handleAction = async (newState) => {
    if (!selectedReservation) return;

    try {
      await UpdateReservation(selectedReservation.id, { state: newState });
      // Mettre à jour l'état local
      setSelectedReservation((prev) => ({ ...prev, state: newState }));
      // Mettez à jour localement après succès
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === selectedReservation.id
            ? {
                ...reservation,
                state: newState,
                stateExplicit: ReservationStateTranslate(newState),
              }
            : reservation
        )
      );
      closeModal(); // Fermer le modal après succès
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour de la réservation.");
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Matériau", accessor: "materialName" },
      { Header: "Réservataire", accessor: "userName" },
      { Header: "Projet", accessor: "projectName" },
      { Header: "Quantité", accessor: "quantity" },
      {
        Header: "Date",
        accessor: (row) => format(new Date(row.date), "MM/dd/yyyy"),
      },
      { Header: "Statut", accessor: "stateExplicit" },
    ],
    []
  );

  const pendingTableInstance = useTable(
    { columns, data: pendingReservations || [] },
    useSortBy
  );

  const otherTableInstance = useTable(
    { columns, data: otherReservations || [] },
    useSortBy
  );  

  return (
    <UiSecondaryCard>
        <UiTitleMain text={"Réservations"} />
        <ReservationTable
          tableInstance={pendingTableInstance}
          title={"À traiter"}
          onRowClick={openModal}
        />
        <ReservationTable
          tableInstance={otherTableInstance}
          title={"En cours"}
          onRowClick={openModal}
        />

        {showModal && (
          <UiModal onClose={closeModal}>
            <ReservationDetails
              reservation={selectedReservation}
              setReservation={setSelectedReservation}
              onClose={closeModal}
              buttons={
                <ReservationActionButtons
                  reservation={selectedReservation}
                  onAction={handleAction}
                />}
              
            />
          </UiModal>
        )}
    </UiSecondaryCard>
  );
};

export default ReservationManagement;
