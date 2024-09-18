
function MaterialListItem({ material, DeleteMaterial }) {
return (
        <li key={material.id} style={styles.materialItem}>
            <h2>{material.name}</h2>
            <p><strong>Description :</strong> {material.description}</p>
            {material.imageUrl && (
            <div style={styles.imageContainer}>
                <img src={material.imageUrl} alt={material.name} style={styles.image} />
            </div>
            )}
            {/* Ajout d'un bouton pour supprimer le matériau */}
            <button onClick={() => DeleteMaterial(material.id)} style={styles.deleteButton}>
            Supprimer
            </button>
        </li>
          
  );
};

// Styles basiques pour rendre la liste agréable à lire
const styles = {
  materialItem: {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
  },
  imageContainer: {
    marginTop: '10px',
    maxWidth: '150px',
    mawHeight: '150px', 
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '5px',
  }
};

export default MaterialListItem;