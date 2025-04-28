import React from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./contactus.css";

const ContactPage = () => {
  return (
    <>
      <div className="header">
        <Header />
      </div>
      <br />

      <div className="contactuscontainer">
        <div className="page-container">
          <div className="background">
            <Image
              src="/logo (2).png"
              alt="BookBridge Logo"
              width={150}
              height={50}
              className="logo"
            />

            <div className="contact-text">
              <h1>CONTACT US</h1>
              <p>
                Connecting Book Lovers,
                <br />
                One Page at a Time
              </p>
            </div>
          </div>

          <div className="contact-container">
            <div className="mobile-box">
              <Image
                src="/call.png"
                alt="Mobile Icon"
                width={50}
                height={50}
                className="icon"
              />
              <h2>MOBILE</h2>
              <p>contact@bookbridge.com</p>
              <p>+94 74 370 3311</p>
            </div>
            <div className="location-box">
              <Image
                src="/location.png"
                alt="Location Icon"
                width={50}
                height={50}
                className="icon"
              />
              <h2>LOCATION</h2>
              <p>A/26/A, Gonakumbura,</p>
              <p>Ratnapura</p>
            </div>
            <div className="social-box">
              <Image
                src="/call.png"
                alt="Social Icon"
                width={50}
                height={50}
                className="icon"
              />
              <h2>SOCIAL</h2>
              <p>Follow on Social Media</p>
              <div className="social-icons">
                <Image
                  src="/youtube.png"
                  alt="YouTube"
                  width={30}
                  height={30}
                />
                <Image
                  src="/instagram.png"
                  alt="Instagram"
                  width={30}
                  height={30}
                />
                <Image
                  src="/facebook.png"
                  alt="Facebook"
                  width={30}
                  height={30}
                />
                <Image
                  src="/twitter.png"
                  alt="Twitter"
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </div>

          <section className="form-section">
            <h2>Send a message</h2>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" required />
                </div>
                <div className="formGroup">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" required />
                </div>
              </div>
              <div className="formRow">
                <div className="formGroup">
                  <label htmlFor="mobile">Mobile</label>
                  <input type="tel" id="mobile" required />
                </div>
                <div className="formGroup">
                  <label htmlFor="company">Company</label>
                  <input type="text" id="company" />
                </div>
              </div>
              <div className="form-group-full-width">
                <label htmlFor="message">Enter Message</label>
                <textarea id="message" required></textarea>
              </div>
              <div className="formGroupFullWidth">
                <button type="submit">Submit</button>
              </div>
            </form>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
