import { logout } from "./firebase";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faStar,
  faClipboardList,
  faWarehouse,
  faKey,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { UiButton, UiTextMedium, UiTitleSecondary } from "./UI/Ui";

function RightSidebar({
  isSidebarOpen,
  toggleSidebar,
  currentUser,
  company,
  alarms,
}) {
  const handleLogout = () => {
    logout();
    toggleSidebar();
  };

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-[#233666] text-white p-6 flex flex-col transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 ease-in-out z-50 w-full md:w-80`}
      >
        {/* Titre principal */}
        <UiTitleSecondary text={"MENU"} color={"[#009EE0]"} />

        {/* Bouton de fermeture */}
        <button
          onClick={toggleSidebar}
          className="fixed top-5 right-8 text-white text-2xl self-end focus:outline-none hover:text-red-400"
        >
          &times;
        </button>

        {/* Bouton : Ajouter un matériau */}
        <div className="mt-6">
          <Link
            to={`/material/add`}
            className="mt-4 flex items-center text-md font-medium hover:bg-blue-600 py-2 px-3 rounded-lg transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="h-6 w-6 mr-3" />
            {<UiTextMedium text={"Ajouter un matériau"} />}
          </Link>
        </div>

        {/* Groupe : Utilisateur */}
        <div className="mt-6">
          <UiTextMedium text={"Utilisateur"} />
          <Link
            to={`/user/${currentUser.uid}/reservations`}
            className="relative mt-4 flex items-center text-md font-medium hover:bg-blue-600 py-2 px-3 rounded-lg transition-all duration-200"
          >
            <FontAwesomeIcon icon={faClipboardList} className="h-6 w-6 mr-3" />
            {<UiTextMedium text={"Mes Réservations"} />}
            {alarms.userAlarms > 0 && (
              <span className="absolute top-0 left-0 text-sm bg-red-600 text-white px-2 rounded-full">
                {alarms.userAlarms}
              </span>
            )}
          </Link>
          <Link
            to={`/user/${currentUser.uid}`}
            className="mt-4 flex items-center text-md font-medium hover:bg-blue-600 py-2 px-3 rounded-lg transition-all duration-200"
          >
            <FontAwesomeIcon icon={faUser} className="h-6 w-6 mr-3" />
            {<UiTextMedium text={"Mon Profil"} />}
          </Link>
          <Link
            to={`/user/${currentUser.uid}/favorites`}
            className="mt-4 flex items-center text-md font-medium hover:bg-blue-600 py-2 px-3 rounded-lg transition-all duration-200"
          >
            <FontAwesomeIcon icon={faStar} className="h-6 w-6 mr-3" />
            {<UiTextMedium text={"Mes Favoris"} />}
          </Link>
          
        </div>

        {/* Groupe : Gestion */}
        {currentUser.role === "admin" && (
          <div className="mt-8">
            <UiTextMedium text={"Gestion"} />
            <Link
              to={`/company/${company.id}/reservations`}
              className="relative mt-4 flex items-center text-md font-medium hover:bg-blue-600 py-2 px-3 rounded-lg transition-all duration-200"
            >
              <FontAwesomeIcon
                icon={faClipboardList}
                className="h-6 w-6 mr-3"
              />
              {<UiTextMedium text={"Réservations"} />}
              {alarms.adminAlarms > 0 && (
                <span className="absolute top-0 left-0 text-sm bg-red-600 text-white px-2 rounded-full">
                  {alarms.adminAlarms}
                </span>
              )}
            </Link>
            <Link
              to={`/company/${company.id}/storage`}
              className="mt-4 flex items-center text-md font-medium hover:bg-blue-600 py-2 px-3 rounded-lg transition-all duration-200"
            >
              <FontAwesomeIcon icon={faWarehouse} className="h-6 w-6 mr-3" />
              {<UiTextMedium text={"Stock"} />}
            </Link>
            <Link
              to={`/company/${company.id}/roles`}
              className="mt-4 flex items-center text-md font-medium hover:bg-blue-600 py-2 px-3 rounded-lg transition-all duration-200"
            >
              <FontAwesomeIcon icon={faKey} className="h-6 w-6 mr-3" />
              {<UiTextMedium text={"Droits et Accès"} />}
            </Link>
            
          </div>
        )}

        {/* Bouton de déconnexion */}
        <div className="mt-auto flex justify-center">
          <UiButton
            action={handleLogout}
            text={"Déconnexion"}
            icon={faSignOutAlt}
            color={"red"}
          />
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-20"
        ></div>
      )}
    </div>
  );
}

export default RightSidebar;