"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase-config/firebase-config";
import "./AllUsers.css";
import TopMenu from "../../components/topmenu/topmenu";
import SideMenu from "../../components/sidemenu/sidemenu";
import User from "../../components/user/user";
import { useRouter } from "next/navigation";

// Define the User type
interface User {
  id: string;
  username: string;
  profilepicture: string;
  moderationStatus: string;
  uid: string;
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]); // ✅ useState inside a component
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleSuspendSeller = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { moderationStatus: "suspended" });

      // Fetch all books where sellerId == uid
      const booksCollection = collection(db, "books");
      const booksSnapshot = await getDocs(booksCollection);

      const userBooks = booksSnapshot.docs.filter(
        (doc) => doc.data().uid === uid
      );

      // Update all books to "rejected"
      const updatePromises = userBooks.map((book) =>
        updateDoc(doc(db, "books", book.id), { moderationStatus: "rejected" })
      );

      await Promise.all(updatePromises);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === uid ? { ...user, moderationStatus: "suspended" } : user
        )
      );

      console.log(`User ${uid} suspended. All books rejected.`);
    } catch (error) {
      console.error("Error suspending user and rejecting books:", error);
    }
  };

  const handleUnsuspendSeller = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { moderationStatus: "approved" });

      // Fetch all books where sellerId == uid
      const booksCollection = collection(db, "books");
      const booksSnapshot = await getDocs(booksCollection);

      const userBooks = booksSnapshot.docs.filter(
        (doc) => doc.data().uid === uid
      );

      // Update all books to "approved"
      const updatePromises = userBooks.map((book) =>
        updateDoc(doc(db, "books", book.id), { moderationStatus: "approved" })
      );

      await Promise.all(updatePromises);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === uid ? { ...user, moderationStatus: "approved" } : user
        )
      );

      console.log(`User ${uid} unsuspended. All books approved.`);
    } catch (error) {
      console.error("Error unsuspending user and approving books:", error);
    }
  };

  return (
    <><div className="turntothenextline">
      <TopMenu />
      <br />
      <div className="maincontainer">
        <SideMenu />
        <div className="tempcontainer">
          {users.map((user) => (
            <User
              key={user.id}
              name={user.username || "Unknown User"}
              profileImage={user.profilepicture || "/pp.png"}
              moderationStatus={user.moderationStatus || "approved"}
              onViewSeller={() =>
                router.push(`/pages/seller/${user.uid}/SellerPage`)
              }
              onSuspendSeller={() => handleSuspendSeller(user.id)}
              onUnsuspendSeller={() => handleUnsuspendSeller(user.id)}
            />
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default Page;
