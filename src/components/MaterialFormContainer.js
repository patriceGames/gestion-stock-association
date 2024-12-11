import MaterialForm from "./MaterialForm";
import { useNavigate, useParams } from "react-router-dom";
import { UiTextLightSmall } from "./UI/Ui";

function MaterialFormContainer({ currentUser, company }) {
  const { companyId, materialId, storageId, userId } = useParams();
  const navigate = useNavigate(); // Initialiser useNavigate pour permettre la navigation

  return (
    <div className="flex lg:m-10 items-center justify-center ">
      <div className="w-full md:w-2/3 xl:w-1/2 h-1/2 px-4 ">
        <button
          onClick={() => {
            navigate(
              materialId
                ? userId
                  ? `/user/${userId}/material/${materialId}`
                  : companyId
                  ? `/company/${companyId}/storage/${storageId}/material/${materialId}`
                  : `/material/${materialId}`
                : `/`
            );
          }}
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
          <UiTextLightSmall text={"Retour"} />
        </button>
        <MaterialForm
          currentUser={currentUser}
          company={company}
        />
      </div>
    </div>
  );
}

export default MaterialFormContainer;
