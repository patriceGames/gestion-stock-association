import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate pour la navigation
import { GetMaterialById } from "./firebase";
import MaterialCard from "./MaterialCard.js";
import { UiButton, UiTextLight, UiTitleSecondary } from "./UI/Ui.js";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

function MaterialDetail({ currentUser, connected }) {
  const { companyId, materialId, storageId, userId } = useParams(); // Récupérer à la fois l'ID du matériau et le storageId du hangar depuis les paramètres
  const [material, setMaterial] = useState(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate(); // Initialiser useNavigate pour permettre la navigation

  useEffect(() => {
    // Charger les détails du matériau en fonction de l'ID de l'URL
    const fetchMaterial = async () => {
      const data = await GetMaterialById(materialId);
      setMaterial(data);

      // Charger les images si elles existent
      const loadedImages = [];
      if (data.imageUrl1) loadedImages.push(data.imageUrl1);
      if (data.imageUrl2) loadedImages.push(data.imageUrl2);
      if (data.imageUrl3) loadedImages.push(data.imageUrl3);
      if (data.imageUrl4) loadedImages.push(data.imageUrl4);
      if (data.imageUrl5) loadedImages.push(data.imageUrl5);
      setImages(loadedImages);
    };

    fetchMaterial();
  }, [materialId]);

  // Déterminer si l'utilisateur peut éditer
  const canEdit = material
    ? currentUser?.role === "admin" || currentUser.id === material.userId
    : false;

  return (
    <div className="bg-neutral-100">
      <div className="p-5">
        {/* Flèche de retour vers le hangar seulement si companyId est présent */}
        {(companyId || userId) && (
          <button
          onClick={() =>
            navigate(userId 
              ? `/user/${userId}/reservations`
              : `/company/${companyId}/storage/${storageId}`)
          }
            className="flex items-center text-blue-500 mb-4"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <UiTextLight text={"Retour"} />
          </button>
        )}

        {material ? (
          <div>
            <MaterialCard
              connected={connected}
              currentUser={currentUser}
              material={material}
              images={images}
            />
            {canEdit && (
              <div className="absolute top-20 right-2">
                <UiButton
                  icon={faEdit}
                  action={() =>
                    navigate(
                      `${
                        storageId
                          ? `/company/${companyId}/storage/${storageId}`
                          : ""
                      }/material/${material.id}/edit`
                    )
                  }
                />
              </div>
            )}
          </div>
        ) : (
          <UiTitleSecondary text={"Chargement..."} />
        )}
      </div>
    </div>
  );
}

export default MaterialDetail;
