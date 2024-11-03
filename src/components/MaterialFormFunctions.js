import { db, uploadImage, DeleteImage } from "./firebase";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

async function UploadImages(formData) {
  const images = [
    formData.image1,
    formData.image2,
    formData.image3,
    formData.image4,
    formData.image5,
  ];
  return await Promise.all(
    images.map((image) =>
      image instanceof File ? uploadImage(image) : image || ""
    )
  );
}

async function AddMaterial(user, formData, setFormData) {
  try {
    const [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5] =
      await UploadImages(formData);

    await addDoc(collection(db, "materials"), {
      name: formData.name,
      description: formData.description,
      dimensions: formData.dimensions,
      quantity: formData.quantity,
      condition: formData.condition,
      category: `${formData.category} - ${formData.subcategory}`,
      imageUrl1: imageUrl1,
      imageUrl2: imageUrl2,
      imageUrl3: imageUrl3,
      imageUrl4: imageUrl4,
      imageUrl5: imageUrl5,
      storageId:
        formData.locationType === "dropdown" ? formData.selectedStorage : null,
      location: formData.locationType === "text" ? formData.location : null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      userId: user.uid,
    });

    alert("Matériau ajouté avec succès !");
    setFormData({
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
  } catch (error) {
    console.error("Erreur lors de l'ajout du matériau :", error);
  }
}

async function UpdateMaterial(user, formData, initialImages, materialId) {
  const [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5] =
    await UploadImages(formData);

  // Comparaison des images pour supprimer les anciennes si elles sont remplacées
  const newImages = {
    imageUrl1,
    imageUrl2,
    imageUrl3,
    imageUrl4,
    imageUrl5,
  };
  Object.keys(initialImages).forEach((key) => {
    if (initialImages[key] && initialImages[key] !== newImages[key]) {
      DeleteImage(initialImages[key]); // Supprime l'ancienne image si elle a été remplacée
    }
  });

  try {
    const materialRef = doc(db, "materials", materialId);
    await updateDoc(materialRef, {
      name: formData.name,
      description: formData.description,
      dimensions: formData.dimensions,
      quantity: formData.quantity,
      condition: formData.condition,
      category: `${formData.category} - ${formData.subcategory}`,
      imageUrl1: imageUrl1,
      imageUrl2: imageUrl2,
      imageUrl3: imageUrl3,
      imageUrl4: imageUrl4,
      imageUrl5: imageUrl5,
      storageId:
        formData.locationType === "dropdown" ? formData.selectedStorage : null,
      location: formData.locationType === "text" ? formData.location : null,
      updatedAt: serverTimestamp(),
      userId: user.uid,
    });

    alert("Matériau mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du matériau :", error);
  } 
}

export {UpdateMaterial, AddMaterial, UploadImages}