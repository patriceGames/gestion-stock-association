import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetMaterialById } from "./firebase";
import ProductCard from "./ProductCard";

function MaterialDetail({connected}) {
  const { id } = useParams(); // Récupère l'ID du produit depuis l'URL
  const [material, setMaterial] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Load material details based on ID from URL
    const fetchMaterial = async () => {
      const data = await GetMaterialById(id);
      setMaterial(data);
      // Load images if they exist
      const loadedImages = [];
      if (data.imageUrl1 !== '') loadedImages.push(data.imageUrl1);
      if (data.imageUrl2 !== '') loadedImages.push(data.imageUrl2);
      if (data.imageUrl3 !== '') loadedImages.push(data.imageUrl3);
      if (data.imageUrl4 !== '') loadedImages.push(data.imageUrl4);
      if (data.imageUrl5 !== '') loadedImages.push(data.imageUrl5);
      setImages(loadedImages);
    };

    fetchMaterial();
  }, [id]);

  return (
    <div className="bg-neutral-100">
      {material ? (
        <div className="p-5">
          <ProductCard connected={connected} material={material} images={images}/>
        </div>
      ) : (
        <h2>Chargement...</h2>
      )}
    </div>
  );
}

export default MaterialDetail;
