import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {auth, db} from "./Base.js"

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
  
        const roleRef = doc(db, "roles", user.uid); // Référence à l'utilisateur dans Firestore
        const roleDoc = await getDoc(roleRef);
        //vérifie que l'email a bien été validé par les administrateurs
        if(roleDoc.exists() && roleDoc.role !== "none")
        {
          console.log("Connexion réussie !");
          return user;
        }
        else {
          alert("Votre compte n'a pas encore été validé par les administrateurs, veuillez les contacter.");
          throw new Error("Email non validé");
        }
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

export {login, signup, logout}