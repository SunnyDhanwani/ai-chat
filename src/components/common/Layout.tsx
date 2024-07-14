import { useDispatch, useSelector } from "react-redux";
import { Outlet, useOutletContext } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { logout } from "../features/auth/authSlice";
import ChatIdTile from "./ChatIdTile";

const Layout = () => {
  const context: any = useOutletContext();
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.chat);

  const handleLogout = () => {
    dispatch(logout());
    context.setToken("");
  };

  return (
    <div className="flex w-screen">
      <nav className="bg-gray-100 w-[280px] shrink-0 h-screen flex flex-col justify-between border-r-[1px] border-gray-300">
        <div className="max-h-full break-words p-4 overflow-y-auto overflow-x-clip custom-scrollbar flex flex-col-reverse gap-2">
          {data.map((el) => (
            <ChatIdTile id={el.id} initialMessage={el.messages[0].message} />
          ))}
          <ChatIdTile
            id={""}
            initialMessage={"New Chat"}
            isNewChatTile={true}
          />
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
