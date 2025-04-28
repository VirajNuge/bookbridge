import React from "react";
import "./sellertopinfo.css";

// Define the props interface
interface SellerTopInfoProps {
  sellerName: string;
  rating: number;
  location: string;
  joinDate: string;
  contact: string;
  status: string;
  pp: string;
}

const SellerTopInfo: React.FC<SellerTopInfoProps> = ({
  sellerName,
  rating,
  location,
  joinDate,
  contact,
  status,
  pp,
}) => {
  return (
    <>
      <div className="sellerpagetopcontainer">
        <img src={pp} className="sellerimage" alt="Seller" />
        <div className="sellerallinfo">
          <div>
            <div className="sellerheader">
              <h3>Seller Name</h3>
              <img src="/star.svg" alt="Rating" />
              <p>{rating} RATING</p>
            </div>
            <h1 className="sellername">{sellerName}</h1>
          </div>
          <div className="infocontainer">
            <div>
              <div className="sellerpoint">
                <h5>Location</h5>
                <h2>{location}</h2>
              </div>
              <div className="sellerpoint">
                <h5>Join Date</h5>
                <h2>{joinDate}</h2>
              </div>
            </div>
            <div>
              <div className="sellerpoint">
                <h5>Contact</h5>
                <h2>{contact}</h2>
              </div>
              <div className="sellerpoint">
                <h5>Status</h5>
                <h2>{status}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerTopInfo;
