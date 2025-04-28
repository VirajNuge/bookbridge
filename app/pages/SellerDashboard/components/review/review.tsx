import React from "react";
import "./review.css";

interface ReviewProps {
  rating: number;
  text: string;
  reviewer: string;
  onDelete?: () => void; // optional delete handler
}

const Review: React.FC<ReviewProps> = ({ rating, text, reviewer, onDelete }) => {
  return (
    <div className="reviewscontainerdash">
      <div className="reviewtextcontainer">
        <div className="starthing">
        <p className="starcount">{rating}</p>
        <img src="/star.svg" />
        </div>
        <p className="reviewdash">{text}</p>
        <p className="reviewer">{reviewer}</p>
      </div>
      <div className="delbuttondash">
        <button onClick={onDelete}>Delete Review</button>
      </div>
    </div>
  );
};

export default Review;
