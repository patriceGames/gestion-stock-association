import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc} from 'firebase/firestore';
import StorageManagement from './StorageManagement';

function CompanyDetail() {
  const { id } = useParams(); // Récupération de l'ID de l'entreprise depuis l'URL
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyRef = doc(db, 'companies', id);
        const companyDoc = await getDoc(companyRef);
        if (companyDoc.exists()) {
          setCompany(companyDoc.data());
        } else {
          console.error('No such company found!');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company:', error);
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return <h2>Chargement des informations de l'entreprise...</h2>;
  }

  if (!company) {
    return <h2>Aucune entreprise trouvée.</h2>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Informations de l'entreprise : {company.name}</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Informations Générales</h2>
        <p><strong>Adresse :</strong> {company.address}</p>
        <p><strong>Description :</strong> {company.description}</p>
      </div>
      
      {/* Gestion des Employés 
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Gestion des Employés</h2>
        <EmployeeManagement company={company} />
      </div>*/}

      {/* Gestion des Stocks */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Gestion des Stocks</h2>
        <StorageManagement company={company} companyId={id}/>
      </div>
    </div>
  );
}

export default CompanyDetail;
