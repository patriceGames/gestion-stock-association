import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MaterialDetail from './MaterialDetail'; // Page des détails d'un produit
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import { auth } from './firebase'; // Assure-toi que firebase.js est bien configuré
import UserPanel from './UserPanel';
import MaterialList from './MaterialList';
import Header from './header';
import SideBar from './sideBar';

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

  // Contenu de la barre latérale
  const sidebarContent = (
    <div>
      <UserPanel connected={connected} setConnected={setConnected} />
    </div>
  );

  return (
    <Router>
      <div className="App">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} content={sidebarContent} />
        <Header toggleSidebar={toggleSidebar} connected={connected} loginLoading={loading} />
        
        {/* Gestion des routes ici */}
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<MaterialList connected={connected}/>} />
          {/* Route dynamique pour la page de détail d'un produit */}
          <Route path="/product/:id" element={<MaterialDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
