import { collection, query, where, orderBy, getDocs, limit, startAfter } from 'firebase/firestore';
import { db } from './firebase';  // Assure-toi que Firestore est correctement importé

// Fonction pour récupérer les matériaux avec un tri défini et recherche par nom
export const fetchMaterials = async ({ 
  storageId = null, 
  categoryFilter = '', 
  subcategoryFilter = '', 
  searchQuery = '',  // Ajout du paramètre de recherche texte
  limitSize = null, 
  lastVisible = null 
}) => {
  // Base de la collection des matériaux
  const materialsRef = collection(db, 'materials');
  let q = materialsRef;

  // Construction de la requête avec les filtres conditionnels
  if (storageId) {
    q = query(
      materialsRef,
      where('storageId', '==', storageId)
    );
  }

  if (categoryFilter) {
    if (subcategoryFilter) {
      // Filtrage par catégorie exacte et sous-catégorie si les deux sont présents
      q = query(q, where('category', '==', `${categoryFilter} - ${subcategoryFilter}`));
    } else {
      // Filtrage par catégorie uniquement si aucune sous-catégorie n'est sélectionnée
      q = query(q, 
        where('category', '>=', categoryFilter),
        where('category', '<=', categoryFilter + '\uf8ff')
      );
    }
  }

  // Si un terme de recherche est fourni, filtrer par nom du matériau
  if (searchQuery) {
    // Utilisation de '>=', '<=' et '\uf8ff' pour rechercher les documents qui commencent par le terme de recherche
    q = query(q, 
      where('name', '>=', searchQuery),
      where('name', '<=', searchQuery + '\uf8ff')
    );
  }

  // Toujours trier par date de création
  q = query(q, orderBy('createdAt', 'desc'));

  // Si une limite est définie (pour la pagination)
  if (limitSize) {
    q = query(q, limit(limitSize));
  }

  // Si on passe un lastVisible (pour paginer à partir du dernier doc visible)
  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  // Exécution de la requête
  const querySnapshot = await getDocs(q);

  // Si aucun document n'est trouvé, retourner des valeurs par défaut
  if (querySnapshot.empty) {
    return {
      data: [],    // Pas de matériaux
      firstDoc: null,
      lastDoc: null
    };
  }

  // Extraire les données des matériaux et retourner également les premiers/derniers documents
  const materials = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const firstVisibleDoc = querySnapshot.docs[0];  // Premier document visible
  const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];  // Dernier document visible

  return {
    data: materials,
    firstDoc: firstVisibleDoc,
    lastDoc: lastVisibleDoc
  };
};
