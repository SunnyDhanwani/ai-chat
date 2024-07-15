import React, { useState } from "react";
import LikePanel from "./LikePanel";
import { Like } from "../../types/enum";

interface ReceiverMessageProps {
    like: Like | null;
    message: string;
}

const ReceiverMessage = ({ like = null, message= "" }: ReceiverMessageProps) => {
  const [showActionButtons, setShowActionButtons] = useState(false);

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
      <div className="w-full bg-gray-200 rounded-t-xl rounded-r-xl py-3 px-4 whitespace-pre-line">
        {message}
      </div>
      {showActionButtons ? (
        <div className="absolute -top-1 left-2">
          <LikePanel like={Like.LIKE} />
        </div>
      ) : like !== null ? (
        <div className="absolute -top-1 left-2">
          <LikePanel like={Like.DISLIKE} showOnlyActiveAction={true} />
        </div>
      ) : null}
    </div>
  );
};

export default ReceiverMessage;
