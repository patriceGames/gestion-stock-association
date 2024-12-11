import React, { useEffect, useState } from "react";
import { GetAllFavorites } from "../firebase";
import MaterialListItem from "../MaterialListItem"; // Importez le composant
import { UiSecondaryCard, UiTitleMain, UiTitleSecondary } from "../UI/Ui";

const Favorites = ({ currentUser }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const favoriteIds = await GetAllFavorites(currentUser.uid);
        setFavorites(favoriteIds);
      } catch (err) {
        setError("Erreur lors du chargement des favoris.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  if (loading) {
    return <div>Chargement des favoris...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (favorites.length === 0) {
    return <UiTitleSecondary text={"Aucun favori trouvé."} />;
  }

  return (
    <UiSecondaryCard>
      <UiTitleMain text={"Mes favoris"} />
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((materialId) => (
          <MaterialListItem
            key={materialId}
            materialId={materialId} // Passez uniquement l'ID ici
            currentUser={currentUser} // Nécessaire pour gérer les favoris
            userView={true} // Nécessaire pour gérer les favoris
            isFavorited={true}
            onFavoriteToggle={(id, newState) => {
              setFavorites((prevFavorites) =>
                newState
                  ? [...prevFavorites, id]
                  : prevFavorites.filter((favId) => favId !== id)
              );
            }}
          />
        ))}
      </ul>
    </UiSecondaryCard>
  );
};

export default Favorites;
