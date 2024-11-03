import React from 'react';

const DimensionsAndCondition = ({ formData, handleChange }) => {
  const { dimensions, condition } = formData; // Déstructuration pour obtenir les valeurs

  return (
    <>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          name="dimensions" // Correspond à la clé dans formData
          id="floating_dimensions"
          className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={dimensions}
          onChange={handleChange} // Utilise handleChange pour gérer les changements
          required
        />
        <label
          htmlFor="floating_dimensions"
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600"
        >
          Dimensions
        </label>
      </div>

      <div className="relative z-0 mb-6 w-full group">
        <select
          name="condition" // Correspond à la clé dans formData
          id="floating_condition"
          className="block pl-2 py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          value={condition}
          onChange={handleChange}
          required
        >
          <option value=""></option>
          <option value="Neuf">Neuf</option>
          <option value="Bon état">Bon état</option>
          <option value="Altérations légères">Altérations légères</option>
          <option value="Usé">Usé</option>
        </select>
        <label
          htmlFor="floating_condition"
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600"
        >
          État du matériau
        </label>
      </div>
    </>
  );
};

export default DimensionsAndCondition;
