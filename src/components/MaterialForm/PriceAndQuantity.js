import React from 'react';

const PriceAndQuantity = ({ formData, handleChange }) => {
  const { quantity } = formData; // Déstructuration de formData pour obtenir les valeurs

  return (
    <div className="flex space-x-4">
      <div className="relative z-0 mb-6 w-1/2 group">
        <input
          type="number"
          name="quantity" // Le nom doit correspondre à la clé dans formData
          id="floating_quantity"
          className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          required
          value={quantity}
          onChange={handleChange}
        />
        <label
          htmlFor="floating_quantity"
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600"
        >
          Quantité
        </label>
      </div>
    </div>
  );
};

export default PriceAndQuantity;
