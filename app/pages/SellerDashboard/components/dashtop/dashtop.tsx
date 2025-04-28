import React from "react";
import "./dashtop.css";

interface DashtopProps {
  lclicks: number;
  response: number;
  listings: number;
  rating: number;
}

const Dashtop: React.FC<DashtopProps> = ({
  lclicks,
  response,
  listings,
  rating,
}) => {
  return (
    <div className="dashtopcontainer">
      
      <div className="dashelement">
        <div className="numbercircle">
          <h3>{response}%</h3>
        </div>
        <h2>RESPONSE RATE</h2>
      </div>
      <div className="dashelement">
        <div className="numbercircle">
          <h3>{listings}</h3>
        </div>
        <h2>TOTAL LISTINGS</h2>
      </div>
      <div className="dashelement">
        <div className="numbercircle">
          <h3>{rating}</h3>
        </div>
        <h2>SELLER RATING</h2>
      </div>
    </div>
  );
};

export default Dashtop;
