import '../styles/App.css';
import {useState, useEffect} from 'react';
import {onAuthStateChanged} from 'firebase/auth'; // Import Firebase Auth
import { auth, logout } from './firebase'; // Assure-toi que firebase.js est bien configuré
import SignUp from './SignUp';
import Login from './Login';
import MaterialForm from './MaterialForm';
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
      {
        !connected ? (
          <div>
            <SignUp />
            <br />
            <Login setConnected={setConnected} />
          </div>
        )
        :
        (
          <div>
            <MaterialForm />
            <MaterialList />
            <button onClick={logout}>Déconnexion</button>

          </div>
        )
      }
    </div>
  );
}

export default App;
