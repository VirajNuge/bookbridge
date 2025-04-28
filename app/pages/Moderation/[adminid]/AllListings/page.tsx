"use client";

import React, { useEffect, useState } from "react";
import "./NewListings.css";
import TopMenu from "../../components/topmenu/topmenu";
import SideMenu from "../../components/sidemenu/sidemenu";
import Listing from "../../components/lisitng/listing";
import { db } from "../../../../firebase-config/firebase-config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";

// Define TypeScript interfaces for props
interface BookListing {
  id: string;
  title: string;
  author: string;
  price: string;
  sellerUid: string;
  bid: string;
  createdAt: Date;
  imageUrl: string;
}

interface SellerNames {
  [key: string]: string;
}

const AllListings: React.FC = () => {
  const [listings, setListings] = useState<BookListing[]>([]);
  const [sellerNames, setSellerNames] = useState<SellerNames>({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log("Fetching book listings...");

        const booksCollection = collection(db, "books");
        const booksQuery = query(booksCollection, orderBy("createdAt", "desc"));
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
        }));

        setListings(booksList);
        console.log("Fetched books:", booksList);

        const uniqueUids = [
          ...new Set(
            booksList
              .map((book) => book.sellerUid)
              .filter((uid) => uid !== "unknown")
          ),
        ];

        console.log("Unique UIDs found:", uniqueUids);

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
                console.warn(`No user found for UID: ${uid}`);
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

    fetchBooks();
  }, []);

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
                onApprove={() => console.log(`${listing.title} Approved!`)}
                onReject={() => console.log(`${listing.title} Rejected!`)}
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
