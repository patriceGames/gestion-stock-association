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
import { getStorage, deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

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
};
