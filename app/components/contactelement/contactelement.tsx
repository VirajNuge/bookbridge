import React from "react";
import "./contactelement.css";

interface ContactProps {
  name: string;
  profilePic: string;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  onClick?: () => void;
}

const ContactElement: React.FC<ContactProps> = ({
  name,
  profilePic,
  isOnline,
  lastMessage,
  lastMessageTime,
  onClick,
}) => {
  return (
    <div className="singlecontact" onClick={onClick}>
      <img src={profilePic} alt="Profile" />
      <div className="contacttext">
        <div className="toprow">
          <h3>{name}</h3>
          {lastMessageTime && <span className="time">{lastMessageTime}</span>}
        </div>
        <div className="bottomrow">
          <p className="lastmessage">
            {lastMessage?.startsWith("[Image]") ? "[Image]" : lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactElement;
