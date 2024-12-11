import React from "react";

function Overlay({ selectedImage, closeOverlay, prevImage, nextImage }) {
  if (!selectedImage) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
      <button className="absolute top-4 right-4 text-white text-3xl" onClick={closeOverlay}>
        &times;
      </button>
      <img src={selectedImage} alt="Full size" className="max-w-full max-h-full object-cover" />
      <button className="absolute left-4 text-white text-4xl" onClick={prevImage}>
        &#10094;
      </button>
      <button className="absolute right-4 text-white text-4xl" onClick={nextImage}>
        &#10095;
      </button>
    </div>
  );
}

export default Overlay;
