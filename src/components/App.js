import '../styles/App.css';
import {useState, useEffect} from 'react';
import {onAuthStateChanged} from 'firebase/auth'; // Import Firebase Auth
import { auth } from './firebase'; // Assure-toi que firebase.js est bien configuré
import UserPanel from './UserPanel';
import MaterialList from './MaterialList';

function App() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true); // Pour afficher un indicateur de chargement

  // Vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setConnected(true);
      } else {
        setConnected(false);
      }
      setLoading(false); // Fin du chargement
    });

    // Nettoyage de l'écouteur à la fermeture du composant
    return () => unsubscribe();
  }, []);

  // Pendant le chargement, affiche un indicateur de chargement
  if (loading) {
    return <h2>Chargement...</h2>;
  }

  return (
    <div className="App">
      <UserPanel connected={connected} setConnected={setConnected} />
      <div>
        <MaterialList />
      </div>
    </div>
  );
}

export default App;
