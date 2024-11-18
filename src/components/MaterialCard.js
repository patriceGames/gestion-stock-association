import React, { useState, useEffect } from "react";
import { ToggleFavorite } from "./firebase"; // Importer la fonction `toggleFavorite` depuis firebase.js
import { auth } from "./firebase"; // Importer `auth` pour vérifier l'utilisateur connecté
import ReservationTable from "./ReservationTable";

function MaterialCard({ currentUser, material, images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantityAvailable, setQuantityAvailable] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);
  const [showShareBox, setShowShareBox] = useState(false);

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
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setSelectedImage(
      images[
        currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
      ]
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedImage(
      images[
        currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
      ]
    );
  };

  const handleFavoriteClick = async () => {
    if (!userId || !material?.id) return;

    try {
      const updatedIsFavorited = await ToggleFavorite(
        userId,
        material.id,
        isFavorited
      );
      setIsFavorited(updatedIsFavorited);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris :", error);
    }
  };

  const shareProduct = () => {
    setShowShareBox(true);
  };

  const copyToClipboard = () => {
    const productLink = `${window.location.origin}/product/${material.id}`;
    navigator.clipboard
      .writeText(productLink)
      .then(() => {
        alert("Lien copié dans le presse-papiers !");
      })
      .catch((error) => {
        console.error("Erreur lors de la copie du lien :", error);
      });
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
          <div className="relative w-full h-[500px] overflow-hidden">
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
              <button
                onClick={handleFavoriteClick}
                className="bg-white p-2 rounded-full shadow-md"
                aria-label={
                  isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"
                }
              >
                {isLoadingFavorite ? "🔄" : isFavorited ? "❤️" : "🤍"}
              </button>
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
              className={`w-24 h-24 object-cover flex-shrink-0 cursor-pointer ${
                currentImageIndex === index ? "border-4 border-blue-500" : ""
              }`}
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
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={closeOverlay}
          >
            &times;
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-cover"
          />

          {/* Flèche de gauche */}
          <button
            className="absolute left-4 text-white text-4xl"
            onClick={prevImage}
          >
            &#10094;
          </button>

          {/* Flèche de droite */}
          <button
            className="absolute right-4 text-white text-4xl"
            onClick={nextImage}
          >
            &#10095;
          </button>
        </div>
      )}

      {/* Share Box */}
      {showShareBox && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-96 bg-white p-4 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">Partager ce produit</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={`${window.location.origin}/product/${material.id}`}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={copyToClipboard}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Copier
            </button>
          </div>
          <button
            className="mt-4 text-gray-500 underline"
            onClick={() => setShowShareBox(false)}
          >
            Fermer
          </button>
        </div>
      )}

      {/* Product Info */}
      <div className="px-6 py-4 ">
        <div className="font-regular text-4xl mb-3">{material.name}</div>

        {/* Quantity Available */}
        <div className="flex items-center text-lg mt-4">
          <span className="text-gray-700">Quantité disponible: </span>
          <span className="ml-1 font-bold">{quantityAvailable}</span>
        </div>
        {/* stock */}
        <div className="flex items-center text-sm">
          <span className="text-gray-500">En stock : </span>
          <span className="ml-1 text-gray-500">{material.quantity}</span>
        </div>

        {/* Dernière modification*/}
        <div className="flex items-center text-sm mt-5">
          <span className="text-gray-500">Dernière vérification : </span>
          <span className="ml-1 text-gray-500">
            {new Date(material.updatedAt.seconds * 1000).toLocaleDateString(
              "fr-FR",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </span>
        </div>
      </div>
      <hr />

      {/* Footer with Date */}
      <div className="px-6 pt-4 pb-2">
        <span className="text-gray-900 text-lg">{material.description}</span>
      </div>
      <hr />
      <br />

      <ReservationTable
        material={material}
        currentUser={currentUser}
        totalQuantity={material.quantity}
        quantityAvailable={quantityAvailable}
        setQuantityAvailable={setQuantityAvailable}
      />
    </div>
  );
}

export default MaterialCard;
