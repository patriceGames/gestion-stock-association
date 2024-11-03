import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { fetchMaterials } from './MaterialQueries';
import MaterialTable from './MaterialTable';
import { db } from './firebase';

function StorageDetail() {
  const { storageId, companyId } = useParams();
  const navigate = useNavigate();
  const [storage, setStorage] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const { data: fetchedMaterials } = await fetchMaterials({ storageId });
      setMaterials(fetchedMaterials);
    } catch (error) {
      console.error('Erreur lors du chargement des matériaux:', error);
    } finally {
      setLoading(false);
    }
  }, [storageId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyRef = doc(db, 'companies', companyId);
        const companyDoc = await getDoc(companyRef);
        if (companyDoc.exists()) {
          setCompany(companyDoc.data());
        }

        const storageRef = doc(db, 'companies', companyId, 'storages', storageId);
        const storageDoc = await getDoc(storageRef);
        if (storageDoc.exists()) {
          setStorage(storageDoc.data());
        }

        await loadMaterials();
      } catch (error) {
        console.error('Erreur lors de la récupération des détails :', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [storageId, companyId, loadMaterials]);

  if (loading) {
    return <h2>Chargement des informations...</h2>;
  }

  return (
    <div className="p-8">
      <button onClick={() => navigate(`/company/${companyId}`)} className="flex items-center text-blue-500 mb-4">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour à {company?.name || "l'entreprise"}
      </button>

      <div className="flex items-start mb-8">
        {storage?.imageUrl && (
          <img src={storage.imageUrl} alt={storage.name} className="w-1/3 h-auto rounded mr-6 object-cover max-w-full max-h-96" />
        )}
        <div>
          <h1 className="text-2xl font-bold mb-4">{storage?.name}</h1>
          <p><strong>Adresse :</strong> {storage?.address}</p>
          <p><strong>Description :</strong> {storage?.description}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Matériaux stockés</h2>
      <MaterialTable 
        materials={materials} 
        companyId={companyId} 
        storageId={storageId} 
      />
    </div>
  );
}

export default StorageDetail;
