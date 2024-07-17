import { useParams, useSearchParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Chat as ChatTopic, ChatMessage } from "../../types/types";
import { User } from "../../types/enum";
import { decryptText, round5 } from "../../utils/helper";
import { debounce } from "lodash";
import { EMPTY_STATE_MESSAGES } from "../../utils/contants";
import { FaArrowDown, FaShareAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import ReceiverMessage from "../Chat/ReceiverMessage";
import SenderMessage from "../Chat/SenderMessage";

const SharedChat = () => {
  const pathParams = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<ChatTopic>({
    id: "",
    conversationEnded: true,
    messages: [],
    feedback: "",
    rating: -1,
  });
  const chatRef = useRef<HTMLDivElement>(null);
  const [showDownArrow, setShowDownArrow] = useState(false);

  useEffect(() => {
    const conversation = searchParams.get("conversation");
    if (conversation !== null) {
      const data = decryptText(`${conversation}`);
      setData(JSON.parse(data));
    }
  }, [searchParams]);

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

  const handleShareChat = () => {
    const sharedURL = window.location.href;

    navigator.clipboard.writeText(sharedURL).then(() => {
      toast.success(`URL Copied`);
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages?.length, pathParams.chatId]);

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
          {data?.messages && data?.messages.length > 0 ? (
            data?.messages.map(
              ({ id, sentBy, like, message, messageJSON }: ChatMessage) => (
                <React.Fragment key={id}>
                  {sentBy === User.AI ? (
                    <ReceiverMessage
                      like={like}
                      message={message}
                      messageJSON={messageJSON}
                      messageId={id}
                      chatId={data.id}
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
      <button
        className="w-max shrink-0 bg-gray-400 hover:bg-gray-500 p-3 rounded-md h-fit mx-auto mt-auto"
      >
        <strong>Shared Chat</strong>
      </button>
    </div>
  );
};

export default SharedChat;
