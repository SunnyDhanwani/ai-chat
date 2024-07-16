import React, { useState } from "react";
import { Like } from "../../types/enum";
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../components/store/store";
import { updateLikeOfMessage } from "../../components/features/chat/chatSlice";

interface LikeMessageProps {
  like: Like | null;
  showOnlyActiveAction?: boolean;
  messageId: string;
  chatId: string;
}

const LikePanel = ({
  like = null,
  showOnlyActiveAction = false,
  messageId = "",
  chatId = ""
}: LikeMessageProps) => {
  const [hover, setHover] = useState<LikeMessageProps["like"]>(null);
  const dispatch: AppDispatch = useDispatch();

  const handleClick = (index: Like | null) => {    
    const updatedLike = like === index ? null : index;
    dispatch(updateLikeOfMessage({chatId, messageId, like: updatedLike}))
  };

  const handleMouseEnter = (index: Like) => {
    setHover(index); // Set the hover state based on the star hovered
  };

  const handleMouseLeave = () => {
    setHover(null); // Reset the hover state when the mouse leaves
  };  

  return (
    <div className={`flex gap-2 p-2 bg-gray-200/0 rounded-md`}>
      {showOnlyActiveAction ? (
        like === null ? (
          <></>
        ) : like === Like.LIKE ? (
          <FaThumbsUp className="cursor-pointer" />
        ) : (
          <FaThumbsDown className="cursor-pointer" />
        )
      ) : (
        <>
          {(like === Like.LIKE && hover === null) || hover === Like.LIKE ? (
            <FaThumbsUp
              className="cursor-pointer"
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(Like.LIKE)}
            />
          ) : (
            <FaRegThumbsUp
              className="cursor-pointer"
              onMouseEnter={() => handleMouseEnter(Like.LIKE)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(Like.LIKE)}
            />
          )}{" "}
          {(like === Like.DISLIKE && hover === null) ||
          hover === Like.DISLIKE ? (
            <FaThumbsDown
              className="cursor-pointer"
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(Like.DISLIKE)}
            />
          ) : (
            <FaRegThumbsDown
              onMouseEnter={() => handleMouseEnter(Like.DISLIKE)}
              onMouseLeave={handleMouseLeave}
              className="cursor-pointer"
              onClick={() => handleClick(Like.DISLIKE)}
            />
          )}{" "}
        </>
      )}
    </div>
  );
};

export default LikePanel;
