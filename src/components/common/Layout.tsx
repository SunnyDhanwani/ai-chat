import { useDispatch, useSelector } from "react-redux";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { logout } from "../features/auth/authSlice";
import ChatIdTile from "./ChatIdTile";
import { Chat } from "../../types/types";

const Layout = () => {
  const context: any = useOutletContext();
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.chat);
  const pathParams = useParams();

  const handleLogout = () => {
    dispatch(logout());
    context.setToken("");
  };

  return (
    <div className="flex w-screen">
      <nav className="bg-gray-100 w-[280px] shrink-0 h-screen flex flex-col justify-between border-r-[1px] border-gray-300">
        <div className="">
          <div className="p-4">
            <ChatIdTile
              id={"NEW_CHAT"}
              initialMessage={"New Chat"}
              isNewChatTile={true}
              isChatEmpty={data.find((el: Chat) => el.id === pathParams?.chatId)?.messages.length === 0}
            />
          </div>
          <div className="max-h-full break-words px-4 py-1 overflow-y-auto overflow-x-clip custom-scrollbar flex flex-col-reverse gap-2">
            {data.map((el) => (
              <ChatIdTile id={el.id} initialMessage={el.messages[0].message} />
            ))}
          </div>
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

      <div className="bg-gray-50 dark:bg-gray-900 w-full h-screen overflow-y-auto overflow-clip custom-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
