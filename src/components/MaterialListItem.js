import { useNavigate } from 'react-router-dom';

function MaterialListItem({ material, DeleteMaterial }) {

  const navigate = useNavigate();
  const handleClick = () => {
    // Redirige vers la page du produit en utilisant son ID
    navigate(`/product/${material.id}`);
  };

  return (
    <li
      key={material.id}
      className="w-full cursor-pointer max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
      onClick={handleClick}
    >
      <div
        className="flex items-end justify-end h-56 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${material.imageUrl})`,
        }}
      >
        <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
          {material.imageUrl && (
            <img
              src={material.imageUrl}
              alt={material.name}
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          )}
        </button>
      </div>
      <div className="px-5 py-3">
        <h3 className="text-gray-700 uppercase">{material.name}</h3>
        <span className="text-gray-500 mt-2">{material.description}</span>
      </div>
      {/* Button to delete the material */}
      <button
        onClick={() => DeleteMaterial(material.id)}
        className="text-red-600 hover:text-red-800"
      >
        Supprimer
      </button>
    </li>
  );
}

export default MaterialListItem;
