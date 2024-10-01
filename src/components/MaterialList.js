import React, { useState, useEffect } from 'react';
import { db, DeleteMaterial } from './firebase';  // Assure-toi que firebase.js est bien configuré
import { collection, query, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import MaterialListItem from './MaterialListItem';

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      const storedMaterials = localStorage.getItem('materials');
      if (storedMaterials) {
        setMaterials(JSON.parse(storedMaterials));
        setLoading(false);
      } else {
        let q = query(collection(db, 'materials'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const materialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMaterials(materialsData);
        localStorage.setItem('materials', JSON.stringify(materialsData));
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return <h2>Chargement des matériaux...</h2>;
  }

  return (
    <div>
      {materials.length === 0 ? (
        <p>Aucun matériau disponible pour le moment.</p>
      ) : (
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {materials.map((material) => (
            <MaterialListItem key={material.id} material={material} DeleteMaterial={DeleteMaterial} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaterialList;
