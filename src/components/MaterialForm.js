import React, { useState, useEffect } from 'react';
import { db, auth, uploadImage } from './firebase'; 
import { collection, addDoc, doc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore'; 
import BasicInfo from './MaterialForm/BasicInfo';
import PriceAndQuantity from './MaterialForm/PriceAndQuantity';
import DimensionsAndCondition from './MaterialForm/DimensionsAndCondition';
import Description from './MaterialForm/Description';
import Images from './MaterialForm/Images';
import Location from './MaterialForm/Location';  // Nouveau composant pour la localisation

const MaterialForm = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [quantity, setQuantity] = useState('');
  const [condition, setCondition] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Localisation
  const [companyId, setCompanyId] = useState(null);
  const [storages, setStorages] = useState([]);
  const [locationType, setLocationType] = useState('text');  // Choix entre texte ou dropdown
  const [location, setLocation] = useState('');  // Localisation saisie ou sélectionnée
  const [selectedStorage, setSelectedStorage] = useState('');  // Hangar sélectionné

  // Fonction pour récupérer les hangars de l'entreprise de l'utilisateur
  useEffect(() => {
    const fetchStorages = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const companyId = userDoc.data().companyId;
          if (companyId) {
            setCompanyId(companyId);
            const storagesRef = collection(db, 'companies', companyId, 'storages');
            const storageQuerySnapshot = await getDocs(storagesRef);
            const storageList = storageQuerySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setStorages(storageList);
          }
        }
      }
    };

    fetchStorages();
  }, []);

  // Fonction pour ajouter un matériau dans Firestore
  const addMaterial = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      setUploading(true);

      let imageUrl1 = image1 ? await uploadImage(image1) : '';
      let imageUrl2 = image2 ? await uploadImage(image2) : '';
      let imageUrl3 = image3 ? await uploadImage(image3) : '';
      let imageUrl4 = image4 ? await uploadImage(image4) : '';
      let imageUrl5 = image5 ? await uploadImage(image5) : '';

      try {
        await addDoc(collection(db, 'materials'), {
          name,
          category: `${category} - ${subcategory}`,
          description,
          price,
          dimensions,
          quantity,
          condition,
          imageUrl1,
          imageUrl2,
          imageUrl3,
          imageUrl4,
          imageUrl5,
          storageId: locationType === 'dropdown' ? selectedStorage : null,  // Enregistrer le storageId si dropdown
          location: locationType === 'text' ? location : null,  // Enregistrer la localisation si texte
          createdAt: serverTimestamp(),
          userId: user.uid
        });

        alert('Matériau ajouté avec succès !');
        // Réinitialisation du formulaire
        setName('');
        setCategory('');
        setSubcategory('');
        setDescription('');
        setPrice('');
        setDimensions('');
        setQuantity('');
        setCondition('');
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setImage5(null);
        setLocation('');
        setSelectedStorage('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout du matériau :', error);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Vous devez être connecté pour ajouter un matériau');
    }
  };

  return (
    <form onSubmit={addMaterial} className="w-full">
      <BasicInfo
        name={name}
        setName={setName}
        category={category}
        setCategory={setCategory}
        subcategory={subcategory}
        setSubcategory={setSubcategory}
      />
      <PriceAndQuantity price={price} setPrice={setPrice} quantity={quantity} setQuantity={setQuantity} />
      <DimensionsAndCondition
        dimensions={dimensions}
        setDimensions={setDimensions}
        condition={condition}
        setCondition={setCondition}
      />
      <Description description={description} setDescription={setDescription} />
      <Images
        image1={image1}
        setImage1={setImage1}
        image2={image2}
        setImage2={setImage2}
        image3={image3}
        setImage3={setImage3}
        image4={image4}
        setImage4={setImage4}
        image5={image5}
        setImage5={setImage5}
      />
      {/* Composant pour gérer la localisation */}
      <Location
        companyId={companyId}
        storages={storages}
        locationType={locationType}
        setLocationType={setLocationType}
        location={location}
        setLocation={setLocation}
        selectedStorage={selectedStorage}
        setSelectedStorage={setSelectedStorage}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          disabled={uploading}
        >
          {uploading ? 'Ajout en cours...' : 'Ajouter le Matériau'}
        </button>
      </div>
    </form>
  );
};

export default MaterialForm;
