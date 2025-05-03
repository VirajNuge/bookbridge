"use client";

import React, { useEffect, useState } from "react";
import "./NewListings.css";
import TopMenu from "../../components/topmenu/topmenu";
import SideMenu from "../../components/sidemenu/sidemenu";
import { db } from "../../../../firebase-config/firebase-config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import Listing from "../../components/lisitng/listing";

// Define TypeScript interfaces
interface BookListing {
  id: string;
  title: string;
  author: string;
  price: string;
  sellerUid: string;
  bid: boolean;
  createdAt: Date;
  imageUrl: string;
  moderationStatus: "pending" | "approved" | "rejected";
}

interface SellerNames {
  [key: string]: string;
}

const AllListings: React.FC = () => {
  const [listings, setListings] = useState<BookListing[]>([]);
  const [sellerNames, setSellerNames] = useState<SellerNames>({});

  useEffect(() => {
    const fetchBooksForModeration = async () => {
      try {
        console.log("Fetching books awaiting moderation...");

        // Fetch books that are "pending" from books collection
        const booksCollection = collection(db, "books");
        const booksQuery = query(
          booksCollection,
          where("moderationStatus", "==", "pending")
        );
        const booksSnapshot = await getDocs(booksQuery);

        const booksList: BookListing[] = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().book,
          author: doc.data().author,
          price: `Rs.${doc.data().price}.00`,
          sellerUid: doc.data().uid || "unknown",
          bid: doc.data().bid,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          imageUrl: doc.data().uploadedImages?.[0] || "/placeholder.png",
          moderationStatus: doc.data().moderationStatus || "pending",
        }));

        setListings(booksList);
        console.log("Fetched pending books:", booksList);

        // Fetch unique seller names
        const uniqueUids = [
          ...new Set(
            booksList
              .map((book) => book.sellerUid)
              .filter((uid) => uid !== "unknown")
          ),
        ];
        if (uniqueUids.length === 0) return;

        const sellerData: SellerNames = {};

        await Promise.all(
          uniqueUids.map(async (uid) => {
            try {
              console.log(`Fetching seller for UID: ${uid}`);
              const userDocRef = doc(db, "users", uid);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                const userData = userDoc.data();
                sellerData[uid] = `${userData.fname} ${userData.lname}`;
                console.log(`Seller found: ${sellerData[uid]}`);
              } else {
                sellerData[uid] = "Unknown Seller";
              }
            } catch (err) {
              console.error(`Error fetching user ${uid}:`, err);
              sellerData[uid] = "Unknown Seller";
            }
          })
        );

        setSellerNames(sellerData);
        console.log("Final Seller Names Updated:", sellerData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooksForModeration();
  }, []);

  // Function to Approve or Reject Books
  const handleModeration = async (
    bookId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      console.log(`Updating book ID ${bookId} status to: ${status}`);

      // Update the moderationStatus in the books collection
      const bookRef = doc(db, "books", bookId);
      await updateDoc(bookRef, {
        moderationStatus: status,
      });

      // Update UI after moderation
      setListings((prevListings) =>
        prevListings.filter((book) => book.id !== bookId)
      );
      alert(`Book ${status}`);
    } catch (error) {
      console.error(`Error updating book status: ${error}`);
    }
  };

  return (
    <div>
      <TopMenu />
      <div className="maincontainer">
        <SideMenu />
        <div className="tempcontainer">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <Listing
                key={listing.id}
                imageUrl={listing.imageUrl}
                title={listing.title}
                author={listing.author}
                price={listing.price}
                sellerName={sellerNames[listing.sellerUid] || "Loading..."}
                sellerUid={listing.sellerUid}
                bid={listing.bid}
                onApprove={() => handleModeration(listing.id, "approved")}
                onReject={() => handleModeration(listing.id, "rejected")}
              />
            ))
          ) : (
            <p>No books available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllListings;
