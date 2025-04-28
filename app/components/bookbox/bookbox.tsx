import "./bookbox.css";

import React from "react";

const bookbox = (props) => {
  return (
    <>
      <div className="BookContainer">
        <div className="imageBox">
          <img src={props.image}></img>
        </div>
        <h1>{props.heading}</h1>
        <p>{props.price}</p>
        <button onClick={props.onClick} style={{ cursor: "pointer" }}>
          CHECK LISTING
        </button>
      </div>
    </>
  );
};

export default bookbox;
