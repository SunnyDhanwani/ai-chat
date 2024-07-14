import { useState } from "react";
import style from "./StarRating.module.css";

const StarRating = ({ defaultRating = 0 }) => {
  const [rating, setRating] = useState(defaultRating); // State to hold the rating
  const [hover, setHover] = useState(0); // State to hold the current hover state

  const handleClick = (index: number) => {
    setRating(index + 1); // Set the rating based on the star clicked
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
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
