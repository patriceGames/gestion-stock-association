import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaterialDetail from "./MaterialDetail"; // Page des détails d'un produit
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth
import {
  auth,
  GetUserData,
  GetCompanyData,
  GetUserReservations,
  GetUserAlarms,
} from "./firebase"; // Assure-toi que firebase.js est bien configuré
import MaterialList from "./MaterialList";
import Header from "./header";
import SideBar from "./RightSideBar";
import StorageDetail from "./StorageDetail";
import MaterialFormContainer from "./MaterialFormContainer";
import Login from "./Login";
import Profile from "./UserComponents/Profile";
import Reservations from "./UserComponents/Reservations";
import Favorites from "./UserComponents/Favorites";
import ReservationManagement from "./ReservationsManagement";
import StorageManagement from "./StorageManagement";
import EmployeeManagement from "./EmployeeManagement";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true); // Pour afficher un indicateur de chargement
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [hasAlarms, setHasAlarms] = useState(false);
  const [alarms, setAlarms] = useState({
    userAlarms: 0, // Alarmes utilisateur
    profileAlarms: 0, // Alarmes profile
    adminAlarms: 0, // Alarmes administration (seulement pour admin)
  });

  console.log("Render App");

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const fetchData = async () => {
        if (user && user.emailVerified) {
          try {
            console.info(
              "Utilisateur authentifié. Début de la récupération des données..."
            );

            // Charger les données utilisateur
            const userDetails = await GetUserData(user);

            // Charger les données d'entreprise
            const companyDetails = await GetCompanyData();

            console.log(userDetails);
            setCurrentUser(userDetails);
            setCompany(companyDetails);
            setConnected(true);
          } catch (error) {
            console.error(
              "Erreur lors de la récupération des données :",
              error
            );
          }
        } else {
          console.info("Aucun utilisateur authentifié ou email non vérifié.");
          setConnected(false);
        }
        setLoading(false); // Fin du chargement général
      };

      fetchData();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Ne pas exécuter tant que currentUser n'est pas défini
    if (!currentUser) return;

    const fetchReservations = async () => {
      try {
        const resa = await GetUserReservations(currentUser);
        setReservations(resa);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
      }
    };

    fetchReservations();
  }, [currentUser]);

  useEffect(() => {
    // Ne pas exécuter tant que currentUser n'est pas défini
    if (!currentUser || !reservations) return;

    const fetchAlarms = () => {
        // Vérification de la présence d'alarmes
        const alarmData = GetUserAlarms(currentUser, reservations);
        setAlarms(alarmData);
        setHasAlarms(Object.values(alarmData).some((count) => count > 0));
    };

    fetchAlarms();
  }, [currentUser, reservations]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Router>
      <div className="App">
        {connected && (
          <>
            <SideBar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              currentUser={currentUser}
              company={company}
              alarms={alarms}
            />
            <Header
              toggleSidebar={toggleSidebar}
              loginLoading={loading}
              hasAlarms={hasAlarms}
            />
          </>
        )}
        {/* Gestion des routes */}
        <Routes>
          {connected ? (
            <>
              {/* Routes pour les utilisateurs connectés */}
              <Route
                path="/"
                element={<MaterialList currentUser={currentUser} />}
              />
              <Route
                path="/materials"
                element={<MaterialList currentUser={currentUser} />}
              />
              <Route
                path="/material/:materialId"
                element={<MaterialDetail currentUser={currentUser} />}
              />
              <Route
                path="/material/:materialId/edit"
                element={
                  <MaterialFormContainer
                    currentUser={currentUser}
                    company={company}
                  />
                }
              />
              <Route
                path="/material/add"
                element={<MaterialFormContainer currentUser={currentUser} />}
              />
              <Route
                path="/user/:userId"
                element={
                  <Profile currentUser={currentUser} company={company} />
                }
              />
              <Route
                path="/user/:userId/Reservations"
                element={
                  <Reservations
                    currentUser={currentUser}
                    company={company}
                    reservations={reservations}
                    setReservations={setReservations}
                  />
                }
              />
              <Route
                path="/user/:userId/Favorites"
                element={
                  <Favorites currentUser={currentUser} company={company} />
                }
              />
              <Route
                path="/user/:userId/material/:materialId"
                element={
                  <MaterialDetail currentUser={currentUser} company={company} />
                }
              />
              <Route
                path="/user/:userId/material/:materialId/edit"
                element={
                  <MaterialFormContainer
                    currentUser={currentUser}
                    company={company}
                  />
                }
              />
              <Route
                path="/company/:id/storage"
                element={
                  <StorageManagement currentUser={currentUser} company={company} />
                }
              />
              <Route
                path="/company/:id/roles"
                element={
                  <EmployeeManagement currentUser={currentUser}/>
                }
              />
              <Route
                path="/company/:id/reservations"
                element={
                  <ReservationManagement
                    currentUser={currentUser}
                    company={company}
                    reservations={reservations}
                    setReservations={setReservations}
                  />
                }
              />
              <Route
                path="/company/:companyId/storage/:storageId"
                element={
                  <StorageDetail currentUser={currentUser} company={company} />
                }
              />
              <Route
                path="/company/:companyId/storage/:storageId/material/:materialId"
                element={
                  <MaterialDetail currentUser={currentUser} company={company} />
                }
              />
              <Route
                path="/company/:companyId/storage/:storageId/material/:materialId/edit"
                element={
                  <MaterialFormContainer
                    currentUser={currentUser}
                    company={company}
                  />
                }
              />
            </>
          ) : (
            <Route
              path="*"
              element={
                <Login connected={connected} setConnected={setConnected} />
              }
            />
          )}
          {/* Route de secours pour les pages non trouvées */}
          <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
