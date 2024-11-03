import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import StorageManagement from './StorageManagement';
import EmployeeManagement from './EmployeeManagement'; // Import du composant

function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('No user is currently authenticated.');
          return;
        }
  
        setCurrentUser(user);
        console.log(user.uid);
  
        const userDetailRef = doc(db, 'roles', user.uid);
        const userDetailSnapshot = await getDoc(userDetailRef);
        if (userDetailSnapshot.exists()) {
          setCurrentUserDetail(userDetailSnapshot.data());
          console.log(userDetailSnapshot.data().role);
        } else {
          console.error('User details not found.');
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des employés :', error);
      }
      setLoading(false);
    };
  
    fetchUserDetail();
  }, []);

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

      {/* Gestion des Stocks */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Gestion des Stocks</h2>
        <StorageManagement company={company} companyId={id} currentUser={currentUser} currentUserDetail={currentUserDetail}/>
      </div>
      <br></br>
      

      {/* Gestion des Employés */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Gestion des Employés</h2>
        <EmployeeManagement companyId={id} currentUser={currentUser} currentUserDetail={currentUserDetail}/>
      </div>


    </div>
  );
}

export default CompanyDetail;
