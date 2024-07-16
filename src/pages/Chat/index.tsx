import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { useNavigate, useParams } from "react-router-dom";
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

const Chat = () => {
  const pathParams = useParams();
  const navigate = useNavigate();
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
    scrollToBottom();
  }, [data, pathParams.chatId]);

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

  return (
    <div className="relative p-4 pr-0 h-full max-w-full flex flex-col justify-between">
      <div
        className="max-h-full pr-4 mb-4 overflow-x-clip overflow-y-auto custom-scrollbar break-all text-black"
        ref={chatRef}
      >
        <div className="max-w-[50vw] mx-auto flex flex-col gap-3 pb-20">
          {currentChat?.messages.map(
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
                  <SenderMessage message={message} messageJSON={messageJSON} />
                )}
              </React.Fragment>
            )
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
          <button className="w-max shrink-0 bg-gray-400 hover:bg-gray-500 px-3 py-2 rounded-md h-fit">
            <strong>End chat</strong>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
