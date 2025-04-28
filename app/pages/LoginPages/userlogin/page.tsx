"use client"; // Ensures compatibility with Next.js App Router

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js router for redirection
import { auth } from "../../../firebase-config/firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Redirect if the user is already logged in (using Firebase instead of localStorage)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push(`/pages/SellerDashboard/${user.uid}/dashboard`); // Redirect to dashboard
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      alert("Login Successful!");
      router.push(`/pages/SellerDashboard/${user.uid}/dashboard`); // Redirect to user dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email Address</label>
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
          
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="signup-link">
          Don't have an account?{" "}
          <a href="/pages/LoginPages/usersignup">Sign up</a>
        </div>
      </div>
      <div className="illustration-section">
        <img src="/People.jpeg" alt="Illustration" />
      </div>
    </div>
  );
};

export default LoginPage;
