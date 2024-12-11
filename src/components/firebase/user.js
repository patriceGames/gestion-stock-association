import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./Base.js";

  async function GetUserData (user) {
    try {
      console.log("Chargement des données utilisateur...")
      // Récupérer les détails utilisateur depuis la collection "roles"
      const roleDocRef = doc(db, "roles", user.email);
      const roleDocSnapshot = await getDoc(roleDocRef);

      if (roleDocSnapshot.exists()) {
        const userDetail = roleDocSnapshot.data();

        // Récupérer les informations supplémentaires depuis "users"
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        return {
          ...user,
          ...userDetail,
          ...(userDocSnapshot.exists() ? userDocSnapshot.data() : {}),
        };
      } else {
        console.warn(
          "Aucun détail utilisateur trouvé pour cet email :",
          user.email
        );
        return user; // Renvoie l'utilisateur Firebase de base
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails utilisateur :",
        error
      );
      throw error; // Lancer l'erreur pour qu'elle soit gérée par l'appelant
    }
  };

  async function GetCompanyData () {
    try {
      console.log("Chargement des données d'entreprise...")
      const companiesSnapshot = await getDocs(collection(db, "companies"));

      if (!companiesSnapshot.empty) {
        // Prendre la première entreprise trouvée
        const firstCompany = companiesSnapshot.docs[0];
        return {
          id: firstCompany.id,
          ...firstCompany.data(),
        };
      } else {
        console.warn("Aucune entreprise trouvée dans la collection.");
        return null; // Retourne null si aucune entreprise n'existe
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données d'entreprise :",
        error
      );
      throw error; // Lancer l'erreur pour qu'elle soit gérée par l'appelant
    }
  };


/**
 * Met à jour les informations utilisateur (nom, prénom, email) dans Firestore.
 *
 * @param {string} userId - L'ID de l'utilisateur.
 * @param {Object} data - Les données à mettre à jour (par ex. {firstName, lastName}).
 * @returns {Promise<void>}
 */
  const UpdateUserProfile = async (userId, data) => {
  if (!userId || !data) {
    throw new Error("User ID and data are required.");
  }

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des informations utilisateur :", error);
    throw error;
  }
};


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
    console.log("ToogleFavorite pour le matériau " + materialId + " : " + !currentFavoriteStatus)
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

/**
 * Récupère toutes les IDs des matériaux mis en favoris par un utilisateur.
 *
 * @param {string} userId - L'ID de l'utilisateur actuel.
 * @returns {Promise<Array<string>>} - Une liste des IDs des matériaux favoris.
 */
async function GetAllFavorites(userId) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.favorites || [];
    } else {
      throw new Error("User document does not exist.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
    throw error;
  }
}

function GetUserAlarms(currentUser, reservations) {
  // Initialisation des compteurs d'alarmes
  const alarms = {
    userAlarms: 0, // Alarmes utilisateur
    adminAlarms: 0, // Alarmes administration (seulement pour admin)
  };

  // Parcourir les réservations
  reservations.forEach((reservation) => {
    // Alarmes utilisateur : état 5 ou 8
    if (reservation.state === 5 || reservation.state === 8) {
      alarms.userAlarms++;
    }

    // Alarmes admin : état 0 (uniquement si l'utilisateur est admin)
    if (currentUser.role === 'admin' && reservation.state === 0) {
      alarms.adminAlarms++;
    }
  });

  return alarms;
}


export { GetUserData, GetCompanyData, UpdateUserProfile, ToggleFavorite, GetAllFavorites, GetUserAlarms };

