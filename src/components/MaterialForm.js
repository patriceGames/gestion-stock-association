import React, { useState } from 'react';
import { db, auth } from './firebase.js';  // Assure-toi que firebase.js est configuré correctement
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Nouvelles fonctions à importer
import MaterialFormImageLoader from './MaterialFormImageLoader.js';
import Categories from './Categories.js';


const MaterialForm = () => {
  // États pour stocker les données du formulaire
  const [name, setName] = useState('');
  const [category, setCategory] = useState(''); // Nouvel état pour la catégorie
  const [subcategory, setSubcategory] = useState(''); // État pour la sous-catégorie
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fonction pour uploader l'image sur Firebase Storage
  const uploadImage = async (file) => {
    try {
      const storage = getStorage(); // Initialisation du service de stockage
  
      // Crée une référence dans le dossier 'images' avec le nom de fichier
      const uniqueName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `images/${uniqueName}`);
      
      // Upload du fichier sur Firebase Storage
      await uploadBytes(storageRef, file);
  
      // Récupère l'URL de téléchargement de l'image après l'upload
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
      return '';
    }
  };

  // Fonction pour ajouter un matériau dans Firestore
  const addMaterial = async (e) => {
    const user = auth.currentUser; // Récupérer l'utilisateur connecté
    if(user)
    {
        e.preventDefault(); // Empêche le rafraîchissement de la page
        setUploading(true);

        // Si une image est sélectionnée, on la télécharge
        let imageUrl1 = image1 ? await uploadImage(image1) : '';
        let imageUrl2 = image2 ? await uploadImage(image2) : '';
        let imageUrl3 = image3 ? await uploadImage(image3) : '';
        let imageUrl4 = image4 ? await uploadImage(image4) : '';
        let imageUrl5 = image5 ? await uploadImage(image5) : '';

        try {
            // Ajoute le document dans Firestore
            await addDoc(collection(db, 'materials'), {
            name,
            category: `${category} - ${subcategory}`, // Combiner catégorie et sous-catégorie
            description,
            price,
            dimensions,
            imageUrl1, // URL de l'image téléchargée
            imageUrl2, // URL de l'image téléchargée
            imageUrl3, // URL de l'image téléchargée
            imageUrl4, // URL de l'image téléchargée
            imageUrl5, // URL de l'image téléchargée
            createdAt: serverTimestamp(), // Date actuelle générée par Firestore
            userId: user.uid // Associer l'utilisateur au matériau
            });
        
            alert('Matériau ajouté avec succès !');
            
            // Réinitialise le formulaire
            setName(''); 
            setCategory('');
            setDescription('');
            setPrice(0)
            setDimensions('');
            setImage1(null);
            setImage2(null);
            setImage3(null);
            setImage4(null);
            setImage5(null);

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
    <form onSubmit={addMaterial}className='w-full'>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          name="floating_name"
          id="floating_name"
          className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label
          htmlFor="floating_name"
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Nom du Matériau
        </label>
      </div>
      {/* Dropdown pour sélectionner un groupe de catégorie */}
      <div className="relative z-0 mb-6 w-full group">
        <select
          type="text"
          name="floating_category"
          id="floating_category"
          className="block pl-2 py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory("");
          }}
        >
          <option value="">
          </option>
          {Categories.map((catGroup) => (
            <option key={catGroup.group} value={catGroup.group}>
              {catGroup.group}
            </option>
          ))}
        </select>
        <label
          htmlFor="floating_category"
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Catégorie
        </label>
      </div>
      {/* Dropdown pour sélectionner une sous-catégorie */}
      {category && (
        <div className="relative z-0 mb-6 w-full group">
          <select
            type="text"
            name="floating_subcategory"
            id="floating_subcategory"
            className="block pl-2 py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value=""></option>
            {Categories
              .find((catGroup) => catGroup.group === category)
              .subcategories.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
            ))}
          </select>
          <label
            htmlFor="floating_subcategory"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Sous-Catégorie
          </label>
        </div>
      )}
      <div className="relative z-0 mb-6 w-full group">
        <input
          name="floating_price"
          id="floating_price"
          className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder=""
        />
        <label
          htmlFor="floating_price"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Prix
        </label>
      </div>
      <div className="relative z-0 mb-6 w-full group">
        <textarea
          name="floating_description"
          id="floating_description"
          className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label
          htmlFor="floating_description"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Description
        </label>
      </div>
      <div className="relative z-0 mb-6 w-full group">
        <input
          type="text"
          name="floating_dimensions"
          id="floating_dimensions"
          className="block py-2.5 px-0 w-full text-sm text-white-300 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          required
        />
        <label
          htmlFor="floating_dimensions"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Dimensions
        </label>
      </div>
      <ul className="my-4 grid gap-6 grid-cols-2 mt-6">
        <div>
          <MaterialFormImageLoader
            inputId="imageDownloader1"
            image={image1}
            setImage={setImage1}
          />
        </div>
        <div>
          <MaterialFormImageLoader
            inputId="imageDownloader2"
            image={image2}
            setImage={setImage2}
          />
        </div>
        <div>
          <MaterialFormImageLoader
            inputId="imageDownloader3"
            image={image3}
            setImage={setImage3}
          />
        </div>
        <div>
          <MaterialFormImageLoader
            inputId="imageDownloader4"
            image={image4}
            setImage={setImage4}
          />
        </div>
        <div>
          <MaterialFormImageLoader
            inputId="imageDownloader5"
            image={image5}
            setImage={setImage5}
          />
        </div>
      </ul>
      <div className='flex justify-end'>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={uploading}
        >
          {uploading ? "Ajout en cours..." : "Ajouter le Matériau"}
        </button>
      </div>
    </form>
  );
};

export default MaterialForm;
