import { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";
import { GetAllReservations, UpdateReservation } from "../firebase";
import { ActionButtons } from "./ActionButtons";
import { ReservationStateTranslate } from "../firebase/MaterialReservations";

export const useReservations = (company) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        const reservationsData = await GetAllReservations();
        const formattedReservations = reservationsData.map((reservation) => ({
          ...reservation,
          date: reservation.date?.toDate().toLocaleString() || "No Date",
        }));
        setReservations(formattedReservations);
      } catch (err) {
        console.error("Erreur lors de la récupération des réservations :", err);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const pendingReservations = useMemo(
    () => reservations.filter((res) => res.state === 0),
    [reservations]
  );

  const otherReservations = useMemo(
    () => reservations.filter((res) => res.state !== 0),
    [reservations]
  );

  const updateReservationState = async (id, newState) => {
    try {
      // Mettez à jour en base
      await UpdateReservation(id, { state: newState });

      // Mettez à jour localement après succès
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id
            ? {
                ...reservation,
                state: newState,
                stateExplicit: ReservationStateTranslate(newState),
              }
            : reservation
        )
      );

      console.log("Réservation mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation :", error);
      alert(
        "Erreur lors de la mise à jour de la réservation. Veuillez réessayer."
      );
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Quantité", accessor: "quantity" },
      { Header: "Date de Réservation", accessor: "date" },
      { Header: "Projet", accessor: "projectName" },
      { Header: "Statut", accessor: "stateExplicit" },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <ActionButtons
            reservationId={row.original.id}
            updateReservationState={updateReservationState}
          />
        ),
      },
    ],
    []
  );

  const pendingTableInstance = useTable(
    { columns, data: pendingReservations },
    useSortBy
  );

  const otherTableInstance = useTable(
    { columns, data: otherReservations },
    useSortBy
  );

  return {
    loading,
    pendingReservations,
    otherReservations,
    pendingTableInstance,
    otherTableInstance,
  };
};
