"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config/firebase-config"; // Ensure correct path
import { useAuth } from "../../context/authContext"; // Ensure correct import
import "./ReviewModal.css";

interface ReviewModalProps {
  sellerId: string;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ sellerId, onClose }) => {
  const { user } = useAuth(); // Get authenticated user
  const [rating, setRating] = useState<number>(1);
  const [reviewText, setReviewText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [reviewerName, setReviewerName] = useState<string>("");


  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to submit a review.");
      return;
    }

    if (reviewText.trim() === "") {
      setError("Review cannot be empty.");
      return;
    }

    try {
      // Store review directly under "reviews" collection
      await addDoc(collection(db, "reviews"), {
        sellerId: sellerId,
        uid: user.uid,
        userName: reviewerName, // ✅ Added this line
        review: reviewText,
        stars: rating,
        timestamp: new Date(),
      });
      

      alert("Review submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="review-modal">
      <div className="modal-content">
        <h2>Review Seller</h2>
        {error && <p className="error-message">{error}</p>}

        <label>Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Stars
            </option>
          ))}
        </select>

        <label>Review:</label>
        <textarea
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <label>Your Name:</label>
<input
  type="text"
  value={reviewerName}
  onChange={(e) => setReviewerName(e.target.value)}
  placeholder="Enter your name"
/>


        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
