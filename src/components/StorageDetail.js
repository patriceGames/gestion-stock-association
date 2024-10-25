import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { fetchMaterials } from './MaterialQueries';  // Import de la fonction mutualisée
import MaterialGrid from './MaterialGrid';
import Categories from './Categories';  // Assure-toi que tu as un fichier pour gérer les catégories
import { db } from './firebase';

function StorageDetail() {
  const { storageId, companyId } = useParams();
  const navigate = useNavigate();
  const [storage, setStorage] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');

  // Fonction pour charger les matériaux filtrés
  const loadMaterials = useCallback(async () => {
    setLoading(true);  // Activer le chargement

    try {
      const { data: fetchedMaterials } = await fetchMaterials({
        storageId,  // Filtrer par ID du hangar
        categoryFilter,  // Filtrer par catégorie
        subcategoryFilter  // Filtrer par sous-catégorie
      });

      setMaterials(fetchedMaterials);  // Mettre à jour l'état avec les matériaux récupérés
    } catch (error) {
      console.error('Erreur lors du chargement des matériaux:', error);
    } finally {
      setLoading(false);  // Désactiver le chargement
    }
  }, [storageId, categoryFilter, subcategoryFilter]);

  // Charger les détails de l'entreprise, du hangar, et les matériaux
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les informations de l'entreprise
        const companyRef = doc(db, 'companies', companyId);
        const companyDoc = await getDoc(companyRef);
        if (companyDoc.exists()) {
          setCompany(companyDoc.data());  // Mettre à jour l'état de l'entreprise
        }

        // Charger les informations du hangar
        const storageRef = doc(db, 'companies', companyId, 'storages', storageId);
        const storageDoc = await getDoc(storageRef);
        if (storageDoc.exists()) {
          setStorage(storageDoc.data());  // Mettre à jour l'état du hangar
        }

        // Charger les matériaux après avoir récupéré les informations du hangar
        await loadMaterials();
      } catch (error) {
        console.error('Erreur lors de la récupération des détails :', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [storageId, companyId, loadMaterials]);  // Recharger quand storageId, companyId ou les filtres changent

  if (loading) {
    return <h2>Chargement des informations...</h2>;
  }

  return (
    <div className="p-8">
      {/* Bouton retour à l'entreprise */}
      <button onClick={() => navigate(`/company/${companyId}`)} className="flex items-center text-blue-500 mb-4">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour à {company?.name || "l'entreprise"}
      </button>

      <div className="flex items-start mb-8">
        {storage?.imageUrl && (
          <img
            src={storage.imageUrl}
            alt={storage.name}
            className="w-1/3 h-auto rounded mr-6 object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold mb-4">{storage?.name}</h1>
          <p><strong>Adresse :</strong> {storage?.address}</p>
        </div>
      </div>

      {/* Filtres de catégories et sous-catégories */}
      <div className="m-5 flex">
        <div className="m-2">
          <label htmlFor="categoryFilter"></label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubcategoryFilter('');  // Réinitialiser la sous-catégorie si la catégorie change
            }}
          >
            <option value="">Toutes les catégories</option>
            {Categories.map((catGroup) => (
              <option key={catGroup.group} value={catGroup.group}>
                {catGroup.group}
              </option>
            ))}
          </select>
        </div>

        {categoryFilter && (
          <div className="m-2">
            <label htmlFor="subcategoryFilter"></label>
            <select
              id="subcategoryFilter"
              value={subcategoryFilter}
              onChange={(e) => setSubcategoryFilter(e.target.value)}
            >
              <option value="">Toutes les sous-catégories</option>
              {Categories
                .find((catGroup) => catGroup.group === categoryFilter)
                .subcategories.map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Matériaux stockés</h2>
      <MaterialGrid materials={materials} connected={false} storageView={true} companyId={companyId} storageId={storageId}/>
    </div>
  );
}

export default StorageDetail;
