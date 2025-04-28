import React from "react";
import "./footer.css";

const footer = () => {
  return (
    <>
      <div className="FooterContainer">
        <div className="BookInfo">
          <img src="/logo.png" alt="Logoo" className="logoo"></img>
          <p className="about">
            Book Bridge is your trusted online marketplace for buying and
            selling pre-loved books. Join our community of readers and give
            books a second life while finding affordable reads.
          </p>
          <p className="contactf">
            <b style={{ color: "#F4AD0F" }}>Email:</b> support@bookbridge.com
            <br />
            <b style={{ color: "#F4AD0F" }}>Phone:</b> +1-800-BOOK-123
            <br />
            <b style={{ color: "#F4AD0F" }}>Address:</b> 123 Book Lane, Reader’s
            City, CA, USA
            <br />
          </p>

          <p className="reserve">All rights reserved @bookbridge 2024</p>
        </div>

        <div className="Links">
          <h5 style={{ color: "#F4AD0F" }}>Quick Links</h5>
          <ul>
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="">Browse Books</a>
            </li>
            <li>
              <a href="">Sell Books</a>
            </li>
            <li>
              <a href="">Wishlist</a>
            </li>
            <li>
              <a href="">FAQ</a>
            </li>
            <li>
              <a href="">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="SocialMedia">
          <center>
            <h1>FOLLOW US</h1>
            <h1>SOCIAL MEDIA</h1>
          </center>
          <center>
            <span className="iconsfooter">
              <a href="">
                <img src="/fb.svg"></img>
              </a>
              <a href="">
                <img src="/insta.svg"></img>
              </a>
              <a href="">
                <img src="/twi.svg"></img>
              </a>
              <a href="">
                <img src="/yt.svg"></img>
              </a>
            </span>
          </center>
        </div>
      </div>
    </>
  );
};

export default footer;
