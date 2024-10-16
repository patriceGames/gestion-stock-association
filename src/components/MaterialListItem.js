import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Import Firestore
import { db, auth } from "./firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Fonctions Firestore

function MaterialListItem({ material, connected }) {
  // Ajoute l'ID de l'utilisateur
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false); // État pour suivre si le matériau est favori
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);

  const user = auth.currentUser;
  const userId = user?.uid; // Ajouter l'opérateur conditionnel pour éviter une erreur si l'utilisateur n'est pas connecté

  useEffect(() => {
    if (!userId || !material.id) return;

    const loadFavoriteStatus = async () => {
      try {
        const userRef = doc(db, "users", userId); // Référence à l'utilisateur dans Firestore
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.favorites && userData.favorites.includes(material.id)) {
            setIsFavorited(true);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des favoris :", error);
      } finally {
        setIsLoadingFavorite(false);
      }
    };
    loadFavoriteStatus();
  }, [material.id, userId]);

  // Fonction pour gérer le clic sur le bouton favori
  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Empêche de déclencher l'événement de redirection

    if (userId && material.id) {
      const userRef = doc(db, "users", userId); // Référence à l'utilisateur dans Firestore
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let updatedFavorites = userData.favorites || [];

        let updatedIsFavorited;
        if (isFavorited) {
          // Retirer des favoris
          updatedFavorites = updatedFavorites.filter(
            (fav) => fav !== material.id
          );
          updatedIsFavorited = false;
        } else {
          // Ajouter aux favoris
          updatedFavorites.push(material.id);
          updatedIsFavorited = true;
        }

        // Mettre à jour Firestore
        await updateDoc(userRef, { favorites: updatedFavorites });

        // Mettre à jour l'état après la réussite de l'opération Firestore
        setIsFavorited(updatedIsFavorited);
      }
    }
  };

  const handleClick = () => {
    // Redirige vers la page du produit en utilisant son ID
    navigate(`/product/${material.id}`);
  };

  return (
    <li
      key={material.id}
      className="w-full cursor-pointer max-w-sm mx-auto rounded-md shadow-md overflow-hidden relative"
      onClick={handleClick}
    >
      <div
        className="flex items-end justify-end h-56 w-full bg-cover bg-center"
        alt={"Image " + material.name}
        style={{
          backgroundImage: `url(${material.imageUrl1})`,
        }}
      >
        {
          /* Icône de cœur pour les favoris */
          connected ? (
            isLoadingFavorite ? (
              <button className="absolute top-2 right-2 text-white bg-white p-2 rounded-full">
                {/* Icône de chargement */}
                🔄
              </button>
            ) : (
              <button
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 text-white bg-white p-2 rounded-full"
                aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                {isFavorited ? "❤️" : "🤍"}
              </button>
            )
          ) : null
        }
      </div>
      <div className="px-5 py-3">
        <h3 className="text-gray-700 uppercase">{material.name}</h3>
        <span className="text-gray-500 mt-2">{material.price + " €"}</span>
      </div>
    </li>
  );
}

export default MaterialListItem;
