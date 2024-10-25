import Login from './Login';
import { logout, auth, db } from './firebase';
import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';

function UserPanel({ connected, setConnected }) {
  const [companyId, setCompanyId] = useState(null);
  const user = auth.currentUser; // Récupérer l'utilisateur connecté

  useEffect(() => {
    if (user) {
      // Récupérer les informations de l'utilisateur depuis la collection "users"
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.companyId) {
              setCompanyId(userData.companyId);
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données de l'utilisateur :", error);
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

  return (
    <div>
      {!connected ? (
        <div>
          <br />
          <Login setConnected={setConnected} />
        </div>
      ) : (
        <div>
          <br />
          <button onClick={logout} className=''>Déconnexion</button>
          {companyId && (
            <div>
              <br />
              <button onClick={handleCompanyClick} className=''>Accéder à la page de l'entreprise</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserPanel;
