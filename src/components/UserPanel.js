import { logout } from "./firebase";
import { Link } from "react-router-dom";

function UserPanel({ toggleSidebar, company }) {
  const handleLogout = () => {
    logout();
    toggleSidebar();
  };

  //console.log("userPanel:" + company)

  return (
    <div>
      {company?.id && (
        <>
          <br />
          <Link to={`/company/${company.id}`}>
            Accéder à la page de l'entreprise
          </Link>
        </>
      )}

      <br />
      <button onClick={handleLogout} className="logout-button">
        Déconnexion
      </button>
    </div>
  );
}

export default UserPanel;
