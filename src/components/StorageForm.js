import React from "react";
import { UiButton, UiTextLight, UiTitleSecondary } from "./UI/Ui";

function StorageForm({
  isEditing,
  newStorage,
  setNewStorage,
  imageFile,
  setImageFile,
  handleAddOrEditStorage,
  handleDeleteStorage,
  setShowPopup,
  setIsEditing,
  setSelectedStorage,
}) {
  return (
    <div className="popup  fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="popup-content mx-10 bg-white p-6 rounded shadow-lg relative">
        <UiTitleSecondary
          text={
            isEditing ? "Modifier l'entrepôt" : "Ajouter un nouvel entrepôt"
          }
        />
        <form>
          <div className="my-4">
            <UiTextLight text={"Nom"} />
            <input
              type="text"
              value={newStorage.name}
              onChange={(e) =>
                setNewStorage({ ...newStorage, name: e.target.value })
              }
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <UiTextLight text={"Adresse"} />
            <input
              type="text"
              value={newStorage.address}
              onChange={(e) =>
                setNewStorage({ ...newStorage, address: e.target.value })
              }
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <UiTextLight text={"Image"} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-end">
            {isEditing && (
              <UiButton
                action={handleDeleteStorage}
                color={"red"}
                text={"Supprimer"}
              />
            )}
            <UiButton
              action={() => {
                setShowPopup(false);
                setIsEditing(false);
                setSelectedStorage(null);
              }}
              color={"grey"}
              text={"Annuler"}
            />
            <UiButton
              action={handleAddOrEditStorage}
              text={isEditing ? "Mettre à jour" : "Ajouter"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default StorageForm;
