import React from 'react';
import { Link, useParams } from 'react-router-dom';

function Breadcrumb() {
  const { companyId, storageId, id } = useParams(); // Récupère les paramètres d'URL

  return (
    <nav className="breadcrumb">
      <ul className="flex space-x-2">
        {/* Lien vers l'accueil ou la liste des entreprises */}
        <li>
          <Link to="/" className="text-blue-500 hover:underline">Accueil</Link>
          <span> / </span>
        </li>

        {/* Lien vers l'entreprise */}
        {companyId && (
          <li>
            <Link to={`/company/${companyId}`} className="text-blue-500 hover:underline">
              Entreprise {companyId}
            </Link>
            <span> / </span>
          </li>
        )}

        {/* Lien vers le hangar */}
        {storageId && (
          <li>
            <Link to={`/company/${companyId}/storage/${storageId}`} className="text-blue-500 hover:underline">
              Hangar {storageId}
            </Link>
            {id && <span> / </span>}
          </li>
        )}

        {/* Matériau actuel (si on est sur la page de détail) */}
        {id && (
          <li>
            <span>Matériau {id}</span>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Breadcrumb;
