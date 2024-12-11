import React, { useState, useEffect } from "react";
import { getStorages } from "../firebase";

const Location = ({ formData, handleChange, company, currentUser }) => {
  const [storages, setStorages] = useState([]);
  const {selectedStorage } = formData; // Déstructuration pour accéder aux valeurs

  // Fonction pour récupérer les hangars de l'entreprise de l'utilisateur
  useEffect(() => {
    const fetchStorages = async () => {
        const storageList = await getStorages();
        setStorages(storageList);
    };

    fetchStorages();
  }, [company, currentUser]);

  return (
    <div className="relative z-0 mb-6 w-full group">
      {/* Affichage du champ texte ou du dropdown */}
      <select
        name="selectedStorage"
        id="storage"
        className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        value={selectedStorage}
        onChange={handleChange}
        required
      >
        <option value="">Sélectionner un emplacement</option>
        {storages.map((storage) => (
          <option key={storage.id} value={storage.id}>
            {storage.name}
          </option>
        ))}
      </select>
      <label
        htmlFor="location"
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600"
      >
        Localisation
      </label>
    </div>
  );
};

export default Location;
