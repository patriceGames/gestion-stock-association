import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getMaterials } from './firebase.js';  // Import de la fonction de tri mutualisée
import MaterialGrid from "./MaterialGrid";
import Categories from "./Categories";
import { UiTextLight, UiTitleSecondary } from "./UI/Ui.js";

const PAGE_SIZE = 20;

function MaterialList({ currentUser, storageView = false, companyId, storageId }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();  // Utilisation des paramètres de recherche
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [lastVisible, setLastVisible] = useState(null);  // Suivi du dernier élément visible pour la pagination

  const searchQuery = searchParams.get('search');  // Obtenir la valeur du paramètre 'search'

  // Utilisation de useCallback pour mémoriser la fonction et éviter qu'elle ne change à chaque rendu
  const loadMaterials = useCallback(async (isNextPage = true, lastDoc = null) => {
    setLoading(true);

    const materialsResponse = await getMaterials({
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
    loadMaterials(false);  // Charger les matériaux pour la première page ou un nouveau filtrage
  }, [loadMaterials]);

  // Charger la page suivante
  const loadNextPage = () => {
    if (lastVisible) {
      loadMaterials(true, lastVisible);  // Charger les matériaux à partir du dernier visible
    }
  };

  if (loading) {
    return <UiTitleSecondary text={"Chargement des matériaux..."} />;
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
              <option value=""><UiTextLight text={"Toutes les sous-catégories"} /></option>
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
      <MaterialGrid materials={materials} currentUser={currentUser} storageView={storageView} companyId={companyId} storageId={storageId}/>

      {/* Pagination controls */}
      <div className="flex justify-center mt-10">
        <button onClick={loadNextPage} hidden={materials.length < PAGE_SIZE}>
          <UiTextLight text={"Charger plus"} />
        </button>
      </div>
    </div>
  );
}

export default MaterialList;
