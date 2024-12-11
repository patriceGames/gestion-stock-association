import React from "react";
import { useState, useEffect } from "react";
import { GetAllFavorites } from "./firebase"; // Import de la fonction pour récupérer les favoris
import MaterialListItem from "./MaterialListItem";
import { UiTextBook } from "./UI/Ui";

const MaterialGrid = ({
  materials,
  DeleteMaterial,
  currentUser,
  storageView,
  userView,
  companyId,
  storageId,
}) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const fetchFavorites = async () => {
      try {
        const userFavorites = await GetAllFavorites(currentUser.uid);
        setFavorites(userFavorites);
      } catch (error) {
        console.error("Erreur lors du chargement des favoris :", error);
      }
    };

    fetchFavorites();
  }, [currentUser?.uid]);

  if (materials.length === 0) {
    return <UiTextBook text={"Aucun matériau pour la selection."} />;
  }

  return (
    <div>
      <ul className="grid mx-5 gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
        {materials.map((material) => (
          <MaterialListItem
            key={material.id}
            material={material}
            isFavorited={favorites.includes(material.id)}
            onFavoriteToggle={(materialId, updatedFavoriteStatus) => {
              setFavorites((prevFavorites) =>
                updatedFavoriteStatus
                  ? [...prevFavorites, materialId]
                  : prevFavorites.filter((id) => id !== materialId)
              );
            }}
            currentUser={currentUser}
            storageView={storageView}
            userView={userView}
            companyId={companyId}
            storageId={storageId}
          />
        ))}
      </ul>
    </div>
  );
};

export default MaterialGrid;
