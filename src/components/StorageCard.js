import React from 'react';
import { FaEdit } from 'react-icons/fa';  // Icône d'édition
import { Link } from 'react-router-dom';  // Utilisation de Link pour la navigation

function StorageCard({ storage, onEditClick, companyId }) {
  return (
    <li className="border p-4 rounded shadow-lg relative">
      {/* Icône d'édition flottante en dehors du Link */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Empêche la propagation de l'événement de clic vers le lien
          onEditClick(storage);
        }}
        className="absolute top-2 right-2 bg-white text-[#EC751A] hover:text-[#009EE0] p-2 rounded-full"
      >
        <FaEdit />
      </button>

      <Link to={`/company/${companyId}/storage/${storage.id}`} className="block">
        {storage.imageUrl && (
          <img src={storage.imageUrl} alt={storage.name} className="w-full h-48 object-cover rounded mb-4" />
        )}
        <p><strong>Nom :</strong> {storage.name}</p>
        <p><strong>Adresse :</strong> {storage.address}</p>
      </Link>
    </li>
  );
}

export default StorageCard;
