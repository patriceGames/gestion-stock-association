import { logout, auth, db } from "./firebase";
import { useEffect, useState } from "react";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";

function UserPanel({ connected, setConnected, toggleSidebar}) {
  const [companyId, setCompanyId] = useState(null);
  const user = auth.currentUser; // Récupérer l'utilisateur connecté

  useEffect(() => {
    if (user) {
      // Récupérer les informations de l'utilisateur depuis la collection "users"
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            // recherche du lien de la société
            const usersCollectionRef = collection(db, 'companies');
            const companies = await getDocs(usersCollectionRef);
          
            if (!usersCollectionRef.empty) {
              setCompanyId(companies.docs[0].id)
            }
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur :",
            error
          );
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleCompanyClick = () => {
    if (companyId) {
      // Rediriger vers la page de l'entreprise
      window.location.href = `/company/${companyId}`;
    }
  };

  const handleLogout = () => {
    logout();
    toggleSidebar();
  }

  return (
    <div>
      <div>
        {companyId && (
          <div>
            <br />
            <button onClick={handleCompanyClick} className="">
              Accéder à la page de l'entreprise
            </button>
          </div>
        )}

        <br />
        <button onClick={handleLogout} className="">
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default UserPanel;
