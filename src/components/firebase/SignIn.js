import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updatePassword
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./Base.js";

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
          email: user.email,
          favorites: [], // Initialiser avec une liste de favoris vide
          //...userInfo, // Autres informations de l'utilisateur (nom, etc.)
        });
      }

      // Vérification du rôle dans la collection "roles"
      const roleDocRef = doc(db, "roles", user.email); // Utiliser l'email comme ID
      const roleDoc = await getDoc(roleDocRef);

      if (roleDoc.exists()) {
        const roleData = roleDoc.data();
        if (roleData.role && roleData.role !== "none") {
          console.log("Connexion réussie !");
          return user;
        }
      }

      alert(
        "Votre compte n'a pas encore été validé par les administrateurs, veuillez les contacter."
      );
      throw new Error("Aucune autorisation donnée à cet Email");
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

/**
 * Met à jour le mot de passe utilisateur dans Firebase Authentication.
 *
 * @param {Object} user - L'utilisateur Firebase.
 * @param {string} newPassword - Le nouveau mot de passe.
 * @returns {Promise<void>}
 */
  const UpdateUserPassword = async (user, newPassword) => {
  if (!user || !newPassword) {
    throw new Error("User and new password are required.");
  }

  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    throw error;
  }
};

export { login, signup, logout, UpdateUserPassword };
