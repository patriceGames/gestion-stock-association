import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  // Import useNavigate pour la navigation
import { GetMaterialById } from "./firebase";
import ProductCard from "./ProductCard";

function MaterialDetail({ connected }) {
  const { companyId, id, storageId } = useParams();  // Récupérer à la fois l'ID du matériau et le storageId du hangar depuis les paramètres
  const [material, setMaterial] = useState(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();  // Initialiser useNavigate pour permettre la navigation

  useEffect(() => {
    // Charger les détails du matériau en fonction de l'ID de l'URL
    const fetchMaterial = async () => {
      const data = await GetMaterialById(id);
      setMaterial(data);

      // Charger les images si elles existent
      const loadedImages = [];
      if (data.imageUrl1) loadedImages.push(data.imageUrl1);
      if (data.imageUrl2) loadedImages.push(data.imageUrl2);
      if (data.imageUrl3) loadedImages.push(data.imageUrl3);
      if (data.imageUrl4) loadedImages.push(data.imageUrl4);
      if (data.imageUrl5) loadedImages.push(data.imageUrl5);
      setImages(loadedImages);
    };

    fetchMaterial();
  }, [id]);

  return (
    <div className="bg-neutral-100">
      <div className="p-5">
        {/* Flèche de retour vers le hangar seulement si companyId est présent */}
        {companyId && (
          <button
            onClick={() => navigate(`/company/${companyId}/storage/${storageId}`)}
            className="flex items-center text-blue-500 mb-4"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au hangar
          </button>
        )}

        {material ? (
          <ProductCard connected={connected} material={material} images={images} />
        ) : (
          <h2>Chargement...</h2>
        )}
      </div>
    </div>
  );
}

export default MaterialDetail;
