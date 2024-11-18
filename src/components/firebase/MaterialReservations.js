import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./Base.js";

const enabled = true;

// Ajouter une réservation à un matériau
async function AddReservation(user, materialId, reservationData) {
  try {    
    const reservationRef = collection(
      db,
      "materials",
      materialId,
      "reservations"
    );
    await addDoc(reservationRef, {
      userId: user.uid,
      userName: user.email,
      projetName: reservationData.projetName,
      quantity: reservationData.quantity,
      date: serverTimestamp(),
    });
    alert("Réservation ajoutée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réservation :", error);
  }
}

// Récupérer toutes les réservations pour un matériau spécifique
async function GetReservations(materialId) {
  console.log("Lecture des reservations pour le matériau " + materialId);
  try {
    const reservationsRef = collection(
      db,
      "materials",
      materialId,
      "reservations"
    );
    if (enabled) {
      const querySnapshot = await getDocs(reservationsRef);
      const reservations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return reservations;
    }
    return {
      reservations: [
        {
          userId: "test",
          userName: "email",
          projetName: "project Mail",
          quantity: "12",
          date: serverTimestamp(),
        },
        {
            userId: "test",
            userName: "email",
            projetName: "project Mail",
            quantity: "12",
            date: serverTimestamp(),
          }
      ],
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    return [];
  }
}

// Mettre à jour une réservation pour un matériau spécifique
async function UpdateReservation(materialId, reservationId, updatedData) {
  try {
    const reservationRef = doc(
      db,
      "materials",
      materialId,
      "reservations",
      reservationId
    );
    await updateDoc(reservationRef, {
      projetName: updatedData.projetName,
      quantity: updatedData.quantity,
      date: serverTimestamp(),
    });
    alert("Réservation mise à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation :", error);
  }
}

// Supprimer une réservation pour un matériau spécifique
async function DeleteReservation(materialId, reservationId) {
  try {
    const reservationRef = doc(
      db,
      "materials",
      materialId,
      "reservations",
      reservationId
    );
    await deleteDoc(reservationRef);
    alert("Réservation supprimée avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation :", error);
  }
}

export {
  AddReservation,
  GetReservations,
  UpdateReservation,
  DeleteReservation,
};
