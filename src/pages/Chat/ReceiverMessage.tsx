import React, { useState } from "react";
import LikePanel from "./LikePanel";
import { Like } from "../../types/enum";
import { generateHTMLFromJSON } from "../../utils/helper";
import { JSONContent } from "@tiptap/react";
import "./RichTextEditor.css";
import StarRating from "./StarRating";
interface ReceiverMessageProps {
  like: Like | null;
  message: string;
  messageJSON: JSONContent;
  messageId: string;
  chatId: string;
  rating?: number;
}

const ReceiverMessage = ({
  chatId = "",
  messageId = "",
  like = null,
  message = "",
  messageJSON = {},
  rating = -1,
}: ReceiverMessageProps) => {
  const [showActionButtons, setShowActionButtons] = useState(false);
  const __html = generateHTMLFromJSON(messageJSON);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rating === -1) setShowActionButtons(true);
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
      {rating === -1 ? (
        <div
          className="w-full bg-gray-200 rounded-t-xl rounded-r-xl py-3 px-4 whitespace-pre-line tiptap"
          dangerouslySetInnerHTML={{ __html }}
        ></div>
      ) : (
        <div className="w-full bg-gray-200 rounded-t-xl rounded-r-xl py-3 px-4 whitespace-pre-line">
          <div dangerouslySetInnerHTML={{ __html }}></div>
          <StarRating defaultRating={rating} chatId={chatId} messageId={messageId} />
        </div>
      )}
      {showActionButtons && rating === -1 ? (
        <div className={`absolute -top-1 left-2`}>
          <LikePanel like={like} chatId={chatId} messageId={messageId} />
        </div>
      ) : like !== null && rating === -1 ? (
        <div className={`absolute -top-1 left-2`}>
          <LikePanel
            like={like}
            chatId={chatId}
            messageId={messageId}
            showOnlyActiveAction={true}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ReceiverMessage;
