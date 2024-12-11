import logo from "../assets/Logo HHR.png";
import { useNavigate } from "react-router-dom";

function Header({ toggleSidebar, hasAlarms }) {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate(`/`);
  };
  return (
    <div className="flex w-full bg-whiteflex flex-col transform z-50 w-full">
      <div className="m-3">
        <div className="flex justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={navigateHome}
          >
            <img src={logo} alt="Logo" className="h-12 w-40 mr-2" />
          </div>

          <div className="ml-2 flex w-full justify-between">
            <button
              className="relative m-1 px-2 flex cursor-pointer items-center ml-auto text-3xl text-[#EC751A] rounded-lg hover:bg-gray-200"
              onClick={toggleSidebar}
            >
              ☰
              {hasAlarms && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
