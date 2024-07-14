import React, { useState } from "react";
import { Like } from "../../types/enum";
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";

interface LikeMessageProps {
  like: Like | null;
  showOnlyActiveAction?: boolean;
  component?: string;
}

const LikePanel = ({
  like = null,
  showOnlyActiveAction = false,
  component = "1",
}: LikeMessageProps) => {
  const [isLike, setIsLike] = useState(like); // State to hold the isLike
  const [hover, setHover] = useState<LikeMessageProps["like"]>(null);

  const handleClick = (index: Like | null) => {
    setIsLike((prev) => (prev === index ? null : index)); // Set the isLike based on the star clicked
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
        isLike === null ? (
          <></>
        ) : isLike === Like.LIKE ? (
          <FaThumbsUp className="cursor-pointer" />
        ) : (
          <FaThumbsDown className="cursor-pointer" />
        )
      ) : (
        <>
          {(isLike === Like.LIKE && hover === null) || hover === Like.LIKE ? (
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
          {(isLike === Like.DISLIKE && hover === null) ||
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
