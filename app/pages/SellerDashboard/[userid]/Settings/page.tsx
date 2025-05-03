"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { db, auth } from "../../../../firebase-config/firebase-config";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  User,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  cloudinaryUploadUrl,
  uploadPreset,
} from "../../../../cloudinary-config/cloudinary-config";

import TopMenu from "../../components/topmenu/topmenu";
import SideTopMenu from "../../components/sidemenu/sidemenu";

import "./settings.css";

// ✅ Define profile type
type ProfileData = {
  profilepicture: string;
  fname: string;
  lname: string;
  email: string;
  joindata: string;
  contact: string;
  location: string;
  username: string;
  aboutme: string;
};

const defaultProfile: ProfileData = {
  profilepicture: "",
  fname: "",
  lname: "",
  email: "",
  joindata: "",
  contact: "",
  location: "",
  username: "",
  aboutme: "",
};

const UserSettings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        window.location.href = "/login";
      } else {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Use fallback values to satisfy typing
            setProfileData({
              profilepicture: data.profilepicture || "",
              fname: data.fname || "",
              lname: data.lname || "",
              email: data.email || "",
              joindata: data.joindata || "",
              contact: data.contact || "",
              location: data.location || "",
              username: data.username || "",
              aboutme: data.aboutme || "",
            });
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteProfile = async () => {
    if (!user || !user.email) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const password = prompt(
        "Please enter your password to confirm deletion:"
      );
      if (!password)
        return alert("Password is required to delete your account.");

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await deleteDoc(doc(db, "users", user.uid));
      await auth.currentUser?.delete();
      await auth.signOut();
      alert("Profile deleted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile. Please check your credentials and try again.");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(cloudinaryUploadUrl, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setProfileData((prev) => ({
          ...prev,
          profilepicture: data.secure_url,
        }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), profileData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="belowdash">
      <div className="tempconta">
        <form onSubmit={handleSubmit}>
          <div className="imagecontainer">
            <label htmlFor="upload" className="uploadimg">
              📤 Upload Profile Picture
            </label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
            {profileData.profilepicture && (
              <img
                src={profileData.profilepicture}
                alt="Profile"
                style={{ maxWidth: "100px" }}
              />
            )}
          </div>
          <div className="form-fields-settings">
            <label>First Name</label>
            <input
              type="text"
              name="fname"
              value={profileData.fname}
              onChange={handleChange}
              required
            />
            <label>Last Name</label>
            <input
              type="text"
              name="lname"
              value={profileData.lname}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              readOnly
            />
            <label>Join Date</label>
            <input
              type="text"
              name="joindata"
              value={profileData.joindata}
              readOnly
            />
            <label>Contact</label>
            <input
              type="text"
              name="contact"
              value={profileData.contact}
              onChange={handleChange}
              required
            />
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={profileData.location}
              onChange={handleChange}
              required
            />
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleChange}
              required
            />
            <label>About Me</label>
            <textarea
              name="aboutme"
              value={profileData.aboutme}
              onChange={handleChange}
            />
            <button type="submit" className="submit-btn">
              Update Profile
            </button>
            <button
              type="button"
              className="seller-btn"
              onClick={() =>
                (window.location.href = `/pages/seller/${user?.uid}/SellerPage`)
              }
            >
              View Seller Page
            </button>
            <button
              type="button"
              className="delete-btn"
              onClick={handleDeleteProfile}
            >
              Delete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
