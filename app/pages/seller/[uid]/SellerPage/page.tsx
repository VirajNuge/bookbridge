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

const SellerPage = () => {
  const { uid } = useParams();
  const router = useRouter();
  const [sellerData, setSellerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const sellerId = uid ?? "";
  const [books, setBooks] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState("0.00");

  // ✅ Fetch Seller Data
  useEffect(() => {
    if (uid) {
      const fetchSellerData = async () => {
        console.log("Fetching seller data for UID:", uid);
        try {
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Seller data:", docSnap.data());
            setSellerData(docSnap.data());
          } else {
            console.log("No seller found with this UID!");
          }
        } catch (error) {
          console.error("Error fetching seller data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSellerData();
    }
  }, [uid]);

  // ✅ Fetch Seller Reviews & Calculate Average Rating
  useEffect(() => {
    if (uid) {
      const fetchReviews = async () => {
        try {
          console.log("Fetching reviews for seller UID:", uid);

          const q = query(
            collection(db, "reviews"),
            where("sellerId", "==", uid)
          );
          const querySnapshot = await getDocs(q);

          console.log("Query Snapshot Size (Reviews):", querySnapshot.size);

          if (querySnapshot.empty) {
            console.warn("No reviews found for this seller.");
            setReviews([]);
            setAverageRating("0.00");
            return;
          }

          let totalRating = 0;
          let reviewCount = 0;

          const reviewsData = querySnapshot.docs.map((doc) => {
            const reviewData = doc.data();
            const rating = reviewData.stars || 0; // ✅ Use `stars` instead of `rating`

            totalRating += rating;
            reviewCount += 1;

            return {
              id: doc.id,
              review: reviewData.review,
              rating: rating, // ✅ Use `stars` here
              name: reviewData.userName || "Anonymous",
              type: new Date(reviewData.timestamp?.toDate()).toLocaleString(),
            };
          });

          console.log("Fetched Reviews:", reviewsData);

          // ✅ Calculate the average rating using `stars`
          const avgRating =
            reviewCount > 0 ? (totalRating / reviewCount).toFixed(2) : "0.00";
          setAverageRating(avgRating);

          setReviews(reviewsData);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };

      fetchReviews();
    }
  }, [uid]);

  // ✅ Fetch Books Listed by Seller
  useEffect(() => {
    if (uid) {
      const fetchBooks = async () => {
        try {
          console.log("Fetching books for seller UID:", uid);

          const q = query(collection(db, "books"), where("uid", "==", uid));
          const querySnapshot = await getDocs(q);
          console.log("Query Snapshot Size:", querySnapshot.size);

          if (querySnapshot.empty) {
            console.warn("No books found for this seller.");
          } else {
            querySnapshot.docs.forEach((doc) =>
              console.log("Book Found:", doc.id, doc.data())
            );
          }

          const booksData = querySnapshot.docs.map((doc) => ({
            id: doc.data().bid, // ✅ Fetch `bid` instead of Firestore `doc.id`
            image: doc.data().uploadedImages?.[0] || "/default-book.jpg",
            heading: doc.data().book || "Unknown Book",
            price: doc.data().price || "Not Available",
            sellerUid: doc.data().uid,
          }));

          console.log("Fetched Books:", booksData);
          setBooks(booksData);
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      };

      fetchBooks();
    }
  }, [uid]);

  return (
    <>
      <Header />
      <br />
      {!loading && sellerData ? (
        <>
          <TopHeader
            pp={sellerData.profilepicture || "/default-profile.png"}
            sellerName={`${sellerData.fname || "Unknown"} ${
              sellerData.lname || ""
            }`}
            rating={averageRating} // ✅ Use calculated average rating
            location={sellerData.location || "Not provided"}
            joinDate={
              sellerData.joindata
                ? new Date(sellerData.joindata).toLocaleDateString()
                : "Not available"
            }
            contact={sellerData.contact || "Not available"}
            status={sellerData.Status || "Member"}
          />

          <br />
          <SellerStatus
            sales={1200}
            responseRate="98%"
            rating={averageRating} // ✅ Use calculated average rating
            listings={books.length}
            aboutMe={sellerData.aboutme || "No description available."}
          />
        </>
      ) : (
        <p>Loading seller details...</p>
      )}

      <br />
      <div>
        <div className="reviewheading">
          <h1 className="name">
            <div style={{ color: "#643887" }}>SELLER'S </div>
            <div style={{ color: "#F4AD0F" }}>REVIEWS</div>
          </h1>
          <button onClick={() => setReviewModalOpen(true)}>
            Review Seller
          </button>
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
        <h1 style={{ display: "flex" }} className="name">
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
                onClick={() => {
                  console.log(
                    "Navigating to:",
                    `/pages/${book.id}/ProductPage`
                  );
                  router.push(`/pages/${book.id}/ProductPage`);
                }}
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
