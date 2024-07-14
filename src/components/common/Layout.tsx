import { useDispatch } from "react-redux";
import { Outlet, useOutletContext } from "react-router-dom";
import { AppDispatch } from "../store/store";
import { logout } from "../features/auth/authSlice";

const Layout = () => {
  const context: any = useOutletContext();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    context.setToken("");
  };

  return (
    <div className="flex w-screen">
      <nav className="bg-gray-100 w-[280px] shrink-0 h-screen flex flex-col justify-between border-r-[1px] border-gray-300">
        <div className="max-h-full break-words p-4 overflow-y-auto overflow-x-clip custom-scrollbar">
          {/* {"Sunny ".repeat(1000000)} */}
        </div>
        <div className="p-4">
          <button
            className="py-2 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md w-full mt-full"
            onClick={() => handleLogout()}
          >
            <strong>Logout</strong>
          </button>
        </div>
      </nav>

      <div className="bg-gray-50 w-full h-screen overflow-y-auto overflow-clip custom-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
