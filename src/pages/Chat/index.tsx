import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../components/store/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Chat as ChatTopic, ChatMessage } from "../../types/types";
import { User } from "../../types/enum";
import { encryptText, getGlobalItem, round5 } from "../../utils/helper";
import { debounce } from "lodash";
import Loader from "./Loader";
import RichTextEditor from "./RichTextEditor";
import { EMPTY_STATE_MESSAGES } from "../../utils/contants";
import {
  FaAcquisitionsIncorporated,
  FaAngry,
  FaArrowDown,
  FaExclamationTriangle,
  FaShareAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useGetAssistantResponseMutation } from "../../components/features/chat/chatApi";
import FeedbackEditor from "./FeedbackEditor";

const Chat = () => {
  const pathParams = useParams();
  const { data } = useSelector((state: RootState) => state.chat);
  const chatRef = useRef<HTMLDivElement>(null);
  const [showDownArrow, setShowDownArrow] = useState(false);
  const [getAssistantResponse, { isLoading }] =
    useGetAssistantResponseMutation();
  const [loading, setLoading] = useState(false);
  const guestLogin = getGlobalItem("authToken") === "GUEST";

  const scrollToBottom = () => {
    if (chatRef.current) {
      const { scrollHeight } = chatRef.current;
      chatRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const chatElement = chatRef.current;

    if (chatElement) {
      const handleScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = chatElement;
        const isAtBottom = round5(scrollHeight - scrollTop - clientHeight) < 20;

        setShowDownArrow(!isAtBottom);
      };

      const debouncedHandleScroll = debounce(handleScroll, 100);

      chatElement.addEventListener("scroll", debouncedHandleScroll);

      return () => {
        chatElement.removeEventListener("scroll", debouncedHandleScroll);
        debouncedHandleScroll.cancel();
      };
    }
  }, []);

  const currentChat = data.find((el: ChatTopic) => el.id === pathParams.chatId);

  const handleShareChat = () => {
    if (getGlobalItem("authToken") === "GUEST") {
      toast.error(
        `Oops! It looks like sharing chats isn't available for guest users.`
      );
      return;
    } else if (!currentChat?.messages) {
      return;
    }

    const json = JSON.stringify(currentChat);
    const encrypt = encryptText(json);
    const sharedURL =
      window.location.origin + "/shared-chat?conversation=" + encrypt;

    if (sharedURL.length < 2023) {
      navigator.clipboard.writeText(sharedURL).then(() => {
        toast.success(`URL Copied`);
      });
    } else {
      toast.error(
        `This chat is too lengthy to share due to frontend restrictions. Please keep it short.`,
        { autoClose: 10000 }
      );
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages?.length, pathParams.chatId]);

  const handleLoading = (value: boolean) => {
    setLoading(value);
  };

  const renderEditor = useCallback(() => {
    return (
      <>
        {currentChat?.conversationEnded ? (
          !currentChat?.feedback ? (
            <div className="max-w-[50vw] w-full mx-auto pr-4">
              <div className="flex min-w-full gap-4 items-end">
                <FeedbackEditor />
              </div>
            </div>
          ) : null
        ) : (
          <div className="max-w-[50vw] w-full mx-auto pr-4">
            <div className="flex min-w-full gap-4 items-end">
              <RichTextEditor loading={loading} handleLoading={handleLoading} />
            </div>
          </div>
        )}
      </>
    );
  }, [currentChat?.conversationEnded, currentChat?.feedback]);

  return (
    <div className="relative p-4 pr-0 h-full max-w-full flex flex-col justify-between">
      <button
        className="bg-blue-500/50 hover:bg-blue-500 rounded-md absolute p-3 text-white transition-all duration-300"
        onClick={() => handleShareChat()}
      >
        <FaShareAlt />
      </button>

      {guestLogin && (
        <button className="bg-blue-300/50 hover:bg-blue-300 rounded-md absolute p-3 text-white transition-all duration-300 right-4 flex items-center gap-2 text-sm font-bold cursor-default">
          <FaExclamationTriangle /> <span>Temporary chat</span>
        </button>
      )}
      <div
        className="h-full pr-4 mb-4 overflow-x-clip overflow-y-auto custom-scrollbar break-all text-black"
        ref={chatRef}
      >
        <div className="max-w-[50vw] mx-auto flex flex-col gap-3 pb-20 h-full">
          {currentChat?.messages && currentChat?.messages.length > 0 ? (
            currentChat?.messages.map(
              ({
                id,
                sentBy,
                like,
                message,
                messageJSON,
                rating,
              }: ChatMessage) => (
                <React.Fragment key={id}>
                  {sentBy === User.AI ? (
                    <ReceiverMessage
                      like={like}
                      message={message}
                      messageJSON={messageJSON}
                      messageId={id}
                      chatId={currentChat.id}
                      rating={rating}
                    />
                  ) : (
                    <SenderMessage
                      message={message}
                      messageJSON={messageJSON}
                    />
                  )}
                </React.Fragment>
              )
            )
          ) : (
            <div className="h-full w-full flex items-center justify-center pt-20">
              &#9729; {EMPTY_STATE_MESSAGES[Math.floor(Math.random() * 10) + 1]}
            </div>
          )}
          {isLoading || loading ? (
            <div className="pt-5 pb-10">
              {" "}
              <Loader />{" "}
            </div>
          ) : null}
        </div>
        {showDownArrow && (
          <div
            onClick={() => scrollToBottom()}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer duration-200 scale-75 transition-opacity p-2 border border-black"
          >
            <FaArrowDown />
          </div>
        )}
      </div>
      {renderEditor()}
    </div>
  );
};

export default Chat;
