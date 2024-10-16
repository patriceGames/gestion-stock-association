import React, { useState, useEffect } from 'react';
import { ToggleFavorite } from './firebase'; // Importer la fonction `toggleFavorite` depuis firebase.js
import { auth } from './firebase'; // Importer `auth` pour vérifier l'utilisateur connecté

function ProductCard({ connected, material, images}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);

  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (!userId || !material?.id) return;

    const loadFavoriteStatus = async () => {
      try {
        const isFav = await ToggleFavorite(userId, material.id, false, true);
        setIsFavorited(isFav);
      } catch (error) {
        console.error("Erreur lors du chargement des favoris :", error);
      } finally {
        setIsLoadingFavorite(false);
      }
    };
    loadFavoriteStatus();
  }, [material?.id, userId]);

  const handleSwipeLeft = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleSwipeRight = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const openImage = (index) => {
    setSelectedImage(images[index]);
  };

  const closeOverlay = () => {
    setSelectedImage(null);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    setSelectedImage(images[currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1]);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    setSelectedImage(images[currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1]);
  };

  const handleFavoriteClick = async () => {
    if (!userId || !material?.id) return;

    try {
      const updatedIsFavorited = await ToggleFavorite(userId, material.id, isFavorited);
      setIsFavorited(updatedIsFavorited);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris :", error);
    }
  };

  const shareProduct = () => {
    // Logic to share product link
    console.log('Product link shared');
  };

  if (!material) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="max-w-3xl p-5 mx-auto rounded overflow-hidden bg-white">
      {/* Image Section */}
      <div className="relative flex flex-col">
        {/* Main Image */}
        <div className="flex-1">
          <div className="relative w-full h-96 overflow-hidden">
            <img
              className="w-full h-full object-cover cursor-pointer"
              src={images[currentImageIndex]}
              alt="Main Product"
              onClick={() => openImage(currentImageIndex)}
            />
            <button
              onClick={handleSwipeRight}
              className="absolute top-1/2 left-2 bg-white p-2 rounded-full shadow-md transform -translate-y-1/2"
            >
              &#8592;
            </button>
            <button
              onClick={handleSwipeLeft}
              className="absolute top-1/2 right-2 bg-white p-2 rounded-full shadow-md transform -translate-y-1/2"
            >
              &#8594;
            </button>
            <div className="absolute top-2 right-2 flex space-x-2">
              {connected && (
                <button
                  onClick={handleFavoriteClick}
                  className="bg-white p-2 rounded-full shadow-md"
                  aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  {isLoadingFavorite ? '🔄' : (isFavorited ? '❤️' : '🤍')}
                </button>
              )}
              <button
                onClick={shareProduct}
                className="bg-white p-2 rounded-full shadow-md"
              >
                &#128257;
              </button>
            </div>
          </div>
        </div>
        {/* Small Images - Always at the Bottom */}
        <div className="flex space-x-4 overflow-x-auto mt-4 px-4">
          {images.map((image, index) => (
            <img
              key={index}
              className={`w-24 h-24 object-cover flex-shrink-0 cursor-pointer ${currentImageIndex === index ? 'border-4 border-blue-500' : ''}`}
              src={image}
              alt={`Material ${index + 1}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
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

      {/* Product Info */}
      <div className="px-6 py-4 ">
        <div className="font-regular text-4xl mb-3">{material.name}</div>
        <p className="text-gray-700 text-2xl">{material.price} €</p>

        {/* Quantity Available */}
        <div className="flex items-center text-lg mt-4">
          <span className="text-gray-700">Quantité disponible:   </span>
          <span className="ml-1 font-bold">20</span>
        </div>

        {/* Dernière modification*/}
        <div className="flex items-center text-sm mt-5">
          <span className="text-gray-500">Dernière vérification:   </span>
          <span className="ml-1 text-gray-500">14/10/2024</span>
        </div>
      </div>
      <hr/>

      {/* Footer with Date */}
      <div className="px-6 pt-4 pb-2">
        <span className="text-gray-500 text-lg">{material.description}</span>
      </div>
    </div>
  );
}

export default ProductCard;