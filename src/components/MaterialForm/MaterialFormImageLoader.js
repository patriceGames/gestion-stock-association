

function MaterialFormImageLoader({image, setImage, inputId}) {
  // Fonction pour gérer la sélection de fichier
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Fonction pour supprimer l'image sélectionnée
  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
        onClick={() => document.getElementById(inputId).click()}
      >
        {image ? (
          <>
            <img src={URL.createObjectURL(image)} alt="Material" className="w-full h-full object-cover rounded-lg" />
            <button
              onClick={(e) => {
                e.stopPropagation(); // Empêche le déclenchement de l'input
                handleRemoveImage();
              }}
              className="absolute text-xs h-7 w-7 bottom-1 right-1 bg-red-500 text-white p-1 rounded-full"
            >
              🗑️
            </button>
          </>
        ) : (
          <span className="text-4xl text-gray-400">+</span>
        )}
      </div>

      {/* Input de type file masqué */}
      <input
        type="file"
        id={inputId}
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
}

export default MaterialFormImageLoader;