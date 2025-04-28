"use client";

import React, { useEffect, useState } from "react";
import "./viewbook.css";
import TopMenu from "../../components/topmenu/topmenu";
import SideTopMenu from "../../components/sidemenu/sidemenu";
import ViewBook from "../../components/viewbookelement/viewbookelement";
import { auth, db } from "../../../../firebase-config/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Page = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserBooks(user.uid);
      } else {
        setUserId(null);
        setBooks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserBooks = async (uid: string) => {
    try {
      const booksRef = collection(db, "books");
      const q = query(booksRef, where("uid", "==", uid)); // Fetch books added by the logged-in user
      const querySnapshot = await getDocs(q);

      const userBooks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBooks(userBooks);
    } catch (error) {
      console.error("Error fetching user books:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="belowdash">
      <div className="tempconta">
        {loading ? (
          <p>Loading books...</p>
        ) : books.length > 0 ? (
          books.map((book) => (
            <ViewBook
              key={book.id}
              id={book.id} // Add this!
              productimage={book.uploadedImages?.[0] || "/product.png"}
              bookname={book.book}
              authorname={book.publisher}
              bookprice={book.price}
              bookdes={book.condition}
              tag1={book.tags?.[0] || ""}
              tag2={book.tags?.[1] || ""}
              tag3={book.tags?.[2] || ""}
              tag4={book.tags?.[3] || ""}
              tag5={book.tags?.[4] || ""}
            />
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
