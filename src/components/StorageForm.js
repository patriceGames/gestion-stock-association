import React from 'react';

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
  setSelectedStorage
}) {
  return (
    <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="popup-content bg-white p-6 rounded shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Modifier l'entrepôt" : "Ajouter un nouvel entrepôt"}
        </h2>
        <form onSubmit={handleAddOrEditStorage}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Nom</label>
            <input
              type="text"
              value={newStorage.name}
              onChange={(e) => setNewStorage({ ...newStorage, name: e.target.value })}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Adresse</label>
            <input
              type="text"
              value={newStorage.address}
              onChange={(e) => setNewStorage({ ...newStorage, address: e.target.value })}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleDeleteStorage}
              className="bg-red-500 text-white px-4 py-2 rounded ml-4"
            >
              Supprimer
            </button>
          )}
          <button
            type="button"
            onClick={() => { setShowPopup(false); setIsEditing(false); setSelectedStorage(null); }}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
          >
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
}

export default StorageForm;
