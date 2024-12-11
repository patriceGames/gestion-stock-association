import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MaterialTable from "./MaterialTable";
import { getMaterials, getStorage } from "./firebase";
import { UiTextBold, UiTextLight, UiTitleMain, UiTitleSecondary } from "./UI/Ui";

function StorageDetail({ currentUser, company }) {
  const { storageId, companyId } = useParams();
  const navigate = useNavigate();
  const [storage, setStorage] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Render StorageDetail");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storageDoc = await getStorage(storageId);
        setStorage(storageDoc);

        const { data: fetchedMaterials } = await getMaterials({ storageId });
        setMaterials(fetchedMaterials);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails :", error);
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (loading) {
    return <h2>Chargement des informations...</h2>;
  }

  return (
    <div className="px-8 pt-3">
      <button
        onClick={() => navigate(`/company/${companyId}/storage`)}
        className="flex items-center text-blue-500 mb-4"
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <UiTextLight text={"Retour"} />
      </button>

      <div className="flex items-start mb-8">
        {storage?.imageUrl && (
          <img
            src={storage.imageUrl}
            alt={storage.name}
            className="w-40 h-40 rounded mr-6 object-cover"
          />
        )}
        <div>
          {/* Titre principal */}
          <UiTitleMain text={storage.name} />

          <UiTextBold text="Adresse : " />
          <UiTextLight text={storage?.address} />

          <br/>
          <UiTextBold text="Description : " />
          <UiTextLight text={storage?.description} />
        </div>
      </div>

      <UiTitleSecondary text={"Matériaux stockés"} />
      <MaterialTable
        materials={materials}
        company={company}
        currentUser={currentUser}
        storageId={storageId}
      />
    </div>
  );
}

export default StorageDetail;
