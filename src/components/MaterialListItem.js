import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToggleFavorite, getMaterial } from "./firebase";
import {
  UiTextBold,
  UiTextLight,
  UiTextLightSmall,
  UiTextMedium,
  UiTitleSecondary,
} from "./UI/Ui";

function MaterialListItem({
  material: initialMaterial, // Renommé pour éviter la confusion
  materialId,
  isFavorited,
  onFavoriteToggle,
  currentUser,
  storageView,
  userView,
  companyId,
  storageId,
}) {
  const navigate = useNavigate();
  const [material, setMaterial] = useState(initialMaterial); // État local pour le matériau
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMaterial = useCallback(async () => {
    if (!materialId) {
      setMaterial(initialMaterial);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const materialData = await getMaterial(materialId); // Appel Firestore ou API
      if (!materialData && userView) {
        try {
          await ToggleFavorite(currentUser.uid, materialId, true); // Retirer des favoris
          console.log(
            `Matériau ID ${materialId} retiré des favoris car il a été supprimé.`
          );
          onFavoriteToggle(materialId, false); // Mise à jour locale
        } catch (err) {
          console.error(
            "Erreur lors de la suppression automatique des favoris :",
            err
          );
        }
      }
      setMaterial(materialData); // Mise à jour de l'état local
    } catch (err) {
      console.error("Erreur lors du chargement du matériau :", err);
      setError("Erreur lors du chargement du matériau.");
      setMaterial(null); // Considérer le matériau comme supprimé si erreur
    } finally {
      setIsLoading(false);
    }
  }, [materialId, initialMaterial, userView, currentUser.uid, onFavoriteToggle]);

  // Charge le matériau si nécessaire
  useEffect(() => {
    if (!material && materialId) {
      loadMaterial();
    }
  }, [material, materialId, loadMaterial]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    // Vérifiez que le matériau est disponible ou que l'ID est défini
    if (!currentUser?.uid || (!material && !materialId)) {
      console.warn(
        "Favoris non modifiables : matériau ou utilisateur non disponible."
      );
      return;
    }

    const idToToggle = material ? material.id : materialId;
    try {
      onFavoriteToggle(idToToggle, !isFavorited); // Mise à jour optimiste
      await ToggleFavorite(currentUser.uid, idToToggle, isFavorited);
      console.log(
        `État du favori mis à jour : Matériau ID ${idToToggle}, État ${!isFavorited}`
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour des favoris :", err);
      onFavoriteToggle(idToToggle, isFavorited); // Réversion en cas d'erreur
    }
  };

  const handleClick = () => {
    if (!material) return;

    navigate(
      storageView
        ? `/company/${companyId}/storage/${storageId}/material/${material.id}`
        : userView
        ? `/user/${currentUser.uid}/material/${materialId}`
        : `/material/${material.id}`
    );
  };

  if (isLoading) {
    return <UiTitleSecondary text={"Chargement du matériau..."} />;
  }

  if (error) {
    return <UiTitleSecondary text={error} />;
  }

  if (!material) {
    return (
      <div className="h-full items-center">
        <UiTextBold text={"Matériau supprimé"} />
      </div>
    );
  }

  return (
    <li
      className="w-full cursor-pointer max-w-sm mx-auto rounded-sm shadow-md overflow-hidden relative"
      onClick={handleClick}
    >
      <div
        className="flex items-end justify-end h-40 w-full bg-cover bg-center"
        alt={"Image " + material.name}
        style={{
          backgroundImage: `url(${material.imageUrl1})`,
        }}
      >
        <button
          onClick={!isLoading ? handleFavoriteClick : null} // Ne déclenche pas le clic si en cours de chargement
          disabled={isLoading || !currentUser?.uid}
          className={`absolute top-2 right-2 text-white bg-white p-2 rounded-full ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={
            isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"
          }
        >
          {isLoading ? "⏳" : isFavorited ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="px-5 py-3">
        <UiTextMedium text={material.name} />
        <p>
          <UiTextLightSmall
            text={`État : ${material.condition}`}
            color={"gray-600"}
          />
        </p>
        <p>
          <UiTextLightSmall text={"Quantité : "} color={"gray-600"} />
          <UiTextLight text={material.quantityAvailable} />
        </p>
      </div>
    </li>
  );
}

export default MaterialListItem;
