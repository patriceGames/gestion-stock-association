import UserPanel from "./UserPanel";

function RightSidebar({isSidebarOpen, toggleSidebar}) {
  // State to track whether the sidebar is open

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-[#233666] text-white p-6 transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-500 ease-in-out z-50 w-full md:w-80`} // Full width on small screens
        >
          <button onClick={toggleSidebar} className="fixed top-0 right-0 m-4 text-[#EC751A]">
            Close
          </button>
        <h2 className="text-xl text-[#009EE0] font-bold mb-4">User</h2>
        <ul>
          <UserPanel toggleSidebar={toggleSidebar} />
        </ul>
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
};

export default RightSidebar;