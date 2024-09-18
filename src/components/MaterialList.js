import React, { useState, useEffect } from 'react';
import { db, DeleteMaterial } from './firebase';  // Assure-toi que firebase.js est bien configuré
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import MaterialListItem from './MaterialListItem';


const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

    // Fonction pour récupérer les matériaux depuis Firestore
    useEffect(() => {
        let q = query(collection(db, 'materials'), orderBy('createdAt', 'desc')); // Crée la requête avec tri par date
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const materialsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
                }));
            setMaterials(materialsData);
            setLoading(false);
        });

        // Nettoyage de l'abonnement lors de la fermeture du composant
        return () => unsubscribe();
    }, []);

    
  if (loading) {
    return <h2>Chargement des matériaux...</h2>;
  }
  return (
    <div>
      <h1>Liste des Matériaux</h1>
      {materials.length === 0 ? (
        <p>Aucun matériau disponible pour le moment.</p>
      ) : (
        <ul>
          {materials.map((material) => (
            MaterialListItem({ material, DeleteMaterial })
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaterialList;
