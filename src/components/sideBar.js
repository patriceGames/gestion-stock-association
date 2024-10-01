
function RightSidebar({isSidebarOpen, toggleSidebar, content}) {
  // State to track whether the sidebar is open

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-gray-800 text-white p-6 transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-500 ease-in-out z-50 w-full md:w-1/3`} // Full width on small screens
        >
          <button onClick={toggleSidebar} className="fixed top-0 right-0 m-4 text-red-500">
            Close
          </button>
        <h2 className="text-xl font-bold mb-4">Right Sidebar</h2>
        <ul>
          {content}
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