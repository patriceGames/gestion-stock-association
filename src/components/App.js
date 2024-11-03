import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MaterialDetail from './MaterialDetail'; // Page des détails d'un produit
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import { auth } from './firebase'; // Assure-toi que firebase.js est bien configuré
import MaterialList from './MaterialList';
import Header from './header';
import SideBar from './sideBar';
import CompanyDetail from './CompanyDetail';
import StorageDetail from './StorageDetail';
import MaterialFormContainer from './MaterialFormContainer';
import Login from './Login';

function App() {
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
        setConnected(true);
      } else {
        setConnected(false);
      }
      setLoading(false); // Fin du chargement
    });

    // Nettoyage de l'écouteur à la fermeture du composant
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
      {connected && (
            <>
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
        <Header toggleSidebar={toggleSidebar} loginLoading={loading} />
          </>)}

        {/* Gestion des routes */}
        <Routes>
          {connected ? (
            <>
              {/* Routes pour les utilisateurs connectés */}
              <Route path="/" element={<MaterialList />} />
              <Route path="/materials" element={<MaterialList/>} />
              <Route path="/product/:id" element={<MaterialDetail/>} />
              <Route path="/product/:materialId/edit" element={<MaterialFormContainer/>} />
              <Route path="/product/add" element={<MaterialFormContainer/>} />
              <Route path="/company/:id" element={<CompanyDetail/>} />
              <Route path="/company/:companyId/storage/:storageId" element={<StorageDetail />} />
              <Route path="/company/:companyId/storage/:storageId/product/:id" element={<MaterialFormContainer/>} />
              <Route path="/company/:companyId/storage/:storageId/product/:materialId/edit" element={<MaterialFormContainer />} />
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
