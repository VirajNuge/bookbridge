import React from "react";
import "./sellerstatus.css";

// Define the props interface
interface SellerStatusProps {
  sales: number;
  responseRate: string;
  rating: number;
  listings: number;
  aboutMe: string;
}

const SellerStatus: React.FC<SellerStatusProps> = ({
  sales,
  responseRate,
  rating,
  listings,
  aboutMe,
}) => {
  return (
    <>
      <div className="statuscontainer">
        <div className="statuselement">
          <div className="elementcircle">
            <img src="/book.png" alt="Sales" />
          </div>
          <div className="statustext">
            <p className="text1">{sales}</p>
            <p className="text2">SALES</p>
          </div>
        </div>
        <div className="statuselement">
          <div className="elementcircle">
            <img src="/dialog.png" alt="Response Rate" />
          </div>
          <div className="statustext">
            <p className="text1">{responseRate}</p>
            <p className="text2">RESPONSE RATE</p>
          </div>
        </div>
        <div className="statuselement">
          <div className="elementcircle">
            <img src="/star.svg" alt="Rating" />
          </div>
          <div className="statustext">
            <p className="text1">{rating}</p>
            <p className="text2">RATING</p>
          </div>
        </div>
        <div className="statuselement">
          <div className="elementcircle">
            <img src="/star.svg" alt="Listings" />
          </div>
          <div className="statustext">
            <p className="text1">{listings}</p>
            <p className="text2">LISTINGS</p>
          </div>
        </div>
      </div>
      <div className="aboutmecontainer">
        <h2>About Me</h2>
        <p>{aboutMe}</p>
      </div>
    </>
  );
};

export default SellerStatus;
