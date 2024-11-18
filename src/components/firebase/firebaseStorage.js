import {
    getStorage,
    deleteObject,
    ref,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";
  
  import {storage} from "./Base.js";

// Fonction pour uploader l'image sur Firebase Storage
const uploadImage = async (file) => {
    try {
      const storage = getStorage(); // Initialisation du service de stockage
  
      // Crée une référence dans le dossier 'images' avec le nom de fichier
      const uniqueName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `images/${uniqueName}`);
  
      // Upload du fichier sur Firebase Storage
      await uploadBytes(storageRef, file);
  
      // Récupère l'URL de téléchargement de l'image après l'upload
      const downloadURL = await getDownloadURL(storageRef);
  
      return downloadURL;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
      return "";
    }
  };

  async function UploadImages(images) {
    return await Promise.all(
      images.map((image) =>
        image instanceof File ? uploadImage(image) : image || ""
      )
    );
  }

  // Fonction pour supprimer une image dans Firebase Storage
  async function DeleteImage(imageUrl) {
    if (!imageUrl) return;

    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.log("Image supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
    }
  }

export {uploadImage, DeleteImage, UploadImages}