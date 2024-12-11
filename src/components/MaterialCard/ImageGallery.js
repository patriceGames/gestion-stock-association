import React from "react";
import FavoriteAndShareButtons from "./FavoriteAndShareButtons";

function ImageGallery({
  images,
  currentImageIndex,
  setCurrentImageIndex,
  openImage,
  handleSwipeLeft,
  handleSwipeRight,
  isFavorited,
  isLoadingFavorite,
  handleFavoriteClick,
  shareProduct
}) {
  return (
    <div className="relative flex flex-col">
      <div className="relative w-full h-[400px] overflow-hidden">
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
      </div>
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

      <FavoriteAndShareButtons
        isFavorited={isFavorited}
        isLoadingFavorite={isLoadingFavorite}
        handleFavoriteClick={handleFavoriteClick}
        shareProduct={shareProduct}
      />
    </div>
  );
}

export default ImageGallery;
