"use client"; // For Next.js app router compatibility

import React, { useState } from "react";
import { auth, db } from "../../../firebase-config/firebase-config"; // Import Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import "./usersignup.css";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle user signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email,
        contact: formData.phone,
        location: "", // User can update this later
        username:
          formData.firstName.toLowerCase() + formData.lastName.toLowerCase(),
        Status: "Member",
        joindata: new Date().toISOString(), // Store join date
      });

      setSuccess("Signup successful! You can now log in.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="logo">
        <img src="/logo.png" alt="BookBridge Logo" />
      </div>
      <div className="left">
        <h2>Let's Get it Started</h2>
        <p>Please Enter Your Details</p>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSignup}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          

          <button type="submit">Sign up</button>
        </form>

        <div className="login-link">
          Already Joined? <a href="/pages/LoginPages/userlogin">Login</a>
        </div>
      </div>
      <div className="illustration-section">
        <img src="/People.jpeg" alt="Illustration" />
      </div>
    </div>
  );
};

export default UserSignup;
