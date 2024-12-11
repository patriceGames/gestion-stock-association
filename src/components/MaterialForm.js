import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteMaterial, getMaterial } from "./firebase";
import BasicInfo from "./MaterialForm/BasicInfo";
import PriceAndQuantity from "./MaterialForm/PriceAndQuantity";
import DimensionsAndCondition from "./MaterialForm/DimensionsAndCondition";
import Description from "./MaterialForm/Description";
import Images from "./MaterialForm/Images";
import Location from "./MaterialForm/Location";

import { AddMaterial, UpdateMaterial } from "./firebase/Material";
import { UiButton, UiTitleSecondary } from "./UI/Ui";

const MaterialForm = ({
  baseMaterialId,
  closeEditpopUp,
  currentUser,
  company,
}) => {
  let { materialId } = useParams();
  const navigate = useNavigate(); // Initialiser useNavigate pour permettre la navigation

  if (baseMaterialId) materialId = baseMaterialId;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    warning: "",
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
  const [loading, setLoading] = useState(true);
  const [initialImages, setInitialImages] = useState({}); // stocker les URLs d'images originales pour les comparer

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const splitCategory = (category) => {
    const [cat, subcat] = (category || "").split(" | ");
    return { cat: cat || "", subcat: subcat || "" };
  };

  useEffect(() => {
    const LoadMaterial = async () => {
      console.log("lecture du matériau préchargé " + materialId);
      const material = await getMaterial(materialId);

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
        warning: material.warning || "",
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
    };

    if (materialId) LoadMaterial();
    setLoading(false);
  }, [materialId]);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.category &&
      formData.quantity &&
      formData.condition &&
      formData.selectedStorage
    ) {
      console.log("adding material");
      setUploading(true);
      AddMaterial(currentUser, formData, setFormData);
      setUploading(false);
    }
  };

  const handleUpdateMaterial = async (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.category &&
      formData.quantity &&
      formData.condition &&
      formData.selectedStorage
    ) {
      console.log(
        formData.name +
          formData.category +
          formData.quantity +
          formData.condition +
          formData.selectedStorage
      );
      if (materialId) {
        setUploading(true);
        UpdateMaterial(formData, initialImages, materialId);
        setUploading(false);
      }
      if (baseMaterialId) closeEditpopUp();
    }
  };

  const handleDeleteMaterial = async (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.category &&
      formData.quantity &&
      formData.condition &&
      formData.selectedStorage
    ) {
      if (materialId) {
        try {
          await DeleteMaterial(materialId); // Appel à la fonction deleteMaterial
          console.log("baseMaterialid : " + baseMaterialId);
          baseMaterialId ? closeEditpopUp() : navigate(`/`);
        } catch (error) {
          console.error("Erreur lors de la suppression du hangar:", error);
        }
      }
    }
  };

  if (currentUser?.role !== "admin")
    return (
      <UiTitleSecondary
        text={
          "Vous n'avez pas les droits necessaires pour modifier ce matériau"
        }
      />
    );

  if (loading) return <UiTitleSecondary text={"Chargement..."} />;

  return (
    currentUser?.role === "admin" && (
      <div>
        <form className="w-full">
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
            <UiButton
              text={
                materialId
                  ? uploading
                    ? "En cours..."
                    : "Mettre à jour"
                  : uploading
                  ? "Création en cours..."
                  : "Créer le Matériau"
              }
              action={
                materialId
                  ? (e) => {
                      handleUpdateMaterial(e);
                    }
                  : (e) => handleAddMaterial(e)
              }
              color={"blue"}
              enabled={uploading}
            />
            {materialId && (
              <UiButton
                text={"Supprimer"}
                action={(e) => handleDeleteMaterial(e)}
                color={"red"}
                enabled={uploading}
              />
            )}
          </div>
        </form>
      </div>
    )
  );
};

export default MaterialForm;
