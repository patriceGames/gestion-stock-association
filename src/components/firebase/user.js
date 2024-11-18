import {
    doc,
    getDoc,
    updateDoc,
  } from "firebase/firestore";
  
  import {db} from "./Base.js";

  

/**
 * Ajoute ou retire un produit des favoris de l'utilisateur.
 *
 * @param {string} userId - L'ID de l'utilisateur actuel.
 * @param {string} materialId - L'ID du matériau à ajouter/retirer des favoris.
 * @param {boolean} currentFavoriteStatus - Le statut actuel du favori (true si déjà favori, false sinon).
 * @param {boolean} checkOnly - (Optionnel) Si true, vérifie seulement si le matériau est favori.
 * @returns {Promise<boolean>} - Renvoie le nouveau statut du favori.
 */
async function ToggleFavorite(
    userId,
    materialId,
    currentFavoriteStatus,
    checkOnly = false
  ) {
    if (!userId || !materialId) {
      throw new Error("User ID and Material ID are required.");
    }
  
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let updatedFavorites = userData.favorites || [];
  
        if (checkOnly) {
          // Just return whether the material is favorited
          return updatedFavorites.includes(materialId);
        }
  
        let updatedIsFavorited;
        if (currentFavoriteStatus) {
          // Remove from favorites
          updatedFavorites = updatedFavorites.filter((fav) => fav !== materialId);
          updatedIsFavorited = false;
        } else {
          // Add to favorites
          updatedFavorites.push(materialId);
          updatedIsFavorited = true;
        }
  
        // Update Firestore with the new favorites list
        await updateDoc(userRef, { favorites: updatedFavorites });
  
        return updatedIsFavorited;
      } else {
        throw new Error("User document does not exist.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris :", error);
      throw error;
    }
  }

  export {ToggleFavorite};