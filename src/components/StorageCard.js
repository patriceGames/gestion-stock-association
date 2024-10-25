import React from 'react';
import { FaEdit } from 'react-icons/fa';  // Icône d'édition
import { Link } from 'react-router-dom';  // Utilisation de Link pour la navigation

function StorageCard({ storage, onEditClick, companyId }) {
  return (
    <li className="border p-4 rounded shadow-lg relative">
        <Link to={`/company/${companyId}/storage/${storage.id}`} className="block">
      {/* Icône d'édition flottante */}
      <button
        onClick={() => onEditClick(storage)}
        className="absolute top-2 right-2 bg-yellow-500 text-white p-2 rounded-full"
      >
        <FaEdit />
      </button>

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
