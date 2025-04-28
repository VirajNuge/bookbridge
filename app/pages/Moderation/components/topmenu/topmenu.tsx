"use client";
import React, { useEffect, useState } from "react";
import "./topmenu.css";
import { auth, db } from "../../../../firebase-config/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const SideTopMenu: React.FC = () => {
  const [adminData, setAdminData] = useState<{
    fullname: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const adminRef = collection(db, "admins");
        const q = query(adminRef, where("email", "==", user.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const adminInfo = snapshot.docs[0].data();
          setAdminData(adminInfo as any);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="topmenucontainer">
      <img src="/logo.png" className="logotop" alt="logo" />
      <div className="namecontainer">
        <div className="profilePicture">
          <img src="/pp.jpg" alt="profile" />
        </div>
        <div className="topmenunames">
          <h1>{adminData?.fullname || "Loading..."}</h1>
          <p>{adminData?.role || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default SideTopMenu;
