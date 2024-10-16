import logo from "../assets/Logo_small.webp";
import { useNavigate } from "react-router-dom";

function Header({ toggleSidebar, connected, loginLoading }) {
  const navigate = useNavigate();
  const navigateHome = () => {
    // Redirige vers la page du produit en utilisant son ID
    navigate(``);
  };

  const navigateAddMaterial = () => {
    // Redirige vers la page du produit en utilisant son ID
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
            <span className="ml-2 font-semibold text-base">Réemploi</span>
          </div>

          <div className="ml-6 flex flex-1 gap-x-3">
            <input
              type="text"
              className="w-full rounded-md border border-green-500 px-3 py-2 text-sm"
              value="DJI phantom"
              onChange={(e) => {}}
            />
          </div>

          <div className="ml-2 flex">
            <div className="flex m-1 cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 bg-green-500 hover:bg-gray-100"
              onClick={navigateAddMaterial}>
              <span className="text-3xl font-medium">+</span>
            </div>

            <button
              className="py-3 px-5 m-1 flex cursor-pointer items-center gap-x-1 rounded-md bg-blue-100 hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              {loginLoading ? (
                <span className="text-sm font-medium">...</span>
              ) : connected ? (
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full !bg-red-500 text-xs !text-white">
                    3
                  </span>
                </div>
              ) : (
                <span className="text-sm font-medium">Sign in</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
