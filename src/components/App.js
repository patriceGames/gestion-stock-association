import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MaterialDetail from './MaterialDetail'; // Page des détails d'un produit
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import { db, auth } from './firebase'; // Assure-toi que firebase.js est bien configuré
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import MaterialList from './MaterialList';
import Header from './header';
import SideBar from './sideBar';
import CompanyDetail from './CompanyDetail';
import StorageDetail from './StorageDetail';
import MaterialFormContainer from './MaterialFormContainer';
import Login from './Login';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [company, setCompany] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true); // Pour afficher un indicateur de chargement
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setCurrentUser(user);
        setConnected(true);
      } else {
        setConnected(false);
      }
      setLoading(false); // Fin du chargement
    });

    // Nettoyage de l'écouteur à la fermeture du composant
    return () => unsubscribe();
  }, []);

  //récupère les informations de l'utilisateur
  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!currentUser) {
        // Pas d'utilisateur connecté, ne pas lancer la récupération
        return;
      }
      try {
        const userDetailRef = doc(db, 'roles', currentUser.uid);
        const userDetailSnapshot = await getDoc(userDetailRef);
        if (userDetailSnapshot.exists()) {
          setCurrentUserDetail(userDetailSnapshot.data());
        } else {
          console.warn('User details not found.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      }
    };
  
    fetchUserDetail();
  }, [currentUser]);

  //Récupère les informations de l'entreprise
  useEffect(() => {
    if (currentUser) {
      // Récupérer les informations de l'utilisateur depuis la collection "users"
      const fetchUserData = async () => {
        try {
          if (currentUser) {
            // recherche du lien de la société
            const usersCollectionRef = collection(db, "companies");
            const companies = await getDocs(usersCollectionRef);
            if (!usersCollectionRef.empty) {
              setCompany(companies.docs[0]);
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
  }, [currentUser]);


  return (
    <Router>
      <div className="App">
      {connected && (
            <>
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} currentUser={currentUser} company={company} />
        <Header toggleSidebar={toggleSidebar} loginLoading={loading} />
          </>)}

        {/* Gestion des routes */}
        <Routes>
          {connected ? (
            <>
              {/* Routes pour les utilisateurs connectés */}
              <Route path="/" element={<MaterialList />} />
              <Route path="/materials" element={<MaterialList/>} />
              <Route path="/product/:id" element={<MaterialDetail currentUser={currentUser}/>} />
              <Route path="/product/:materialId/edit" element={<MaterialFormContainer currentUser={currentUser} company={company} currentUserDetail={currentUserDetail}/>} />
              <Route path="/product/add" element={<MaterialFormContainer currentUserDetail={currentUserDetail}/>} />
              <Route path="/company/:id" element={<CompanyDetail currentUser={currentUser} company={company} currentUserDetail={currentUserDetail}/> } />
              <Route path="/company/:companyId/storage/:storageId" element={<StorageDetail currentUser={currentUser} company={company} currentUserDetail={currentUserDetail}/>} />
              <Route path="/company/:companyId/storage/:storageId/product/:id" element={<MaterialDetail currentUser={currentUser} company={company} currentUserDetail={currentUserDetail}/>} />
              <Route path="/company/:companyId/storage/:storageId/product/:materialId/edit" element={<MaterialFormContainer currentUser={currentUser} company={company} currentUserDetail={currentUserDetail}/>} />
            </>
          ) : (
            <Route path="*" element={<Login connected={connected} setConnected={setConnected}/>} />
          )}
          {/* Route de secours pour les pages non trouvées */}
          <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
