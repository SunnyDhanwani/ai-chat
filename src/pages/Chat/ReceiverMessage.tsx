import React, { useState } from "react";
import LikePanel from "./LikePanel";
import { Like } from "../../types/enum";
import { generateHTMLFromJSON } from "../../utils/helper";
import { JSONContent } from "@tiptap/react";
import "./RichTextEditor.css";
interface ReceiverMessageProps {
  like: Like | null;
  message: string;
  messageJSON: JSONContent;
  messageId: string;
  chatId: string;
}

const ReceiverMessage = ({
  chatId = "",
  messageId = "",
  like = null,
  message = "",
  messageJSON = {},
}: ReceiverMessageProps) => {
  const [showActionButtons, setShowActionButtons] = useState(false);
  const __html = generateHTMLFromJSON(messageJSON);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowActionButtons(true);
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowActionButtons(false);
  };

  return (
    <div
      className="relative pt-2 w-full max-w-[80%]"
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
    >
      <div
        className="w-full bg-gray-200 rounded-t-xl rounded-r-xl py-3 px-4 whitespace-pre-line tiptap"
        dangerouslySetInnerHTML={{ __html }}
      ></div>
      {showActionButtons ? (
        <div className="absolute -top-1 left-2">
          <LikePanel like={like} chatId={chatId} messageId={messageId} />
        </div>
      ) : like !== null ? (
        <div className="absolute -top-1 left-2">
          <LikePanel like={like} chatId={chatId} messageId={messageId} showOnlyActiveAction={true} />
        </div>
      ) : null}
    </div>
  );
};

export default ReceiverMessage;
