import React, { useState } from 'react';
import { db } from './firebase';  // Assure-toi que firebase.js est configuré correctement
import firebase from 'firebase/app';
import 'firebase/storage'; // Pour l'upload d'images

const MaterialForm = () => {
  // États pour stocker les données du formulaire
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fonction pour uploader l'image sur Firebase Storage
  const uploadImage = async (file) => {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file); // Upload le fichier sur Firebase
    return await fileRef.getDownloadURL(); // Retourne l'URL de téléchargement de l'image
  };

  // Fonction pour ajouter un matériau dans Firestore
  const addMaterial = async (e) => {
    e.preventDefault(); // Empêche le rafraîchissement de la page
    setUploading(true);

    // Si une image est sélectionnée, on la télécharge
    let imageUrl = '';
    if (image) {
      try {
        imageUrl = await uploadImage(image);
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image :', error);
      }
    }

    // Ajout des données du matériau dans Firestore
    db.collection('materials').add({
      name,
      description,
      dimensions,
      imageUrl, // URL de l'image téléchargée
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Date actuelle
    })
    .then(() => {
      alert('Matériau ajouté avec succès !');
      setName(''); // Réinitialise le formulaire
      setDescription('');
      setDimensions('');
      setImage(null);
    })
    .catch((error) => {
      console.error('Erreur lors de l\'ajout du matériau :', error);
    })
    .finally(() => {
      setUploading(false);
    });
  };

  return (
    <form onSubmit={addMaterial}>
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
        <label htmlFor="image">Image du Matériau :</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <button type="submit" disabled={uploading}>
        {uploading ? 'Ajout en cours...' : 'Ajouter le Matériau'}
      </button>
    </form>
  );
};

export default MaterialForm;
