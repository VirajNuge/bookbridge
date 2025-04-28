"use client";
import React, { useEffect, useState } from "react";
import "./topmenu.css";
import { auth, db } from "../../../../firebase-config/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const SideTopMenu: React.FC = () => {
  const [userData, setUserData] = useState<{
    fname: string;
    lname: string;
    profilepicture: string;
    Status: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data() as any);
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
          <img src={userData?.profilepicture || "/pp.jpg"} alt="profile" />
        </div>
        <div className="topmenunames">
          <h1>
            {userData ? `${userData.fname} ${userData.lname}` : "Loading..."}
          </h1>
          <p>{userData?.Status || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default SideTopMenu;
