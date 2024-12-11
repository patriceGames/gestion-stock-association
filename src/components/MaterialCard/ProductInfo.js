import React, { useState, useEffect } from "react";
import { getStorage } from "../firebase";
import { UiTextBold, UiTextLight, UiTextLightSmall, UiTitleSecondary } from "../UI/Ui";

function ProductInfo({ material, quantityAvailable }) {
  const [storageData, setStorageData] = useState(null);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const storage = await getStorage(material.storageId);
        setStorageData(storage);
      } catch (error) {
        console.error("Error fetching storage data:", error);
      }
    };

    if(material?.storageId)
        fetchStorage();
  }, [material.storageId]);

  return (
    <div className="px-6 py-4">
      <UiTitleSecondary text={material.name} />
      <UiTextLightSmall text={material.category} color={"gray-400"} />
      <div className="items-center mt-4">
        <UiTextLight text={"Disponible : "} color={"gray-500"} />
        <UiTextBold text={quantityAvailable} />
      </div>
      <div className="items-center">
        <UiTextLight text={`En stock : ${material.quantity} (${storageData?.name})`} color={"gray-500"} />
      </div>
      <div className="items-center mt-3">
        <p className='mb-3'><UiTextLight text={material.warning} color={"red-500"} /></p>
        <p className='my-3'><UiTextLight text={material.description}/></p>
        <UiTextLightSmall text={"Dernière vérification : "} color={"gray-500"} />
        <UiTextLightSmall text={new Date(material.updatedAt.seconds * 1000).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
           color={"gray-500"} />
      </div>
    </div>
  );
}

export default ProductInfo;
