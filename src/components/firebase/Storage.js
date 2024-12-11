import {
    deleteDoc,
    doc,
    updateDoc,
    collection,
    addDoc,
    getDocs,
    getDoc,
  } from "firebase/firestore";
  
  import {db} from "./Base.js";

// Fonction pour ajouter un entrepôt dans Firestore
const addStorage = async (storageData) => {
    console.log("Ajout d'un stockage")
    const storagesRef = collection(db, "storages");
    const newDoc = await addDoc(storagesRef, storageData);
    return newDoc.id;
  };
  
  // Fonction pour mettre à jour un entrepôt dans Firestore
  const updateStorage = async (storageId, updatedData) => {
    console.log("Modification du stockage " + storageId)
    const storageDocRef = doc(db, "storages", storageId);
    await updateDoc(storageDocRef, updatedData);
  };
  
  // Fonction pour supprimer un entrepôt dans Firestore
  const deleteStorage = async (storageId) => {
    console.log("Suppression d'un stockage")
    const storageDocRef = doc(db, "storages", storageId);
    await deleteDoc(storageDocRef);
  };
  
  // Fonction pour récupérer un entrepôt
  const getStorage = async (storageId) => {
    try {
      console.log("Lecture du storage " + storageId);
      const storageRef = doc(db, "storages", storageId);
      const storageSnapshot = await getDoc(storageRef);

      if (storageSnapshot.exists()) {
        const storageData = storageSnapshot.data(); // Extract the data from the snapshot
        return storageData; // Return the data object
      } else {
        console.warn("No storage found with ID:", storageId);
        return null; // Handle the case where the document doesn't exist
      }
    } catch (error) {
      console.error("Error fetching storage:", error);
      throw error; // Propagate the error if needed
    }
  };
  

  // Fonction pour récupérer tous les entrepôts pour une entreprise
  const getStorages = async () => {
    console.log("Lecture des storages")
    const storagesRef = collection(db, "storages");
    const querySnapshot = await getDocs(storagesRef);
    const storages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return storages;
  };

  export {addStorage, updateStorage, deleteStorage, getStorage, getStorages};