"use client"; // Ensure this runs only on the client side

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js navigation for redirection
import { auth, db } from "../../../firebase-config/firebase-config"; // Adjust path as needed
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./AdminLoginPage.css";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Use Next.js router for navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Attempting login...");

      // Authenticate the admin using Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User authenticated:", userCredential.user.uid);

      // Query Firestore to get the correct `adminid`
      const q = query(collection(db, "admins"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const adminData = querySnapshot.docs[0].data();
        const adminid = querySnapshot.docs[0].id; // Firestore document ID as `adminid`
        console.log("Admin found:", adminid);

        // Store `adminid` in session storage for navigation
        sessionStorage.setItem("adminid", adminid);

        // Redirect to the admin dashboard
        router.push(`/pages/Moderation/${adminid}/NewListings`);
      } else {
        setError("Admin not found. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="container">
      <div className="logo">
        <img src="/logo.png" alt="BookBridge Logo" />
      </div>
      <div className="login-section">
        <h2>Welcome Back!</h2>
        <p>Please Enter Your Details</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Admin Email Address</label>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
      </div>
      <div className="illustration-section">
        <img src="/People.jpeg" alt="Illustration" />
      </div>
    </div>
  );
};

export default AdminLoginPage;
