import React from 'react';

const Location = ({
  companyId,
  storages,
  locationType,
  setLocationType,
  location,
  setLocation,
  selectedStorage,
  setSelectedStorage
}) => {
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
                checked={locationType === 'text'}
                onChange={() => setLocationType('text')}
              />
              <span className="ml-2">Texte</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                className="form-radio"
                name="locationType"
                value="dropdown"
                checked={locationType === 'dropdown'}
                onChange={() => setLocationType('dropdown')}
              />
              <span className="ml-2">Liste des hangars</span>
            </label>
          </div>

          {/* Affichage du champ texte ou du dropdown */}
          {locationType === 'text' ? (
            <input
              type="text"
              name="location"
              id="location"
              className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Saisir la localisation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          ) : (
            <select
              name="storage"
              id="storage"
              className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}  // Enregistrer le storageId ici
              required
            >
              <option value="">Sélectionner un hangar</option>
              {storages.map((storage) => (
                <option key={storage.id} value={storage.id}>  {/* Utilisation de storage.id */}
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
          onChange={(e) => setLocation(e.target.value)}
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
