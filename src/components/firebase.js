import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { getStorage, deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { deleteDoc, doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCK4tKHZdzwwX9lAGpuvAcLc2-ztPEc_Pg",
  authDomain: "gestion-stock-association.firebaseapp.com",
  projectId: "gestion-stock-association",
  storageBucket: "gestion-stock-association.appspot.com",
  messagingSenderId: "927087402110",
  appId: "1:927087402110:web:00485443028970cb518c2f",
  measurementId: "G-094W32Q2V2",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// Fonction pour se connecter avec email et mot de passe
async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Vérifier si l'email a été vérifié
    if (user.emailVerified) {
      const userRef = doc(db, "users", user.uid); // Référence à l'utilisateur dans Firestore
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        // Ajouter l'utilisateur à la collection 'users' dans Firestore
        await setDoc(doc(db, "users", user.uid), {
          valid: false, // Initialiser à false pour attendre la vérification de l'email
          email: user.email,
          favorites: [], // Initialiser avec une liste de favoris vide
          //...userInfo, // Autres informations de l'utilisateur (nom, etc.)
        });
      }

      alert("Connexion réussie !");
      return user;
    } else {
      alert("Veuillez vérifier votre email avant de vous connecter.");
      throw new Error("Email non vérifié");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
}

// Fonction pour créer un compte avec email et mot de passe
async function signup(email, password, userInfo) {
  try {
    // Créer l'utilisateur avec email et mot de passe
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Envoyer l'email de vérification
    await sendEmailVerification(user);

    alert(
      "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte mail."
    );

    return user; // Retourne l'utilisateur créé
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error; // Gérer l'erreur ici
  }
}

// Fonction pour se déconnecter
async function logout() {
  try {
    await signOut(auth);
    alert("Déconnexion réussie !");
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    throw error;
  }
}

//create

// Fonction pour récupérer un seul matériel par ID
async function GetMaterialById(id) {
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
async function DeleteMaterial(material) {
  try {
    const materialRef = doc(db, "materials", material.id);
    await deleteDoc(materialRef);

    // Supprimer les images de Firebase Storage

    const imageUrls = [
      material.imageUrl1,
      material.imageUrl2,
      material.imageUrl3,
      material.imageUrl4,
      material.imageUrl5,
    ];

    const storage = getStorage();
    for (const imageUrl of imageUrls) {
      if (imageUrl !== "") continue;
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }

    alert("Matériau supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du matériau :", error);
    alert("Erreur lors de la suppression du matériau.");
  }
}




//read
//Fonction pour lire la liste des matériaux



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
    return '';
  }
};

// Fonction pour ajouter un entrepôt dans Firestore
export const addStorage = async (companyId, storageData) => {
  const storagesRef = collection(db, 'companies', companyId, 'storages');
  const newDoc = await addDoc(storagesRef, storageData);
  return newDoc.id;
};

// Fonction pour mettre à jour un entrepôt dans Firestore
export const updateStorage = async (companyId, storageId, updatedData) => {
  const storageDocRef = doc(db, 'companies', companyId, 'storages', storageId);
  await updateDoc(storageDocRef, updatedData);
};

// Fonction pour supprimer un entrepôt dans Firestore
export const deleteStorage = async (companyId, storageId) => {
  const storageDocRef = doc(db, 'companies', companyId, 'storages', storageId);
  await deleteDoc(storageDocRef);
};

// Fonction pour récupérer tous les entrepôts pour une entreprise
export const getStorages = async (companyId) => {
  const storagesRef = collection(db, 'companies', companyId, 'storages');
  const querySnapshot = await getDocs(storagesRef);
  const storages = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return storages;
};


/**
 * Ajoute ou retire un produit des favoris de l'utilisateur.
 *
 * @param {string} userId - L'ID de l'utilisateur actuel.
 * @param {string} materialId - L'ID du matériau à ajouter/retirer des favoris.
 * @param {boolean} currentFavoriteStatus - Le statut actuel du favori (true si déjà favori, false sinon).
 * @param {boolean} checkOnly - (Optionnel) Si true, vérifie seulement si le matériau est favori.
 * @returns {Promise<boolean>} - Renvoie le nouveau statut du favori.
 */
async function ToggleFavorite(userId, materialId, currentFavoriteStatus, checkOnly = false) {
  if (!userId || !materialId) {
    throw new Error("User ID and Material ID are required.");
  }

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      let updatedFavorites = userData.favorites || [];

      if (checkOnly) {
        // Just return whether the material is favorited
        return updatedFavorites.includes(materialId);
      }

      let updatedIsFavorited;
      if (currentFavoriteStatus) {
        // Remove from favorites
        updatedFavorites = updatedFavorites.filter(fav => fav !== materialId);
        updatedIsFavorited = false;
      } else {
        // Add to favorites
        updatedFavorites.push(materialId);
        updatedIsFavorited = true;
      }

      // Update Firestore with the new favorites list
      await updateDoc(userRef, { favorites: updatedFavorites });

      return updatedIsFavorited;
    } else {
      throw new Error("User document does not exist.");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des favoris :", error);
    throw error;
  }
}



export {
  app,
  db,
  auth,
  storage,
  analytics,
  login,
  signup,
  logout,
  DeleteMaterial,
  GetMaterialById,
  ToggleFavorite,
  uploadImage,
};
