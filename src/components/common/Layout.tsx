import { useDispatch, useSelector } from "react-redux";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { logout } from "../features/auth/authSlice";
import ChatIdTile from "./ChatIdTile";
import { Chat } from "../../types/types";
import { useEffect } from "react";
import { clearAllGlobalItems, getGlobalItem } from "../../utils/helper";

const Layout = () => {
  const context: any = useOutletContext();
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.chat);
  const { email } = useSelector((state: RootState) => state.auth);
  const pathParams = useParams();

  const handleLogout = () => {
    dispatch(logout());
    context.setToken("");
  };  

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const authToken = getGlobalItem("authToken");

      if (authToken === "GUEST") {
        clearAllGlobalItems();
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex w-screen">
      <nav className="bg-gray-100 w-[280px] shrink-0 h-screen flex flex-col justify-between border-r-[1px] border-gray-300">
        <div className="max-h-full h-full">
          <div className="p-4">
            <ChatIdTile
              id={"NEW_CHAT"}
              initialMessage={"New Chat"}
              isNewChatTile={true}
              isChatEmpty={
                data.find((el: Chat) => el.id === pathParams?.chatId)?.messages
                  .length === 0
              }
            />
          </div>
          <div className="h-full max-h-[calc(100vh-72px-124px)] break-words px-4 py-1 overflow-y-auto overflow-x-clip custom-scrollbar flex flex-col-reverse justify-end gap-2">
            {data && data.map((el) => (
              <ChatIdTile id={el.id} initialMessage={el.messages[0].message} />
            ))}
          </div>
        <div className="p-4">
          <button
            className="py-2 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md w-full mt-full"
            onClick={() => handleLogout()}
          >
            <strong>Logout</strong>
          </button>
          <button
            className="mt-3 py-2 px-5 bg-gray-500 cursor-default text-white rounded-md w-full mt-full"
          >
            <strong className="ellipsis line-clamp-1">{email}</strong>
          </button>
        </div>
        </div>
      </nav>

      <div className="bg-gray-50 w-full h-screen overflow-y-auto overflow-clip custom-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
