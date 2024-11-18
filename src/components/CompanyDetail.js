import { useParams } from 'react-router-dom';
import StorageManagement from './StorageManagement';
import EmployeeManagement from './EmployeeManagement'; // Import du composant

function CompanyDetail({currentUser, currentUserDetail, company}) {
  const { id } = useParams();

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
