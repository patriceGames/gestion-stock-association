import React, { useState, useEffect } from 'react';
import { db } from './firebase';  // Assure-toi que firebase.js est bien configuré

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les matériaux depuis Firestore
  useEffect(() => {
    const unsubscribe = db.collection('materials')
      .orderBy('createdAt', 'desc') // Trie par date de création
      .onSnapshot((snapshot) => {
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
            <li key={material.id} style={styles.materialItem}>
              <h2>{material.name}</h2>
              <p><strong>Description :</strong> {material.description}</p>
              <p><strong>Dimensions :</strong> {material.dimensions}</p>
              {material.imageUrl && (
                <div style={styles.imageContainer}>
                  <img src={material.imageUrl} alt={material.name} style={styles.image} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Styles basiques pour rendre la liste agréable à lire
const styles = {
  materialItem: {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
  },
  imageContainer: {
    marginTop: '10px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '5px',
  }
};

export default MaterialList;
