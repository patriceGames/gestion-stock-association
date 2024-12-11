import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";

function FavoriteAndShareButtons({
  isFavorited,
  isLoadingFavorite,
  handleFavoriteClick,
  shareProduct,
}) {
  return (
    <div className="absolute top-2 right-2 flex space-x-2">
      <button
        onClick={handleFavoriteClick}
        className="bg-white p-2 rounded-full shadow-md"
        aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        {isLoadingFavorite ? "🔄" : isFavorited ? "❤️" : "🤍"}
      </button>
      <button
        onClick={shareProduct}
        className="bg-white p-2 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition duration-200"
        aria-label="Partager ce produit"
      >
        <FontAwesomeIcon icon={faShareAlt} className="text-gray-600" />
      </button>
    </div>
  );
}

export default FavoriteAndShareButtons;
