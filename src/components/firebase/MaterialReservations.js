import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "./Base.js";

export function ReservationStateTranslate(state) {
  const stateMapping = {
      0: "En Attente",
      1: "Confirmée",
      2: "2",
      3: "En cours d'acheminement",
      4: "4",
      5: "Livrée sur site",
      6: "6",
      7: "7",
      8: "Refusée",
      9: "Archivée",
      10: "Supprimée"
  };

  return stateMapping[state] || state;
}

// Ajouter une réservation à la collection
async function AddReservation(user, materialId, reservationData) {
  try {
    // Référence à la collection "reservations"
    const reservationRef = collection(db, "reservations");

    // Ajouter une nouvelle réservation dans la collection "reservations"
    await addDoc(reservationRef, {
      userId: user.uid,
      userName: user.lastName
      ? user.lastName + " " + user.firstName
      : user.email,
      materialId: materialId, // Ajout de l'ID du matériau
      materialName: reservationData.materialName, // Ajout du nom du matériau
      projectName: reservationData.projectName,
      quantity: reservationData.quantity,
      state: 0,
      date: serverTimestamp(),
    });

    console.log("Réservation ajoutée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réservation :", error);
  }
}

// Récupérer toutes les réservations pour un matériau spécifique
async function GetAllReservations() {
  console.log("Lecture de toutes les réservations");
  try {
    // Référence à la collection "reservations"
    const reservationsRef = collection(db, "reservations");

    // Création de la requête pour filtrer par materialId
    const q = query(reservationsRef);
    const querySnapshot = await getDocs(q);

    // Extraction des données des documents
    const reservations = querySnapshot.docs.map((doc) => ({
      stateExplicit : ReservationStateTranslate(doc.data().state),
      id: doc.id,
      ...doc.data(),
    }));

    return reservations;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    return [];
  }
}

// Récupérer toutes les réservations pour un matériau spécifique
async function GetReservations(materialId) {
  console.log("Lecture des réservations pour le matériau " + materialId);
  try {
    // Référence à la collection "reservations"
    const reservationsRef = collection(db, "reservations");

    // Création de la requête pour filtrer par materialId
    const q = query(reservationsRef, where("materialId", "==", materialId), where("state", "<=", 7));
    const querySnapshot = await getDocs(q);

    // Extraction des données des documents
    const reservations = querySnapshot.docs.map((doc) => ({
      stateExplicit : ReservationStateTranslate(doc.data().state),
      id: doc.id,
      ...doc.data(),
    }));

    return reservations;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    return [];
  }
}

/**
 * Récupère toutes les réservations effectuées par un utilisateur donné.
 *
 * @param {string} userId - L'ID de l'utilisateur.
 * @returns {Promise<Array>} - Une liste des réservations.
 */
const GetUserReservations = async (user) => {
  try {
    console.log("Chargement des réservations utilisateur...")
    const reservationsRef = collection(db, "reservations");
    let q;

    if (user.role === 'admin') {
      // Si l'utilisateur est un admin, récupère toutes les réservations avec un état <= 7
      q = query(reservationsRef, where("state", "<=", 8));
    } else {
      // Sinon, récupère seulement les réservations de l'utilisateur
      q = query(
        reservationsRef,
        where("userId", "==", user.uid),
        where("state", "<=", 7)
      );
    }

    const querySnapshot = await getDocs(q);

    // Récupérer toutes les réservations
    const reservations = querySnapshot.docs.map((doc) => ({
      stateExplicit: ReservationStateTranslate(doc.data().state),
      id: doc.id,
      ...doc.data(),
      date: doc.data().date ? doc.data().date.toDate().toLocaleDateString() : "N/A",
    }));

    return reservations;
  } catch (error) {
    console.error(`Error fetching reservations for userId=${user.uid}:`, error);
    throw new Error("Could not fetch reservations. Please try again later.");
  }
};


// Mettre à jour une réservation
async function UpdateReservation(reservationId, updatedData) {
  try {
    // Préparez l'objet pour la mise à jour en filtrant les valeurs non définies
    const updateData = {
      date: serverTimestamp(), // Met à jour la date au moment de l'update
    };

    // Ajoutez uniquement les champs présents dans formData
    if (updatedData.state !== undefined) updateData.state = updatedData.state;
    if (updatedData.projectName !== undefined) updateData.projectName = updatedData.projectName;
    if (updatedData.quantity !== undefined) updateData.quantity = updatedData.quantity;
    if (updatedData.materialName !== undefined) updateData.materialName = updatedData.materialName;

    // Référence à la réservation dans la collection "reservations"
    const reservationRef = doc(db, "reservations", reservationId);
    console.log(updatedData)
    // Mise à jour des données de la réservation
    await updateDoc(reservationRef, updateData);

    console.log("Réservation mise à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation :", error);
  }
}

// Supprimer une réservation
async function DeleteReservation(reservationId) {
  try {
    // Référence à la réservation dans la collection "reservations"
    const reservationRef = doc(db, "reservations", reservationId);

    // Suppression du document correspondant
    await deleteDoc(reservationRef);

    console.log("Réservation supprimée avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation :", error);
  }
}

export {
  AddReservation,
  GetAllReservations,
  GetReservations,
  UpdateReservation,
  DeleteReservation,
  GetUserReservations,
};
