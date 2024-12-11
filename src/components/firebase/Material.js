import {
  deleteDoc,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";

import { db } from "./Base.js";
import { DeleteImage, UploadImages } from "./firebaseStorage.js";

//create

async function AddMaterial(user, formData, setFormData) {
  console.log("Ajout du matériau " + formData.name);
  try {
    const images = [
      formData.image1,
      formData.image2,
      formData.image3,
      formData.image4,
      formData.image5,
    ];
    const [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5] =
      await UploadImages(images);

    await addDoc(collection(db, "materials"), {
      name: formData.name,
      description: formData.description,
      dimensions: formData.dimensions,
      warning: formData.warning,
      quantity: formData.quantity,
      quantityAvailable: formData.quantity,
      condition: formData.condition,
      category: `${formData.category} | ${formData.subcategory}`,
      imageUrl1: imageUrl1,
      imageUrl2: imageUrl2,
      imageUrl3: imageUrl3,
      imageUrl4: imageUrl4,
      imageUrl5: imageUrl5,
      storageId: formData.selectedStorage,
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
      warning: "",
      dimensions: "",
      quantity: "",
      condition: "",
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      storageId: "",
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du matériau :", error);
  }
}

async function UpdateMaterial(formData, initialImages, materialId) {
  console.log("Edition du matériau " + formData.name);

  const imageKeys = ["image1", "image2", "image3", "image4", "image5"];
  const images = imageKeys.map((key) => formData[key]); // Tableau des images (null ou File)

  const [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5] =
    await UploadImages(images);

  // Comparaison des images pour supprimer les anciennes si elles sont remplacées
  const newImages = {
    imageUrl1,
    imageUrl2,
    imageUrl3,
    imageUrl4,
    imageUrl5,
  };
  
  try {
  Object.keys(initialImages).forEach((key) => {
    if (initialImages[key] && initialImages[key] !== newImages[key]) {
      DeleteImage(initialImages[key]); // Supprime l'ancienne image si elle a été remplacée
    }
  });
  }
  catch (error) {
    console.error("Erreur lors de la suppression des images :", error);
  }

  try {
    const materialRef = doc(db, "materials", materialId);
    await updateDoc(materialRef, {
      name: formData.name,
      description: formData.description,
      warning: formData.warning,
      dimensions: formData.dimensions,
      quantity: formData.quantity,
      condition: formData.condition,
      category: `${formData.category} | ${formData.subcategory}`,
      imageUrl1: imageUrl1,
      imageUrl2: imageUrl2,
      imageUrl3: imageUrl3,
      imageUrl4: imageUrl4,
      imageUrl5: imageUrl5,
      storageId: formData.selectedStorage,
      updatedAt: serverTimestamp(),
    });

    alert("Matériau mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du matériau :", error);
  }
}

async function UpdateMaterialProperty(formData, materialId) {
  try {
    const materialRef = doc(db, "materials", materialId);

    // Préparez l'objet pour la mise à jour en filtrant les valeurs non définies
    const updateData = {
      updatedAt: serverTimestamp(), // Ajoutez toujours un timestamp pour la mise à jour
    };

    // Ajoutez uniquement les champs présents dans formData
    
    if (formData.name !== undefined) updateData.name = formData.name;
    if (formData.description !== undefined) updateData.description = formData.description;
    if (formData.dimensions !== undefined) updateData.dimensions = formData.dimensions;
    if (formData.warning !== undefined) updateData.warning = formData.warning;
    if (formData.quantity !== undefined) updateData.quantity = formData.quantity;
    if (formData.quantityAvailable !== undefined) updateData.quantityAvailable = formData.quantityAvailable;
    if (formData.condition !== undefined) updateData.condition = formData.condition;
    if (formData.category !== undefined && formData.subcategory !== undefined) {
      updateData.category = `${formData.category} - ${formData.subcategory}`;
    }
    if (formData.selectedStorage !== undefined) updateData.storageId = formData.selectedStorage;
    if (formData.locationType === "text" && formData.location !== undefined) {
      updateData.location = formData.location;
    }

    // Mise à jour du document dans Firestore
    await updateDoc(materialRef, updateData);

    console.log("Matériau mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du matériau :", error);
  }
}

// Fonction pour récupérer un seul matériel par ID
async function GetMaterialById(id) {
  console.log("Lecture du matériau " + id);
  try {
    // Référence au document avec l'ID fourni dans la collection "materials"
    const docRef = doc(db, "materials", id);
    // Récupère le document
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Si le document existe, retourne ses données
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Si le document n'existe pas
      console.log("Aucun document trouvé avec cet ID");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du matériel :", error);
    return null;
  }
}

//update

//delete
// Fonction pour supprimer un matériau
async function DeleteMaterial(materialId) {
  try {
    const materialRef = doc(db, "materials", materialId);

    // Supprimer les images de Firebase Storage
    const imageUrls = [
      materialRef.imageUrl1,
      materialRef.imageUrl2,
      materialRef.imageUrl3,
      materialRef.imageUrl4,
      materialRef.imageUrl5,
    ];

    for (const imageUrl of imageUrls) {
      if (imageUrl) continue;
      DeleteImage(imageUrl);
    }
    await deleteDoc(materialRef);
    alert("Matériau supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du matériau :", error);
    alert("Erreur lors de la suppression du matériau.");
  }
}

//read


const getMaterial = async (materialId) => {
  console.log("Chargement des données du matériau " + materialId)
  if (materialId) {
    const materialRef = doc(db, "materials", materialId);
    const materialDoc = await getDoc(materialRef);
    if (materialDoc.exists()) {
      
      const materialData = {
        id: materialDoc.id,
        ...materialDoc.data(),
      };

      return materialData;
    }
  }
};

//Fonction pour lire la liste des matériaux

// Fonction pour récupérer les matériaux avec un tri défini et recherche par nom
const getMaterials = async ({
  storageId = null,
  userId = null,
  categoryFilter = "",
  subcategoryFilter = "",
  searchQuery = "", // Ajout du paramètre de recherche texte
  limitSize = null,
  lastVisible = null,
}) => {
  console.log("Lecture des matériaux ")
  // Base de la collection des matériaux
  const materialsRef = collection(db, "materials");
  let q = materialsRef;

  // Construction de la requête avec les filtres conditionnels
  if (storageId) {
    q = query(materialsRef, where("storageId", "==", storageId));
  }

  // Construction de la requête avec les filtres conditionnels
  if (userId) {
    q = query(q, where("userId", "==", userId));
  }

  if (categoryFilter) {
    if (subcategoryFilter) {
      // Filtrage par catégorie exacte et sous-catégorie si les deux sont présents
      q = query(
        q,
        where("category", "==", `${categoryFilter} - ${subcategoryFilter}`)
      );
    } else {
      // Filtrage par catégorie uniquement si aucune sous-catégorie n'est sélectionnée
      q = query(
        q,
        where("category", ">=", categoryFilter),
        where("category", "<=", categoryFilter + "\uf8ff")
      );
    }
  }

  // Si un terme de recherche est fourni, filtrer par nom du matériau
  if (searchQuery) {
    // Utilisation de '>=', '<=' et '\uf8ff' pour rechercher les documents qui commencent par le terme de recherche
    q = query(
      q,
      where("name", ">=", searchQuery),
      where("name", "<=", searchQuery + "\uf8ff")
    );
  }

  // Toujours trier par date de création
  q = query(q, orderBy("createdAt", "desc"));

  // Si une limite est définie (pour la pagination)
  if (limitSize) {
    q = query(q, limit(limitSize));
  }

  // Si on passe un lastVisible (pour paginer à partir du dernier doc visible)
  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  // Exécution de la requête
  const querySnapshot = await getDocs(q);

  // Si aucun document n'est trouvé, retourner des valeurs par défaut
  if (querySnapshot.empty) {
    return {
      data: [], // Pas de matériaux
      firstDoc: null,
      lastDoc: null,
    };
  }

  // Extraire les données des matériaux et retourner également les premiers/derniers documents
  const materials = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const firstVisibleDoc = querySnapshot.docs[0]; // Premier document visible
  const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; // Dernier document visible

  return {
    data: materials,
    firstDoc: firstVisibleDoc,
    lastDoc: lastVisibleDoc,
  };
};

export { AddMaterial, UpdateMaterial, getMaterial, getMaterials, GetMaterialById, DeleteMaterial, UpdateMaterialProperty};
