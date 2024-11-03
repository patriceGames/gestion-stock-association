import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";

const Location = ({ formData, handleChange }) => {
  const [companyId, setCompanyId] = useState(null);
  const [storages, setStorages] = useState([]);
  const { locationType, location, selectedStorage } = formData; // Déstructuration pour accéder aux valeurs

  const user = auth.currentUser;

  // Fonction pour récupérer les hangars de l'entreprise de l'utilisateur
  useEffect(() => {
    const fetchStorages = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const companyId = userDoc.data().companyId;
          if (companyId) {
            setCompanyId(companyId);
            const storagesRef = collection(db, "companies", companyId, "storages");
            const storageQuerySnapshot = await getDocs(storagesRef);
            const storageList = storageQuerySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setStorages(storageList);
          }
        }
      }
    };

    fetchStorages();
  }, [user]);

  return (
    <div className="relative z-0 mb-6 w-full group">
      {companyId ? (
        <>
          {/* Toggle pour choisir entre champ texte et dropdown */}
          <div className="mb-4">
            <label className="mr-2">Localisation :</label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="locationType"
                value="text"
                checked={locationType === "text"}
                onChange={handleChange}
              />
              <span className="ml-2">Adresse</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                className="form-radio"
                name="locationType"
                value="dropdown"
                checked={locationType === "dropdown"}
                onChange={handleChange}
              />
              <span className="ml-2">Liste des hangars</span>
            </label>
          </div>

          {/* Affichage du champ texte ou du dropdown */}
          {locationType === "text" ? (
            <input
              type="text"
              name="location"
              id="location"
              className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Saisir la localisation"
              value={location}
              onChange={handleChange}
              required
            />
          ) : (
            <select
              name="selectedStorage"
              id="storage"
              className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={selectedStorage}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un hangar</option>
              {storages.map((storage) => (
                <option key={storage.id} value={storage.id}>
                  {storage.name}
                </option>
              ))}
            </select>
          )}
        </>
      ) : (
        // Si l'utilisateur n'a pas de société, on affiche un champ texte
        <input
          type="text"
          name="location"
          id="location"
          className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder="Saisir la localisation"
          value={location}
          onChange={handleChange}
          required
        />
      )}
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
