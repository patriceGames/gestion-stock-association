import React, { useMemo } from "react";
import { UiButton } from "../UI/Ui";

export function ReservationActionButtons({ reservation, onAction }) {
  const actionButtons = useMemo(() => {
    switch (reservation.state) {
      case 0: // En Attente
        return (
          <>
            <UiButton
              text={"Refuser"}
              color={"red"}
              action={() => onAction(8)}
            />
            <UiButton
              text={"Confirmer"}
              color={"blue"}
              action={() => onAction(1)}
            />
          </>
        );
      case 1: // Confirmée
        return (
          <>
            <UiButton
              text={"Refuser"}
              color={"red"}
              action={() => onAction(8)}
            />
            <UiButton
              text={"Envoyer"}
              color={"blue"}
              action={() => onAction(3)}
            />
          </>
        );
      case 3: // En cours d'acheminement
        return (
          <>
            <UiButton
              text={"Retour stockage"}
              color={"grey"}
              action={() => onAction(1)}
            />
            <UiButton
              text={"Livrer"}
              color={"blue"}
              action={() => onAction(5)}
            />
          </>
        );
        case 8: // Refusée
        return (
          <>
            <UiButton
              text={"Accepter"}
              color={"blue"}
              action={() => onAction(1)}
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

