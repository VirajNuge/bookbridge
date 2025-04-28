"use client";
import "./ProductPage.css";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../../../firebase-config/firebase-config";

interface BookProps {
  book: string;
  author: string;
  price: string;
  uploadedImages?: string[];
  uid: string; // Seller ID
  description: string;
  condition: string;
  isbnnumber: string;
  publisher: string;
  publishdate: string;
  pagescount: number;
  binding: string;
  tags?: string[];
}

interface SellerProps {
  fname: string;
  lname: string;
  location: string;
  contact: string;
  profilePicture?: string;
}

const ProductPage = () => {
  const { bid } = useParams(); // Get book ID from URL
  const router = useRouter();
  const [book, setBook] = useState<BookProps | null>(null);
  const [seller, setSeller] = useState<SellerProps | null>(null);
  const [mainImage, setMainImage] = useState("/product.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bid) {
      const fetchBookAndSeller = async () => {
        try {
          // Fetch Book Details
          const booksRef = collection(db, "books");
          const q = query(booksRef, where("bid", "==", bid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const bookData = querySnapshot.docs[0].data() as BookProps;
            setBook(bookData);
            setMainImage(bookData.uploadedImages?.[0] || "/product.png");

            // Fetch Seller Details
            if (bookData.uid) {
              const sellerRef = doc(db, "users", bookData.uid);
              const sellerSnap = await getDoc(sellerRef);
              if (sellerSnap.exists()) {
                setSeller(sellerSnap.data() as SellerProps);
              } else {
                console.error("No seller found");
              }
            }
          } else {
            console.error("No such book found");
          }
        } catch (error) {
          console.error("Error fetching book or seller:", error);
        }
        setLoading(false);
      };
      fetchBookAndSeller();
    }
  }, [bid]);

  // Handle "Chat with Seller" Button Click
  const handleChat = async () => {
    if (!auth.currentUser || !book?.uid) {
      alert("Please login to chat with the seller.");
      return;
    }

    const buyerId = auth.currentUser.uid;
    const sellerId = book.uid;
    const chatId = `${buyerId}_${sellerId}`;

    try {
      const chatRef = collection(db, "chats");
      const q = query(chatRef, where("chatId", "==", chatId));
      const existingChat = await getDocs(q);

      if (existingChat.empty) {
        await addDoc(chatRef, {
          chatId,
          buyerId,
          sellerId,
          lastMessage: "",
          lastMessageTime: Date.now(),
        });
      }

      router.push(`/pages/chats/${chatId}/ChatPage`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  if (loading) {
    return <p>Loading book details...</p>;
  }

  if (!book) {
    return <p>Book not found</p>;
  }

  return (
    <>
      <Header />
      <br />
      <div className="productinfo">
        {/* Book Image Gallery */}
        <div className="gallery-container">
          <div className="main-image-container">
            <img src={mainImage} alt="Main Product" className="main-image" />
          </div>
          <div className="thumbnail-container">
            {book.uploadedImages?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${mainImage === img ? "selected" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Book Details */}
        <div className="producttextcontainer">
          <h1 className="productheading">{book.book}</h1>
          <p className="productauthor">by {book.author}</p>
          <h3 className="productprice">Rs.{book.price}</h3>

          {/* Action Buttons */}
          <div className="prodbuttons">
            <button className="chatbutton" onClick={handleChat}>
              Chat With Seller
            </button>
            <img src="/heart.svg" alt="Favorite" />
            <img src="/share.svg" alt="Share" />
          </div>

          {/* Seller Details */}
          <div className="sellerdetailscontainer">
          <div
  className="sellerheading"
  onClick={() => seller && router.push(`/pages/seller/${book.uid}/SellerPage`)}
  style={{ cursor: "pointer" }}
>
  <h3>Seller Details</h3>
  <p>CHECK SELLER DETAILS</p>
</div>

            <div className="infoprod">
              <p>Name</p>
              <h3>{seller ? `${seller.fname} ${seller.lname}` : "N/A"}</h3>
            </div>
            <div className="infoprod">
              <p>Location</p>
              <h3>{seller ? seller.location : "N/A"}</h3>
            </div>
            <div className="infoprod">
              <p>Mobile</p>
              <h3>{seller ? seller.contact : "N/A"}</h3>
            </div>
          </div>

          <center>
            <a href="" className="reportprod">
              Report Ad
            </a>
          </center>
        </div>
      </div>

      {/* Book Information */}
      <div>
        <h3 className="prodheadings">Description</h3>
        <p>{book.description}</p>
      </div>

      <div>
        <h3 className="prodheadings">Book Condition</h3>
        <p>{book.condition}</p>
      </div>

      <div>
        <h3 className="prodheadings">Book Information</h3>
        <p>
          ISBN-13: {book.isbnnumber} <br />
          Publisher: {book.publisher} <br />
          Published Date: {book.publishdate} <br />
          Pages: {book.pagescount} <br />
          Binding: {book.binding}
        </p>
      </div>

      {/* Tags */}
      <div className="prodtags">
        <h3>Tags:</h3>
        {book.tags?.map((tag, index) => (
          <p key={index}>{tag}</p>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;
