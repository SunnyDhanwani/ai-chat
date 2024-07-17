import { useState } from "react";
import style from "./StarRating.module.css";
import { FaStar } from "react-icons/fa";
import { AppDispatch } from "../../components/store/store";
import { useDispatch } from "react-redux";
import { updateRatingeOfMessage } from "../../components/features/chat/chatSlice";

const StarRating = ({
  defaultRating = 0,
  chatId = "",
  messageId = "",
}: {
  defaultRating: number;
  chatId: string;
  messageId: string;
}) => {
  const [rating, setRating] = useState(defaultRating); // State to hold the rating
  const [hover, setHover] = useState(0); // State to hold the current hover state
  const dispatch: AppDispatch = useDispatch();

  const handleClick = (index: number) => {
    setRating(index + 1); // Set the rating based on the star clicked
    dispatch(updateRatingeOfMessage({ chatId, messageId, rating: index+1 }));
  };

  const handleMouseEnter = (index: number) => {
    setHover(index + 1); // Set the hover state based on the star hovered
  };

  const handleMouseLeave = () => {
    setHover(0); // Reset the hover state when the mouse leaves
  };

  return (
    <div className={`${style.starRating}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <button
          key={index}
          type="button"
          className={`${style.star} ${
            index < (hover || rating) ? style.selected : ""
          }`}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
