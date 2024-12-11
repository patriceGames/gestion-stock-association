import React, { useState, useEffect } from "react";
import { ToggleFavorite } from "./firebase"; // Importer la fonction `toggleFavorite` depuis firebase.js
import ReservationTable from "./MaterialCard/ReservationTable";
import ShareBox from "./MaterialCard/ShareBox";
import ProductInfo from "./MaterialCard/ProductInfo";
import Overlay from "./MaterialCard/Overlay";
import ImageGallery from "./MaterialCard/ImageGallery";
import { UiTextLight } from "./UI/Ui";

function MaterialCard({ currentUser, material, images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantityAvailable, setQuantityAvailable] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);
  const [showShareBox, setShowShareBox] = useState(false);

  const userId = currentUser?.uid;
  
  useEffect(() => {
    if (!userId || !material?.id) return;

    const loadFavoriteStatus = async () => {
      try {
        const isFav = currentUser.favorites.includes(material.id)
        setIsFavorited(isFav);
      } catch (error) {
        console.error("Erreur lors du chargement des favoris :", error);
      } finally {
        setIsLoadingFavorite(false);
      }
    };
    loadFavoriteStatus();
  }, [material?.id, userId, currentUser.favorites]);

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
    const productLink = `${window.location.origin}/material/${material.id}`;
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
    return <p><UiTextLight text={"Chargement..."} /></p>;
  }


  return (
    <div className="sm:mx-auto sm:rounded sm:overflow-hidden bg-white">
      <ImageGallery
        images={images}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        openImage={openImage}
        handleSwipeLeft={handleSwipeLeft}
        handleSwipeRight={handleSwipeRight}
        isFavorited={isFavorited}
        isLoadingFavorite={isLoadingFavorite}
        handleFavoriteClick={handleFavoriteClick}
        shareProduct={shareProduct}
      />
      <Overlay
        selectedImage={selectedImage}
        closeOverlay={closeOverlay}
        prevImage={prevImage}
        nextImage={nextImage}
      />
      {showShareBox && (
        <ShareBox
          material={material}
          copyToClipboard={copyToClipboard}
          closeShareBox={() => setShowShareBox(false)}
        />
      )}
      <ProductInfo material={material} quantityAvailable={quantityAvailable} />
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
