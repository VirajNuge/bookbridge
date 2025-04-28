"use client";
import React, { useState} from 'react';
import './aboutus.css';
import Image from "next/image";
import MenuBar from '../../components/header/header';
import Footer from '../../components/footer/footer'
import Review from "../../components/review/review";
const aboutus = () => {

  const [reviews, setReviews] = useState([
      {
        review:
          "I love how easy it was to find the books I needed for my college classes. The filters helped me narrow down my search quickly, and I got them at half the price of new ones!",
        name: "Sarah K.",
        type: "(buyer)",
      },
      {
        review: "Great experience selling my books here. Super easy and fast!",
        name: "David R.",
        type: "(seller)",
      },
      {
        review:
          "I love how easy it was to find the books I needed for my college classes. The filters helped me narrow down my search quickly, and I got them at half the price of new ones!",
        name: "Sarah K.",
        type: "(buyer)",
      },
      {
        review: "Great experience selling my books here. Super easy and fast!",
        name: "David R.",
        type: "(seller)",
      },
    ]);

  return (
    <>
      <div>
        <MenuBar />
        <br />
        <div>
          <div className="background">
            <Image
              src="/logo (2).png"
              alt="BookBridge Logo"
              width={150}
              height={50}
              className="logo"
            />

            <div className="contact-text">
              <h1>About US</h1>
              <p>
                Connecting Book Lovers,
                <br />
                One Page at a Time
              </p>
            </div>
          </div>
          <div className='mvcontainer'>
            <div className='vissioncontainer'>
              <h1>VISION</h1>
              <p>At Book Bridge, we envision a world where every book finds a new reader and every reader finds a book they cherish. We aim to promote a culture of sustainability, affordability, and accessibility in the world of books.</p>
            </div>
            <div className='missioncontainer'>
              <h1>MISSION</h1>
              <p>Our mission is to create a seamless, trustworthy, and community-driven marketplace that bridges the gap between book buyers and sellers. We strive to empower readers to rediscover the joy of reading while giving pre-loved books a second life.</p>
            </div>
          </div>

          <div className='aboutsection1'>
            <img src='/about1.png' />
            <div className='aboutsection1text'>
              <h5>WHO ARE WE?</h5>
              <p>Book Bridge is more than just a marketplace; it’s a community of book enthusiasts united by their love for stories, knowledge, and learning. We understand the struggles of finding affordable books or selling used ones, and we’re here to make that process as smooth as turning the pages of your favorite novel.</p>
            </div>
          </div>

          <div className='aboutsection3'>
            <div className='aboutsection3text'>
              <h5>WHAT WE OFFER..</h5>
              <p><ul><li>For Buyers: Advanced search filters, wishlist tracking, price alerts, and secure communication with sellers to negotiate the best deals.</li><br />

              <li>For Sellers: Analytics to optimize pricing, a rating system to build trust, and moderation services to ensure safe transactions.</li><br />

              <li>For Everyone: A trustworthy, book-centric community where quality reads meet reasonable prices.</li></ul></p>
            </div>
          </div>

          <div className='aboutsection2'>

            <div className='aboutsection2text'>
              <h5>WHY CHOOSE US?</h5>
              <p>
                <ul><li>Affordable Prices: Find great books without breaking the bank.</li>

                  <li>Transparent & Secure: Moderated listings and a rating system ensure safe transactions.</li>

                  <li>Smart Selling Tools: Analytics and insights help sellers get the best value for their books.</li>

                  <li>Sustainability: Give your books a second life and contribute to reducing waste.</li></ul></p>
            </div>
            <img src='/respa.png' />
          </div>

          <section className="ReviewsBox">
        <div>
          <h1 className="headingreview">
            <div style={{ color: "#643887" }}>
              SEE WHAT OUR <br />
            </div>
            <div style={{ color: "#F4AD0F" }}>
              BUYERS & SELLERS <br />
            </div>
            <div style={{ color: "#F4AD0F" }}>SAY....</div>
          </h1>
          <img src="/review.png" alt="reviews" />
        </div>
        <div className="AllReviewsContainer">
          {reviews.map((review, index) => (
            <Review
              key={index}
              review={review.review}
              name={review.name}
              type={review.type}
            />
          ))}
        </div>
      </section>

        </div>
        <Footer />
      </div>
    </>
  );
}

export default aboutus;
