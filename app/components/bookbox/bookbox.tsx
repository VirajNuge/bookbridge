import "./bookbox.css";
import React from "react";

// Define the expected props type
type BookBoxProps = {
  image: string;
  heading: string;
  price: string;
  author: string;
  condition: string;
  onClick?: () => void;

};

const BookBox: React.FC<BookBoxProps> = (props) => {
  return (
    <div className="BookContainer">
      <div className="imageBox">
        <img src={props.image} alt={props.heading} />
      </div>
      <h1>{props.heading}</h1>
      <p>{props.price}</p>
      <button onClick={props.onClick} style={{ cursor: "pointer" }}>
        CHECK LISTING
      </button>
    </div>
  );
};

export default BookBox;
