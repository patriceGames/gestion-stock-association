import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetMaterialById } from "./firebase";
import MaterialDetailImages from "./MaterialDetailImages";

function MaterialDetail() {
  const { id } = useParams(); // Récupère l'ID du produit depuis l'URL
  const [material, setMaterial] = useState(null);

  useEffect(() => {
    // Fonction pour charger les données du produit
    const fetchMaterial = async () => {
      const data = await GetMaterialById(id);
      setMaterial(data); // Stocke les données du matériel
    };

    fetchMaterial();
  }, [id]);

  if (!material) {
    return <p>Chargement...</p>; // Affiche un message de chargement pendant la récupération des données
  }

  var images = [];
  if (material.imageUrl1 !== "") images.push(material.imageUrl1);
  if (material.imageUrl2 !== "") images.push(material.imageUrl2);
  if (material.imageUrl3 !== "") images.push(material.imageUrl3);
  if (material.imageUrl4 !== "") images.push(material.imageUrl4);
  if (material.imageUrl5 !== "") images.push(material.imageUrl5);

  return (
    <div>
      {material ? (
        <div className="m-5">
          <div className="md:flex md:items-center">
            <MaterialDetailImages images={images} />
            <div className="w-full max-w-lg mt-10 md:ml-5 md:mt-0 md:w-1/2">
              <h3 className="text-gray-700 uppercase text-lg">
                {material.name}
              </h3>
              <span className="text-gray-500 mt-3">{material.price + "€"}</span>
              <hr className="my-3" />
              <div className="mt-2">
                <label className="text-gray-700 text-sm" htmlFor="Quantite">
                  Quantité:
                </label>
                <div className="flex items-center mt-1">
                  <span className="text-gray-700 text-lg mx-2">20</span>
                </div>
              </div>
              <div className="flex items-center mt-6">
                <button className="mx-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="m-5">
            <label className="text-gray-700" htmlFor="Quantite">
              {material.description}
            </label>
          </div>
        </div>
      ) : (
        <h2>Produit introuvable</h2>
      )}
    </div>
  );
}

export default MaterialDetail;
