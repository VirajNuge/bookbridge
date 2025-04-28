"use client";

import React, { useState, useEffect } from "react";
import "./addmoderator.css";
import TopMenu from "../../components/topmenu/topmenu";
import SideMenu from "../../components/sidemenu/sidemenu";
import { db, auth } from "../../../../firebase-config/firebase-config"; // Import Firestore
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

interface Moderator {
  name: string;
  email: string;
  role: string;
  phone: string;
  password: string; // Password field
}

const AddModerator = () => {
  const [moderator, setModerator] = useState<Moderator>({
    name: "",
    email: "",
    role: "Moderator",
    phone: "",
    password: "",
  });

  const [moderators, setModerators] = useState<Omit<Moderator, "password">[]>(
    []
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "admins"), (snapshot) => {
      const adminsList = snapshot.docs.map((doc) => ({
        name: doc.data().fullname,
        email: doc.data().adminid, // Assuming adminid is stored as email
        role: doc.data().role,
        phone: doc.data().pnum,
      }));
      setModerators(adminsList);
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setModerator({ ...moderator, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !moderator.name ||
      !moderator.email ||
      !moderator.phone ||
      !moderator.password
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      console.log("Checking if email exists...");

      // Step 1: Check if the email is already registered in Firebase Auth
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        moderator.email
      );

      if (signInMethods.length > 0) {
        alert("This email is already in use. Please use another email.");
        return;
      }

      console.log("Registering user...");

      // Step 2: Register admin in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        moderator.email,
        moderator.password
      );
      console.log("User registered:", userCredential);

      const adminId = uuidv4(); // Generate random unique ID
      console.log("Generated admin ID:", adminId);

      // Step 3: Store admin data in Firestore
      await addDoc(collection(db, "admins"), {
        adminid: adminId,
        fullname: moderator.name,
        email: moderator.email,
        pnum: moderator.phone,
        role: moderator.role,
      });

      alert("Moderator added successfully!");
    } catch (error) {
      console.error("Error adding moderator:", error);
      alert(error); // Show specific error message
    }
  };

  const handleRemove = async (email: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, "admins"));
      const adminToDelete = querySnapshot.docs.find(
        (doc) => doc.data().adminid === email
      );

      if (adminToDelete) {
        await deleteDoc(doc(db, "admins", adminToDelete.id));
        alert("Moderator removed successfully!");
      }
    } catch (error) {
      console.error("Error removing moderator:", error);
      alert("Error removing moderator.");
    }
  };

  return (
    <>
      <TopMenu />
      <div className="maincontainer">
        <SideMenu />
        <div className="tempcontainer">
          <h2>Add New Moderator</h2>
          <form onSubmit={handleSubmit} className="moderator-form">
            <label>
              Full Name:
              <input
                type="text"
                name="name"
                value={moderator.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={moderator.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Phone Number:
              <input
                type="tel"
                name="phone"
                value={moderator.phone}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Role:
              <select
                name="role"
                value={moderator.role}
                onChange={handleChange}
              >
                <option value="Moderator">Moderator</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <label>
              Password:
              <input
                type="password"
                name="password"
                value={moderator.password}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="submit-btn">
              Add Moderator
            </button>
          </form>
          <div className="moderators-container">
            <h2>Current Moderators</h2>
            <table className="moderators-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {moderators.map((mod, index) => (
                  <tr key={index}>
                    <td>{mod.name}</td>
                    <td>{mod.email}</td>
                    <td>{mod.role}</td>
                    <td>{mod.phone}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(mod.email)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Container for Current Moderators */}
      </div>
    </>
  );
};

export default AddModerator;
