"use client";
import React from "react";
import "./user.css";

interface UserProps {
  name: string;
  profileImage: string;
  moderationStatus: string;
  onViewSeller: () => void;
  onSuspendSeller: () => void;
  onUnsuspendSeller: () => void;
}

const User: React.FC<UserProps> = ({
  name,
  profileImage,
  moderationStatus,
  onViewSeller,
  onSuspendSeller,
  onUnsuspendSeller,
}) => {
  return (
    <div className="userContainer">
      <img src={profileImage} alt="User Profile" />
      <div>
        <h3>{name}</h3>
        <button className="sellerbutton" onClick={onViewSeller}>
          View Seller Page
        </button>
      </div>
      <div className="buttons">
        <div className="approvebuttons">
          {/* Show "Suspend Seller" only if the user is not suspended */}
          {moderationStatus !== "suspended" && (
            <button className="wrong" onClick={onSuspendSeller}>
              Suspend Seller
            </button>
          )}

          {/* Show "Unsuspend Seller" only if the user is suspended */}
          {moderationStatus === "suspended" && (
            <button className="right" onClick={onUnsuspendSeller}>
              Unsuspend Seller
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
