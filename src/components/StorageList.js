import React from 'react';
import StorageCard from './StorageCard';

function StorageList({ storages, onEditClick, companyId }) {
  return (
    <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {storages.map(storage => (
        <StorageCard key={storage.id} storage={storage} onEditClick={onEditClick} companyId={companyId}/>
      ))}
    </ul>
  );
}

export default StorageList;
