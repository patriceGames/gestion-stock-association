import React from 'react';
import StorageCard from './StorageCard';

function StorageList({ storages, onEditClick, companyId }) {
  return (
    <ul className="grid grid-cols-3 gap-4">
      {storages.map(storage => (
        <StorageCard key={storage.id} storage={storage} onEditClick={onEditClick} companyId={companyId}/>
      ))}
    </ul>
  );
}

export default StorageList;
