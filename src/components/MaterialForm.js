import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth, DeleteMaterial } from "./firebase";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import BasicInfo from "./MaterialForm/BasicInfo";
import PriceAndQuantity from "./MaterialForm/PriceAndQuantity";
import DimensionsAndCondition from "./MaterialForm/DimensionsAndCondition";
import Description from "./MaterialForm/Description";
import Images from "./MaterialForm/Images";
import Location from "./MaterialForm/Location";

import { AddMaterial, UpdateMaterial } from "./MaterialFormFunctions";

const MaterialForm = ({ connected, baseMaterialId, closeEditpopUp }) => {
  let { materialId } = useParams();
  if (baseMaterialId) materialId = baseMaterialId;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    dimensions: "",
    quantity: "",
    condition: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    locationType: "text",
    location: "",
    selectedStorage: "",
  });

  const [uploading, setUploading] = useState(false);
  const [initialImages, setInitialImages] = useState({}); // stocker les URLs d'images originales pour les comparer

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const splitCategory = (category) => {
    const [cat, subcat] = (category || "").split(" - ");
    return { cat: cat || "", subcat: subcat || "" };
  };

  useEffect(() => {
    const fetchMaterial = async () => {
      if (materialId) {
        const materialRef = doc(db, "materials", materialId);
        const materialDoc = await getDoc(materialRef);
        if (materialDoc.exists()) {
          const data = materialDoc.data();
          setInitialImages({
            imageUrl1: data.imageUrl1 || null,
            imageUrl2: data.imageUrl2 || null,
            imageUrl3: data.imageUrl3 || null,
            imageUrl4: data.imageUrl4 || null,
            imageUrl5: data.imageUrl5 || null,
          });

          const { cat, subcat } = splitCategory(data.category);
          setFormData({
            name: data.name,
            category: cat,
            subcategory: subcat,
            description: data.description,
            dimensions: data.dimensions,
            quantity: data.quantity,
            condition: data.condition,
            image1: data.imageUrl1 || null,
            image2: data.imageUrl2 || null,
            image3: data.imageUrl3 || null,
            image4: data.imageUrl4 || null,
            image5: data.imageUrl5 || null,
            locationType: data.storageId ? "dropdown" : "text",
            location: data.location || "",
            selectedStorage: data.storageId || "",
          });
        }
      }
    };

    fetchMaterial();
  }, [materialId]);

  const validateForm = () => {
    const requiredFields = ["name", "category", "quantity"];
    return requiredFields.every((field) => formData[field]);
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      setUploading(true);

      AddMaterial(user, formData, setFormData);
    } else {
      alert("Vous devez être connecté pour ajouter un matériau");
    }

    setUploading(false);
  };

  const handleUpdateMaterial = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const user = auth.currentUser;
    if (user && materialId) {
      setUploading(true);
      UpdateMaterial(user, formData, initialImages, materialId);
    } else {
      alert("Vous devez être connecté pour modifier un matériau");
    }

    setUploading(false);
    if (baseMaterialId) closeEditpopUp();
  };

  const handleDeleteMaterial = async () => {
    if (materialId) {
      try {
        await DeleteMaterial(materialId); // Appel à la fonction deleteMaterial
        baseMaterialId && closeEditpopUp();
      } catch (error) {
        console.error("Erreur lors de la suppression du hangar:", error);
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={materialId ? handleUpdateMaterial : handleAddMaterial}
        className="w-full"
      >
        <BasicInfo formData={formData} handleChange={handleChange} />
        <PriceAndQuantity formData={formData} handleChange={handleChange} />
        <DimensionsAndCondition
          formData={formData}
          handleChange={handleChange}
        />
        <Description formData={formData} handleChange={handleChange} />
        <Images formData={formData} handleChange={handleChange} />
        <Location formData={formData} handleChange={handleChange} />
        <div className="flex justify-center h-15">
          {baseMaterialId && (
            <button
              type="button"
              onClick={() => {
                closeEditpopUp();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded ml-4"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 ml-4 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1 text-center"
            disabled={uploading}
          >
            {materialId
              ? uploading
                ? "En cours..."
                : "Mettre à jour"
              : uploading
              ? "Création en cours..."
              : "Créer le Matériau"}
          </button>
          {materialId && (
            <button
              type="button"
              onClick={handleDeleteMaterial}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded ml-4"
            >
              Supprimer
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;
