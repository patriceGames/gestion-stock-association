import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DeleteMaterial, getMaterial} from "./firebase";
import BasicInfo from "./MaterialForm/BasicInfo";
import PriceAndQuantity from "./MaterialForm/PriceAndQuantity";
import DimensionsAndCondition from "./MaterialForm/DimensionsAndCondition";
import Description from "./MaterialForm/Description";
import Images from "./MaterialForm/Images";
import Location from "./MaterialForm/Location";

import { AddMaterial, UpdateMaterial } from "./firebase/Material";

const MaterialForm = ({
  baseMaterialId,
  closeEditpopUp,
  currentUser,
  currentUserDetail,
  company,
}) => {
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
    const material = getMaterial(materialId);

    setInitialImages({
      imageUrl1: material.imageUrl1 || null,
      imageUrl2: material.imageUrl2 || null,
      imageUrl3: material.imageUrl3 || null,
      imageUrl4: material.imageUrl4 || null,
      imageUrl5: material.imageUrl5 || null,
    });

    const { cat, subcat } = splitCategory(material.category);
    setFormData({
      name: material.name,
      category: cat,
      subcategory: subcat,
      description: material.description,
      dimensions: material.dimensions,
      quantity: material.quantity,
      condition: material.condition,
      image1: material.imageUrl1 || null,
      image2: material.imageUrl2 || null,
      image3: material.imageUrl3 || null,
      image4: material.imageUrl4 || null,
      image5: material.imageUrl5 || null,
      locationType: material.storageId ? "dropdown" : "text",
      location: material.location || "",
      selectedStorage: material.storageId || "",
    });
  }, [materialId]);

  const validateForm = () => {
    const requiredFields = ["name", "category", "quantity"];
    return requiredFields.every((field) => formData[field]);
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    const user = currentUser;

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

    const user = currentUser;
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

  if (currentUserDetail?.role !== "admin")
    return (
      <p>Vous n'avez pas les droits necessaires pour modifier ce matériau</p>
    );

  return (
    currentUserDetail?.role === "admin" && (
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
          <Location
            formData={formData}
            handleChange={handleChange}
            currentUser={currentUser}
            company={company}
          />
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
    )
  );
};

export default MaterialForm;
