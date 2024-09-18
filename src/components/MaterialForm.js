import React, { useState } from 'react';
import { db, auth } from './firebase.js';  // Assure-toi que firebase.js est configuré correctement
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Nouvelles fonctions à importer


const MaterialForm = () => {
  // États pour stocker les données du formulaire
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fonction pour uploader l'image sur Firebase Storage
  const uploadImage = async (file) => {
    const storage = getStorage(); // Initialisation du service de stockage
    const storageRef = ref(storage, file.name); // Référence de fichier basée sur son nom
    // Upload le fichier sur Firebase Storage
    await uploadBytes(storageRef, file);
    // Retourne l'URL de téléchargement de l'image une fois l'upload terminé
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  // Fonction pour ajouter un matériau dans Firestore
  const addMaterial = async (e) => {
    const user = auth.currentUser; // Récupérer l'utilisateur connecté
    if(user)
    {
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

        try {
            // Ajoute le document dans Firestore
            await addDoc(collection(db, 'materials'), {
            name,
            description,
            dimensions,
            imageUrl, // URL de l'image téléchargée
            createdAt: serverTimestamp(), // Date actuelle générée par Firestore
            userId: user.uid // Associer l'utilisateur au matériau
            });
        
            alert('Matériau ajouté avec succès !');
            setName(''); // Réinitialise le formulaire
            setDescription('');
            setDimensions('');
            setImage(null);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du matériau :', error);
        } finally {
            setUploading(false);
        }
    }
    else {
        alert("Vous devez être connecté pour ajouter un matériau");
    }

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
