"use client";
import "./homepage.css";
import React, { useEffect, useState } from "react";
import Category from "../../components/category/category";
import BookBox from "../../components/bookbox/bookbox";
import Review from "../../components/review/review";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config/firebase-config";
import Link from "next/link";

interface BookItem {
  id: string;
  bid: string;
  book: string;
  price: string;
  author: string;
  condition: string;
  uploadedImages: string[];
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  moderationStatus: string;
}

const Homepage = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksRef = collection(db, "books");
        const snapshot = await getDocs(booksRef);
        const booksData: BookItem[] = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as BookItem))
          .filter((book) => book.moderationStatus === "approved")
          .sort(
            (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
          );

        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <div className="HeroSection">
        <div className="hero1">
          <img src="/hero1.png" alt="hero" />
        </div>
        <div className="HeroRight">
          <div className="herotop">
            <center>
              <h1>50% OFF</h1>
              <h2>BROWSE USED BOOKS</h2>
              <h2>FOR THE BEST PRICE</h2>
            </center>
          </div>
          <div className="herobottom">
            <h1>SELL YOUR BOOKS</h1>
            <button>CONTINUE</button>
          </div>
        </div>
      </div>

      <div className="CategorySection">
        <h1 style={{ display: "flex" }} className="name">
          <div style={{ color: "#643887" }}>BROWSE BY </div>
          <div style={{ color: "#F4AD0F" }}>CATEGORY</div>
        </h1>
        <div className="CateLine">
          {[
            "Fiction",
            "Non-Fiction",
            "Science",
            "Mathematics",
            "Technology",
            "Literature",
            "Biography",
            "Philosophy",
            "History",
            "Art",
            "Psychology",
            "Self-Help",
            "Travel",
            "Poetry",
            "Romance",
            "Thriller",
            "Education",
            "Business",
            "Health",
            "Children",
            "Comics",
            "Religion",
            "Cooking",
            "Sports",
            "Fantasy",
          ].map((cat, i) => (
            <Category
              key={i}
              heading={cat}
              image="/fiction.svg"
              link={`/pages/BrowsePage?category=${encodeURIComponent(cat)}`}
            />
          ))}
        </div>
      </div>

      <div className="section3">
        <div className="ChooseUsSection">
          <img src="/booksimage.png" alt="why choose us" />
          <div className="chooseinfo">
            <h1 style={{ display: "flex" }}>
              <div style={{ color: "#643887" }}>WHY CHOOSE </div>
              <div style={{ color: "#F4AD0F" }}>US?</div>
            </h1>
            <div className="choosepointss">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div className="choosepoints" key={index}>
                    <div className="point">
                      <img src="/list.svg" alt="point" />
                      <div className="pointtext">
                        <p style={{ fontWeight: "bold" }}>MODERATE LISTING</p>
                        <p style={{ width: "400px", lineHeight: "20px" }}>
                          Every book is verified for quality and authenticity
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <section className="section4info">
        <div className="informationbox">
          <div className="information">
            <h1 className="heading">
              <span className="text-purple">HOW IT </span>
              <span className="text-yellow">WORKS?</span>
            </h1>
            <p className="process-text">
              <span className="text-purple">PROCESS TO FOLLOW </span>
              <br />
              <span className="text-yellow">
                TO EXCHANGE YOUR
                <br />
                BOOKS :)
              </span>
            </p>
          </div>
          <img
            src="/image2.png"
            alt="Book Exchange Process"
            className="info-image"
          />
        </div>
        <div className="HowtoPath">
          <div className="path1">
            <div className="pathbox">
              <h1>1</h1>
              <p>Search for a book or create a listing.</p>
            </div>
            <img src="/arrowright.png" alt="arrow" />
          </div>
          <div className="path2">
            <img src="/arrowleft.png" alt="arrow" />
            <div className="pathbox">
              <h1>2</h1>
              <p>Chat with buyers or sellers directly.</p>
            </div>
          </div>
          <div className="path3">
            <div className="pathbox">
              <h1>3</h1>
              <p>Confirm the deal and enjoy your book!</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h1 style={{ display: "flex" }} className="name">
          <div style={{ color: "#643887" }}>FEATURED&nbsp;</div>
          <div style={{ color: "#F4AD0F" }}>LISTING</div>
        </h1>
        <div className="booksboxsection">
          {books.map((book, index) => (
            <Link
              key={index}
              href={`/pages/${book.bid}/ProductPage`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <BookBox
                image={book.uploadedImages?.[0] || "/default.jpg"}
                heading={book.book}
                price={`Rs.${book.price}/=`}
                author={book.author}
                condition={book.condition}
              />
            </Link>
          ))}
        </div>
      </section>

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
    </>
  );
};

export default Homepage;
