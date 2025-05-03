"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../../firebase-config/firebase-config";

import "./SellerPage.css";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import TopHeader from "../../../../components/sellertopinfo/sellertopinfo";
import SellerStatus from "../../../../components/sellerstatus/sellerstatus";
import Review from "../../../../components/review/review";
import BookBox from "../../../../components/bookbox/bookbox";
import ReviewModal from "../../../../components/ReviewModal/ReviewModal";

type ReviewItem = {
  id: string;
  review: string;
  rating: number;
  name: string;
  type: string;
};

type BookItem = {
  id: string;
  image: string;
  heading: string;
  price: string;
  sellerUid: string;
  author: string;
  condition: string;
};

const SellerPage = () => {
  const { uid } = useParams();
  const router = useRouter();
  const [sellerData, setSellerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  const sellerId = typeof uid === "string" ? uid : uid?.[0] || "";

  // ✅ Fetch Seller Data
  useEffect(() => {
    if (sellerId) {
      const fetchSellerData = async () => {
        try {
          const docRef = doc(db, "users", sellerId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setSellerData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching seller data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSellerData();
    }
  }, [sellerId]);

  // ✅ Fetch Reviews & Calculate Average Rating
  useEffect(() => {
    if (sellerId) {
      const fetchReviews = async () => {
        try {
          const q = query(
            collection(db, "reviews"),
            where("sellerId", "==", sellerId)
          );
          const querySnapshot = await getDocs(q);

          let totalRating = 0;
          const reviewsData: ReviewItem[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const rating = data.stars || 0;
            totalRating += rating;
            return {
              id: doc.id,
              review: data.review,
              rating,
              name: data.userName || "Anonymous",
              type: new Date(data.timestamp?.toDate()).toLocaleString(),
            };
          });

          setAverageRating(
            reviewsData.length > 0
              ? parseFloat((totalRating / reviewsData.length).toFixed(2))
              : 0
          );
          setReviews(reviewsData);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };

      fetchReviews();
    }
  }, [sellerId]);

  // ✅ Fetch Books Listed by Seller
  useEffect(() => {
    if (sellerId) {
      const fetchBooks = async () => {
        try {
          const q = query(collection(db, "books"), where("uid", "==", sellerId));
          const querySnapshot = await getDocs(q);

          const booksData: BookItem[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: data.bid,
              image: data.uploadedImages?.[0] || "/default-book.jpg",
              heading: data.book || "Untitled",
              price: data.price || "N/A",
              sellerUid: data.uid,
              author: data.author || "Unknown",
              condition: data.condition || "Good",
            };
          });

          setBooks(booksData);
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      };

      fetchBooks();
    }
  }, [sellerId]);

  return (
    <>
      <Header />
      {!loading && sellerData ? (
        <>
          <TopHeader
            pp={sellerData.profilepicture || "/default-profile.png"}
            sellerName={`${sellerData.fname || "Unknown"} ${sellerData.lname || ""}`}
            rating={averageRating}
            location={sellerData.location || "Not provided"}
            joinDate={
              sellerData.joindata
                ? new Date(sellerData.joindata).toLocaleDateString()
                : "Not available"
            }
            contact={sellerData.contact || "Not available"}
            status={sellerData.Status || "Member"}
          />

          <SellerStatus
            sales={1200}
            responseRate="98%"
            rating={averageRating}
            listings={books.length}
            aboutMe={sellerData.aboutme || "No description available."}
          />
        </>
      ) : (
        <p>Loading seller details...</p>
      )}

      <div>
        <div className="reviewheading">
          <h1 className="name">
            <div style={{ color: "#643887" }}>SELLER'S&nbsp;</div>
            <div style={{ color: "#F4AD0F" }}>REVIEWS</div>
          </h1>
          <button onClick={() => setReviewModalOpen(true)}>Review Seller</button>
        </div>

        {isReviewModalOpen && (
          <ReviewModal
            sellerId={sellerId}
            onClose={() => setReviewModalOpen(false)}
          />
        )}

        <div className="AllReviewsContainer">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Review
                key={index}
                review={review.review}
                name={review.name}
                type={review.type}
              />
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>

      <section>
        <h1 className="name" style={{ display: "flex" }}>
          <div style={{ color: "#643887" }}>FEATURED&nbsp;</div>
          <div style={{ color: "#F4AD0F" }}>LISTING</div>
        </h1>
        <div className="booksboxsection">
          {books.length > 0 ? (
            books.map((book) => (
              <BookBox
                key={book.id}
                image={book.image}
                heading={book.heading}
                price={book.price}
                author={book.author}
                condition={book.condition}
                onClick={() => router.push(`/pages/${book.id}/ProductPage`)}
              />
            ))
          ) : (
            <p>No books listed yet.</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SellerPage;
