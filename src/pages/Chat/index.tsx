import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/store/store";
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Chat as ChatTopic, ChatMessage } from "../../types/types";
import { v4 as uuid } from "uuid";
import { User } from "../../types/enum";
import { addMessageToChatId } from "../../components/features/chat/chatSlice";
import {
  decryptText,
  encryptText,
  generateHTMLFromJSON,
  generateTextFromJSON,
  messageTemplateFormatter,
  round5,
} from "../../utils/helper";
import { debounce } from "lodash";
import { useGetAssistantResponseMutation } from "../../components/features/chat/chatApi";
import Loader from "./Loader";
import RichTextEditor from "./RichTextEditor";
import { Editor, JSONContent } from "@tiptap/react";
import { EMPTY_STATE_MESSAGES } from "../../utils/contants";
import { FaShare, FaShareAlt, FaShareAltSquare } from "react-icons/fa";
import { toast } from "react-toastify";

const Chat = () => {
  const pathParams = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.chat);
  const chatRef = useRef<HTMLDivElement>(null);
  const [showDownArrow, setShowDownArrow] = useState(false);
  const [getAssistantResponse, { isLoading }] =
    useGetAssistantResponseMutation();

  const handleSendEditorMessage = async (
    editor: Editor | null,
    currentChatId: string
  ) => {
    const userMessageJSON: JSONContent | undefined = editor?.getJSON();

    if (
      !userMessageJSON ||
      !userMessageJSON?.content ||
      !generateTextFromJSON(userMessageJSON) ||
      isLoading
    )
      return;

    const chatId = currentChatId || pathParams.chatId;

    if (!chatId) {
      const newChatId = uuid();
      const newMessage = messageTemplateFormatter(userMessageJSON, User.USER);
      dispatch(addMessageToChatId({ message: newMessage, chatId: newChatId }));
      const response = await getAssistantResponse({
        query: userMessageJSON,
      }).unwrap();
      dispatch(addMessageToChatId({ message: response, chatId: newChatId }));

      navigate(`/chat/${newChatId}`, {
        replace: true,
        preventScrollReset: true,
      });
    } else {
      const newMessage = messageTemplateFormatter(userMessageJSON, User.USER);
      dispatch(addMessageToChatId({ message: newMessage, chatId }));
      const response = await getAssistantResponse({
        query: userMessageJSON,
      }).unwrap();
      dispatch(addMessageToChatId({ message: response, chatId }));
    }
  };

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

  const handleEndChat = () => {
    const json = JSON.stringify(currentChat);
    const encrypt = encryptText(json);
  };

  const handleShareChat = () => {
    const json = JSON.stringify(currentChat);
    const encrypt = encryptText(json);
    const sharedURL = window.location.origin + "/shared-chat?conversation=" + encrypt;    

    if (sharedURL.length < 2023) {
      navigator.clipboard.writeText(sharedURL).then(() => {
        toast.success(`URL Copied ${sharedURL.length}`);
      });
    } else {
      toast.error(`This chat is too lengthy to share due to frontend restrictions. Please keep it short.`, {autoClose: 10000});
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages?.length, pathParams.chatId]);

  return (
    <div className="relative p-4 pr-0 h-full max-w-full flex flex-col justify-between">
      <button
        className="bg-blue-500/50 hover:bg-blue-500 rounded-md absolute p-3 text-white transition-all duration-300"
        onClick={() => handleShareChat()}
      >
        <FaShareAlt />
      </button>
      <div
        className="h-full pr-4 mb-4 overflow-x-clip overflow-y-auto custom-scrollbar break-all text-black"
        ref={chatRef}
      >
        <div className="max-w-[50vw] mx-auto flex flex-col gap-3 pb-20 h-full">
          {currentChat?.messages && currentChat?.messages.length > 0 ? (
            currentChat?.messages.map(
              ({ id, sentBy, like, message, messageJSON }: ChatMessage) => (
                <React.Fragment key={id}>
                  {sentBy === User.AI ? (
                    <ReceiverMessage
                      like={like}
                      message={message}
                      messageJSON={messageJSON}
                      messageId={id}
                      chatId={currentChat.id}
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
          {isLoading ? <Loader /> : null}
        </div>
        {showDownArrow && (
          <div>
            <img
              className="absolute rotate-180 bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer duration-200 scale-75 transition-opacity"
              src="/icons/send-arrow.svg"
              alt="Scroll to bottom"
              onClick={() => scrollToBottom()}
            />
          </div>
        )}
      </div>
      <div className="max-w-[50vw] w-full mx-auto pr-4">
        <div className="flex min-w-full gap-4 items-end">
          <form className="w-full relative">
            <RichTextEditor handleSubmit={handleSendEditorMessage} />

            <button
              type="submit"
              onClick={() => {}}
              className="absolute bottom-1/2 translate-y-1/2 right-2"
            >
              <img
                className="rounded-md bg-gray-400 hover:bg-gray-500 cursor-pointer transition duration-200"
                src="/icons/send-arrow.svg"
                alt="Send message"
              />
            </button>
          </form>
          <button
            className="w-max shrink-0 bg-gray-400 hover:bg-gray-500 p-3 rounded-md h-fit"
            onClick={() => handleEndChat()}
          >
            <strong>End chat</strong>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
