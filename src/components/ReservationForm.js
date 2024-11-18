import React, { useState } from "react";

function ReservationForm({
  reservation,
  material,
  quantityAvailable,
  onSave,
  onCancel,
  onDelete
}) {
  const [formData, setFormData] = useState(
    reservation || {
      projetName: "",
      quantity: "",
    }
  );
  const [error, setError] = useState(""); // État pour le message d'erreur

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      const quantity = Number(value); // Convertir la valeur en nombre
      if (quantity > quantityAvailable) {
        setError(`La quantité ne peut pas dépasser ${quantityAvailable}.`);
        return;
      } else {
        setError(""); // Réinitialiser l'erreur si la valeur est correcte
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="number"
          name="quantity"
          id="floating_quantity"
          className={`block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-600"
          }`}
          placeholder=" "
          required
          value={formData.quantity}
          onChange={handleChange}
        />
        <label
          htmlFor="floating_quantity"
          className={`absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 ${
            error
              ? "text-red-500 peer-focus:text-red-500"
              : "text-gray-500 peer-focus:text-blue-600"
          }`}
        >
          Quantité (Disponible : {quantityAvailable})
        </label>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          name="projetName"
          id="floating_projetName"
          className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={formData.projetName}
          onChange={handleChange}
        />
        <label
          htmlFor="floating_projetName"
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600"
        >
          Nom du Projet
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
        >
          Annuler
        </button>
        {reservation && <button
          type="button"
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded ml-4"
        >
          Supprimer
        </button> }
        <button
          type="submit"
          className={`px-4 py-2 rounded ${
            error ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
          disabled={!!error} // Désactiver le bouton en cas d'erreur
        >
          Sauvegarder
        </button>
      </div>
    </form>
  );
}

export default ReservationForm;
