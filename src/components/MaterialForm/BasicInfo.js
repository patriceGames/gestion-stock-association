import React from 'react';
import Categories from '../Categories';

const BasicInfo = ({ name, setName, category, setCategory, subcategory, setSubcategory }) => {
  return (
    <>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          name="floating_name"
          id="floating_name"
          className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label
          htmlFor="floating_name"
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600"
        >
          Nom du Matériau
        </label>
      </div>

      <div className="flex space-x-4">
        <div className="relative z-0 mb-6 w-full group">
          <select
            name="floating_category"
            id="floating_category"
            className="block pl-2 py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory('');  // Réinitialiser la sous-catégorie
            }}
          >
            <option value=""></option>
            {Categories.map((catGroup) => (
              <option key={catGroup.group} value={catGroup.group}>
                {catGroup.group}
              </option>
            ))}
          </select>
          <label
            htmlFor="floating_category"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600"
          >
            Catégorie
          </label>
        </div>
      </div>

      {category && (
        <div className="relative z-0 mb-6 w-full group">
          <select
            name="floating_subcategory"
            id="floating_subcategory"
            className="block pl-2 py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value=""></option>
            {Categories.find((catGroup) => catGroup.group === category)?.subcategories.map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
          <label
            htmlFor="floating_subcategory"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600"
          >
            Sous-Catégorie
          </label>
        </div>
      )}
    </>
  );
};

export default BasicInfo;
