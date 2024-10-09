import React, { useState, useEffect } from "react";
import { db, DeleteMaterial } from "./firebase"; // Assure-toi que firebase.js est bien configuré
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  limit,
  startAfter,
  endBefore
} from "firebase/firestore";
import MaterialListItem from "./MaterialListItem";
import Categories from "./Categories";

const PAGE_SIZE = 10; // Nombre de matériaux par page

function MaterialList({connected}) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [lastVisible, setLastVisible] = useState(null); // Dernier document visible pour la pagination
  const [firstVisible, setFirstVisible] = useState(null); // Premier document visible pour la page précédente
  const [page, setPage] = useState(1); // Suivi de la page actuelle

  // Fonction pour charger les matériaux initiaux ou filtrés par catégorie/sous-catégorie
  const loadMaterials = (isNextPage = true, lastDoc = null) => {
    setLoading(true);
    let q;

    if (categoryFilter) {
      q = subcategoryFilter
        ? query(
            collection(db, "materials"),
            where("category", "==", `${categoryFilter} - ${subcategoryFilter}`),
            orderBy("createdAt", "desc"),
            limit(PAGE_SIZE)
          )
        : query(
            collection(db, "materials"),
            where("category", ">=", categoryFilter),
            where("category", "<=", categoryFilter + "\uf8ff"),
            orderBy("createdAt", "desc"),
            limit(PAGE_SIZE)
          );
    } else {
      q = query(collection(db, "materials"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    }

    if (isNextPage && lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    if (!isNextPage && firstVisible) {
      q = query(q, endBefore(firstVisible));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const materialsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMaterials(materialsData);
      setFirstVisible(snapshot.docs[0]); // Premier document de la page
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Dernier document de la page
      setLoading(false);
    });

    return unsubscribe;
  };

  // Charger les matériaux lors du montage et à chaque changement de filtre
  useEffect(() => {
    const unsubscribe = loadMaterials(); // Charger les matériaux initiaux
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, subcategoryFilter]);

  const loadNextPage = () => {
    if (lastVisible) {
      setPage((prevPage) => prevPage + 1);
      loadMaterials(true, lastVisible);
    }
  };

  const loadPreviousPage = () => {
    if (firstVisible) {
      setPage((prevPage) => Math.max(prevPage - 1, 1));
      loadMaterials(false, firstVisible);
    }
  };

  if (loading) {
    return <h2>Chargement des matériaux...</h2>;
  }

  return (
    <div>
      <div className="m-8 flex">
        {/* Dropdown pour filtrer par catégorie */}
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

        {/* Dropdown pour filtrer par sous-catégorie */}
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

      {materials.length === 0 ? (
        <p>Aucun matériau disponible pour le moment.</p>
      ) : (
        <div>
          <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            {materials.map((material) => (
              <MaterialListItem
                key={material.id}
                material={material}
                DeleteMaterial={DeleteMaterial}
                connected={connected}
              />
            ))}
          </ul>

          {/* Boutons de pagination */}
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
      )}
    </div>
  );
}

export default MaterialList;
