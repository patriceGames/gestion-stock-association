import React, { useEffect, useState } from "react";
import { GetMaterialById, getStorage, UpdateReservation } from "../firebase";
import {
  UiTextBold,
  UiTextLight,
  UiTextLightSmall,
  UiTitleSecondary,
} from "../UI/Ui";

const ReservationDetails = ({ reservation, setReservation, buttons }) => {
  const [material, setMaterial] = useState(null);
  const [storage, setStorage] = useState(null);

  useEffect(() => {
    const fetchMaterialAndStorage = async () => {
      try {
        const resa = reservation;
        if (resa.materialId) {
          const materialData = await GetMaterialById(resa.materialId);
          setMaterial(materialData);
  
          // Vérifie et met à jour le nom du matériau si nécessaire
          if (materialData?.name && materialData.name !== resa.materialName) {
            await UpdateReservation(resa.id, { materialName: materialData.name });
            setReservation((prevReservation) => ({
              ...prevReservation,
              materialName: materialData.name,
            }));
          }
  
          // Récupère le stockage si nécessaire
          if (materialData?.storageId) {
            const storageData = await getStorage(materialData.storageId);
            setStorage(storageData);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
  
    fetchMaterialAndStorage();
  }, [reservation, setReservation]);

  return (
    <div>
      <UiTitleSecondary text={"Détails de la Réservation"} />
      {!material && (<p><UiTextLight text={"Le matériau n'existe plus dans la base"} color={"red-500"} /></p>
      )}
      {material && (
        <>
          {material.imageUrl1 && (
            <div className="mt-2">
              <img
                src={material.imageUrl1}
                alt={`${material.name}`}
                className="w-full max-h-40 object-cover rounded-lg"
              />
            </div>
          )}
        </>
      )}
      {material && (
        <p>
          <UiTextBold text={material.name} />
        </p>
      )}
      {storage && (
        <p>
          <UiTextLightSmall text={storage.name} />
        </p>
      )}
      {material && (
        <p>
          <UiTextLightSmall text={material.category} color={"gray-500"} />
        </p>
      )}
      {/* Informations sur la réservation */}

      <p>
        <UiTextBold text={"Quantité : "} />
        <UiTextLight text={reservation.quantity} />
        {material && (
        <UiTextLightSmall text={" (Disponible : " + material.quantity + " )"} color={"gray-500"} />
      )}
      </p>
      
      <p>
        <UiTextBold text={"Réservataire : "} />
        <UiTextLight text={reservation.userName} />
      </p>
      <p>
        <UiTextBold text={"Projet : "} />
        <UiTextLight text={reservation.projectName} />
      </p>
      <p>
        <UiTextBold text={"Statut : "} />
        <UiTextLight text={reservation.stateExplicit} />
      </p>

      {/* Boutons d'action */}
      {buttons && buttons}
    </div>
  );
};

export default ReservationDetails;
