import React, { useState, useEffect } from "react";
import {
  addStorage,
  updateStorage,
  deleteStorage,
  getStorages,
  uploadImage,
} from "./firebase"; // Import des fonctions Firebase
import StorageList from "./StorageList"; // Import de la liste
import StorageForm from "./StorageForm"; // Import du formulaire
import { UiButton, UiTitleMain, UiTitleSecondary } from "./UI/Ui";

function StorageManagement({ company, currentUser }) {
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // Gérer l'état du pop-up
  const [isEditing, setIsEditing] = useState(false); // Pour savoir si on est en mode édition
  const [selectedStorage, setSelectedStorage] = useState(null); // Gérer l'entrepôt sélectionné pour modification
  const [newStorage, setNewStorage] = useState({ name: "", address: "" });
  const [imageFile, setImageFile] = useState(null); // Gérer le fichier image

  // Fonction pour charger les entrepôts au chargement du composant
  useEffect(() => {
    const fetchStorages = async () => {
      try {
        const storageList = await getStorages(); // Appel à la fonction getStorages
        setStorages(storageList);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des storages:", error);
        setLoading(false);
      }
    };

    if (company?.id) {
      fetchStorages();
    } else {
      setLoading(false);
    }
  }, [company]);

  // Fonction pour gérer l'ajout ou la modification d'un entrepôt
  const handleAddOrEditStorage = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = selectedStorage ? selectedStorage.imageUrl : "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile); // Appel à la fonction uploadImage
      }

      if (isEditing) {
        await updateStorage(selectedStorage.id, {
          name: newStorage.name,
          address: newStorage.address,
          imageUrl,
        });
        setStorages(
          storages.map((storage) =>
            storage.id === selectedStorage.id
              ? { ...storage, ...newStorage, imageUrl }
              : storage
          )
        );
      } else {
        const newDocId = await addStorage({
          name: newStorage.name,
          address: newStorage.address,
          imageUrl,
        });
        setStorages([...storages, { id: newDocId, ...newStorage, imageUrl }]);
      }

      setShowPopup(false);
      setNewStorage({ name: "", address: "" });
      setImageFile(null);
      setSelectedStorage(null);
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout ou la modification du hangar:",
        error
      );
    }
  };

  // Fonction pour supprimer un entrepôt
  const handleDeleteStorage = async (e) => {
    e.preventDefault();
    if (selectedStorage) {
      try {
        await deleteStorage(selectedStorage.id); // Appel à la fonction deleteStorage
        setStorages(
          storages.filter((storage) => storage.id !== selectedStorage.id)
        );
        setShowPopup(false);
        setSelectedStorage(null);
      } catch (error) {
        console.error("Erreur lors de la suppression du hangar:", error);
      }
    }
  };

  if (loading) {
    return <UiTitleSecondary text={"Chargement des entrepôts..."} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-md rounded-lg">
      <UiTitleMain text={"Espaces de stockage"} />
        {/* Affichage de la liste des entrepôts */}
        <StorageList
          storages={storages}
          onEditClick={(storage) => {
            setSelectedStorage(storage);
            setNewStorage({ name: storage.name, address: storage.address });
            setShowPopup(true);
            setIsEditing(true);
          }}
          companyId={company.id}
        />
        <br />

        {/* Bouton pour ajouter un nouvel entrepôt */}
        {currentUser?.role === "admin" && (
          <UiButton
            action={() => {
              setShowPopup(true);
              setIsEditing(false);
            }}
            text={"Ajouter un entrepôt"}
          />
        )}

        {/* Pop-up pour ajouter ou modifier un entrepôt */}
        {showPopup && (
          <StorageForm
            isEditing={isEditing}
            newStorage={newStorage}
            setNewStorage={setNewStorage}
            imageFile={imageFile}
            setImageFile={setImageFile}
            handleAddOrEditStorage={handleAddOrEditStorage}
            handleDeleteStorage={handleDeleteStorage}
            setShowPopup={setShowPopup}
            setIsEditing={setIsEditing}
            setSelectedStorage={setSelectedStorage}
          />
        )}
      </div>
    </div>
  );
}

export default StorageManagement;