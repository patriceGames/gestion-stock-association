import React from "react";
import MaterialListItem from "./MaterialListItem";

const MaterialGrid = ({ materials, DeleteMaterial, connected, storageView, companyId, storageId}) => {
  if (materials.length === 0) {
    return <p>Aucun matériau disponible pour le moment.</p>;
  }

  return (
    <div>
      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {materials.map((material) => (
          <MaterialListItem
            key={material.id}
            material={material}
            DeleteMaterial={DeleteMaterial}
            connected={connected}
            storageView={storageView} 
            companyId={companyId} 
            storageId={storageId}
          />
        ))}
      </ul>
    </div>
  );
};

export default MaterialGrid;
