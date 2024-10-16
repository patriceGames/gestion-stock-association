import React, { useState } from 'react';

function MaterialDetailImages({ images }) {
    const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fonction pour ouvrir l'image en plein écran
  const openImage = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };

  // Fonction pour fermer l'overlay
  const closeOverlay = () => {
    setSelectedImage(null);
  };

  // Fonction pour passer à l'image précédente
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    setSelectedImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]);
  };

  // Fonction pour passer à l'image suivante
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    setSelectedImage(images[currentIndex === images.length - 1 ? 0 : currentIndex + 1]);
  };

  return (
    <div className="flex flex-col md:flex-row h-80 ">
      {/* Couverture, première image */}
      <div className="w-full min-w-80 md:w-3/4 h-3/4 md:h-full">
        <img
          src={images[0]}
          alt="Cover"
          className="object-cover w-full h-full cursor-pointer"
          onClick={() => openImage(0)}
        />
      </div>

      {/* Autres images */}
      <div className="flex md:flex-wrap md:w-1/4 h-1/4 md:h-full mt-2 md:mt-0 md:ml-2 space-x-2 md:space-x-0 md:space-y-2">
        {images.slice(1, 4).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Material ${index + 1}`}
            className="w-1/4 md:w-full h-24 md:h-1/4 object-cover cursor-pointer"
            onClick={() => openImage(index + 1)}
          />
        ))}

        {/* Si plus de 4 images, afficher "x de plus" */}
        {images.length > 4 && (
          <div
            className="relative w-full max-w-40 lg:w-max-full h-24 md:h-1/6 bg-gray-200 flex items-center justify-center cursor-pointer"
            onClick={() => openImage(4)}
          >
            <span className="text-white text-lg font-semibold">
              {`+ ${images.length - 4}`}
            </span>
          </div>
        )}
      </div>

      {/* Overlay en plein écran */}
      {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={closeOverlay}>
            &times;
          </button>
          <img src={selectedImage} alt="Full size" className="max-w-full max-h-full object-cover" />

          {/* Flèche de gauche */}
          <button className="absolute left-4 text-white text-4xl" onClick={prevImage}>
            &#10094;
          </button>

          {/* Flèche de droite */}
          <button className="absolute right-4 text-white text-4xl" onClick={nextImage}>
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}

export default MaterialDetailImages;
