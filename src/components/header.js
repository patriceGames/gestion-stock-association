import logo from "../assets/HH.png";
import { useNavigate } from "react-router-dom";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate(`/`);
  };

  const navigateAddMaterial = () => {
    navigate(`/product/add`);
  };

  return (
    <div className="bg-white">
      <div className="m-3">
        <div className="flex justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={navigateHome}
          >
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="ml-2 font-semibold text-base">
              Habitat et humanisme
            </span>
          </div>

          <div className="ml-2 flex w-full justify-between">
            <div
              className="flex px-4 m-1 cursor-pointer items-center gap-x-1 rounded-md bg-[#EC751A] hover:bg-[#009EE0]"
              onClick={navigateAddMaterial}
            >
              <span className="font-medium text-white">
                + Ajouter un Produit
              </span>
            </div>

            <button
              className="py-3 px-5 m-1 flex cursor-pointer items-center gap-x-1 rounded-md bg-[#F8C9A7] hover:bg-[#ACE7FF] ml-auto"
              onClick={toggleSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 110 8 4 4 0 010-8zm0 10a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
