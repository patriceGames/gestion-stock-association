import React, { useState, useEffect } from 'react';
import { db } from './firebase';  // Assure-toi que firebase.js est bien configuré
import firebase from 'firebase/app';
import 'firebase/storage'; // Pour gérer les images

const MaterialEdit = ({ match, history }) => {
  const materialId = match.params.id; // Récupère l'ID du matériau depuis les paramètres de l'URL
  const [material, setMaterial] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Récupérer les données actuelles du matériau depuis Firestore
  useEffect(() => {
    const fetchMaterial = async () => {
      const doc = await db.collection('materials').doc(materialId).get();
      if (doc.exists) {
        const materialData = doc.data();
        setMaterial(materialData);
        setName(materialData.name);
        setDescription(materialData.description);
        setDimensions(materialData.dimensions);
        setImageUrl(materialData.imageUrl);
      }
    };

    fetchMaterial();
  }, [materialId]);

  // Fonction pour uploader une nouvelle image si elle est modifiée
  const uploadImage = async (file) => {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
  };

  // Fonction pour mettre à jour le matériau
  const updateMaterial = async (e) => {
    e.preventDefault();
    setUploading(true);

    let newImageUrl = imageUrl;

    // Si une nouvelle image est sélectionnée, on l'upload
    if (image) {
      newImageUrl = await uploadImage(image);
    }

    // Mise à jour des données du matériau dans Firestore
    db.collection('materials').doc(materialId).update({
      name,
      description,
      dimensions,
      imageUrl: newImageUrl,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      alert('Matériau mis à jour avec succès !');
      history.push('/'); // Redirection après la mise à jour
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour du matériau :', error);
    })
    .finally(() => {
      setUploading(false);
    });
  };

  // Fonction pour supprimer le matériau
  const deleteMaterial = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériau ?')) {
      await db.collection('materials').doc(materialId).delete();
      alert('Matériau supprimé avec succès !');
      history.push('/'); // Redirection après suppression
    }
  };

  // Affichage d'un formulaire de chargement pendant la récupération des données
  if (!material) {
    return <h2>Chargement des informations du matériau...</h2>;
  }

  return (
    <div>
      <h1>Modifier le Matériau</h1>
      <form onSubmit={updateMaterial}>
        <div>
          <label htmlFor="name">Nom du Matériau :</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="dimensions">Dimensions :</label>
          <input
            type="text"
            id="dimensions"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="image">Modifier l'image du Matériau :</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {imageUrl && (
            <div style={styles.imageContainer}>
              <img src={imageUrl} alt={name} style={styles.image} />
            </div>
          )}
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Mise à jour en cours...' : 'Mettre à jour le Matériau'}
        </button>
      </form>

      <button onClick={deleteMaterial} style={styles.deleteButton}>
        Supprimer le Matériau
      </button>
    </div>
  );
};

// Styles basiques
const styles = {
  imageContainer: {
    marginTop: '10px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '5px',
  },
  deleteButton: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default MaterialEdit;
