import React from "react";
import "./loadingscreen.css";

const loadingscreen = () => {
  return (
    <>
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    </>
  );
};

export default loadingscreen;
