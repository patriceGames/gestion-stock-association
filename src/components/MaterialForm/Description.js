import React from 'react';

const Description = ({ description, setDescription }) => {
  return (
    <div className="relative z-0 mb-6 w-full group">
      <textarea
        name="floating_description"
        id="floating_description"
        className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <label
        htmlFor="floating_description"
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600"
      >
        Description
      </label>
    </div>
  );
};

export default Description;
