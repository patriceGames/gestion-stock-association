import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMaterials } from './MaterialQueries';  // Import de la fonction de tri mutualisée
import MaterialGrid from "./MaterialGrid";
import Categories from "./Categories";

const PAGE_SIZE = 3;

function MaterialList({ connected, storageView = false, companyId, storageId }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();  // Utilisation des paramètres de recherche
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [lastVisible, setLastVisible] = useState(null);  // Suivi du dernier élément visible pour la pagination
  const [page, setPage] = useState(1);  // Numéro de la page actuelle

  const searchQuery = searchParams.get('search');  // Obtenir la valeur du paramètre 'search'

  // Utilisation de useCallback pour mémoriser la fonction et éviter qu'elle ne change à chaque rendu
  const loadMaterials = useCallback(async (isNextPage = true, lastDoc = null) => {
    setLoading(true);

    const materialsResponse = await fetchMaterials({
      categoryFilter,
      subcategoryFilter,
      limitSize: PAGE_SIZE,
      lastVisible: isNextPage ? lastDoc : null,  // Utilisation de lastVisible pour la pagination
      searchQuery
    });

    if (isNextPage) {
      // Ajoute les nouveaux matériaux à ceux déjà affichés
      setMaterials((prevMaterials) => [...prevMaterials, ...materialsResponse.data]);
    } else {
      // Réinitialiser les matériaux pour la première page ou un nouveau filtrage
      setMaterials(materialsResponse.data);
    }

    setLastVisible(materialsResponse.lastDoc);  // Stocker le dernier document visible
    setLoading(false);
  }, [categoryFilter, subcategoryFilter, searchQuery]);

  // Charger les matériaux à chaque changement de filtre ou lors de l'initialisation
  useEffect(() => {
    setPage(1);  // Réinitialiser la page à 1 lors du changement de filtre
    loadMaterials(false);  // Charger les matériaux pour la première page ou un nouveau filtrage
  }, [loadMaterials]);

  // Charger la page suivante
  const loadNextPage = () => {
    if (lastVisible) {
      setPage(prevPage => prevPage + 1);  // Passer à la page suivante
      loadMaterials(true, lastVisible);  // Charger les matériaux à partir du dernier visible
    }
  };

  // Charger la page précédente (remettre à jour pour la première page)
  const loadPreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);  // Revenir à la page précédente
      loadMaterials(false, null);  // Charger les matériaux de la page précédente (on n'utilise pas `lastVisible` ici)
    }
  };

  if (loading) {
    return <h2>Chargement des matériaux...</h2>;
  }

  return (
    <div className="sm:m-3">
      {/* Filtres pour catégories et sous-catégories */}
      <div className="m-5 flex">
        <div className="m-2">
          <label htmlFor="filter"></label>
          <select
            id="filter"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubcategoryFilter(''); // Réinitialiser la sous-catégorie si la catégorie change
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

      {/* Affichage des matériaux */}
      <MaterialGrid materials={materials} connected={connected} storageView={storageView} companyId={companyId} storageId={storageId}/>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button onClick={loadPreviousPage} disabled={page === 1}>
          Page précédente
        </button>
        <span>Page {page}</span>
        <button onClick={loadNextPage} disabled={materials.length < PAGE_SIZE}>
          Page suivante
        </button>
      </div>
    </div>
  );
}

export default MaterialList;
