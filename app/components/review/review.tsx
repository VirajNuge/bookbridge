import "./review.css";
import React from "react";

interface ReviewProps {
  review: string;
  name: string;
  type: string;
}

const Review: React.FC<ReviewProps> = ({ review, name, type }) => {
  return (
    <div className="reviewContainer">
      <div className="Stars">
        <p>★★★★★</p>
      </div>
      <div className="reviewText">
        <p>{review}</p>
        <h3>-{name}</h3>
        <h6>{type}</h6>
      </div>
    </div>
  );
};

export default Review;
