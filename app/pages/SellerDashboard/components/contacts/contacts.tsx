import React from "react";
import "./contacts.css";

interface ContactProps {
  image: string;
  name: string;
  linkTo: string;
}

const ContactCard: React.FC<ContactProps> = ({ image, name, linkTo }) => {
  return (
    <a href={linkTo} className="contactCardLink">
      <div className="contactContainer">
        <img
          src={image}
          alt={name}
          onError={(e) => {
            e.currentTarget.src = "/default-profile.png";
          }}
        />
        <div className="contactName">{name}</div>
      </div>
    </a>
  );
};

export default ContactCard;
