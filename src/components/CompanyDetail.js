import { useParams } from 'react-router-dom';
import StorageManagement from './StorageManagement';
import EmployeeManagement from './EmployeeManagement'; // Import du composant
import {UiTitleSecondary } from './UI/Ui';

function CompanyDetail({currentUser, company}) {
  const { id } = useParams();

  if (!company) {
    return <h2>Aucune entreprise trouvée.</h2>;
  }

  return (
    <div className="px-8 pt-3">

      {/* Gestion des Stocks */}
      <div className="mb-8">
        <UiTitleSecondary  text={"Gestion des Stocks"} />
        <StorageManagement company={company} companyId={id} currentUser={currentUser}/>
      </div>
      <br></br>
      

      {/* Gestion des Employés */}
      <div className="mb-8">
      <UiTitleSecondary text={"Gestion des Employés"} />
        <EmployeeManagement companyId={id} currentUser={currentUser}/>
      </div>


    </div>
  );
}

export default CompanyDetail;
