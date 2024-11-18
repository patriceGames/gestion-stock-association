import {
    deleteDoc,
    doc,
    updateDoc,
    collection,
    addDoc,
    getDocs,
  } from "firebase/firestore";
  
  import {db} from "./Base.js";

// Fonction pour ajouter un entrepôt dans Firestore
const addStorage = async (companyId, storageData) => {
    const storagesRef = collection(db, "companies", companyId, "storages");
    const newDoc = await addDoc(storagesRef, storageData);
    return newDoc.id;
  };
  
  // Fonction pour mettre à jour un entrepôt dans Firestore
  const updateStorage = async (companyId, storageId, updatedData) => {
    const storageDocRef = doc(db, "companies", companyId, "storages", storageId);
    await updateDoc(storageDocRef, updatedData);
  };
  
  // Fonction pour supprimer un entrepôt dans Firestore
  const deleteStorage = async (companyId, storageId) => {
    const storageDocRef = doc(db, "companies", companyId, "storages", storageId);
    await deleteDoc(storageDocRef);
  };
  
  // Fonction pour récupérer tous les entrepôts pour une entreprise
  const getStorages = async (companyId) => {
    const storagesRef = collection(db, "companies", companyId, "storages");
    const querySnapshot = await getDocs(storagesRef);
    const storages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return storages;
  };

  export {addStorage, updateStorage, deleteStorage, getStorages};