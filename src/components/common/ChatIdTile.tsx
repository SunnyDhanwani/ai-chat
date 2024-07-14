import React, { MouseEvent } from "react";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

interface ChatIdTileProps {
  id: string;
  initialMessage: string;
  isNewChatTile?: boolean;
}

const ChatIdTile = ({
  id = "",
  initialMessage = "",
  isNewChatTile = false,
}: ChatIdTileProps) => {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    let chatId = id;
    if (isNewChatTile) {
      chatId = uuid();
    }
    navigate(`/chat/${chatId}`);
  };
  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer rounded-md ${
        isNewChatTile
          ? "flex justify-center items-center gap-3 py-2 px-3 bg-blue-500 hover:bg-blue-600 font-bold text-white"
          : "bg-gray-300 hover:bg-gray-200 p-3"
      }`}
    >
      {isNewChatTile && <FaPen />}
      <div className="line-clamp-2">{initialMessage}</div>
    </div>
  );
};

export default ChatIdTile;
