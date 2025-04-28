"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { db, auth } from "../../../../firebase-config/firebase-config";
import { collection, addDoc, doc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  cloudinaryUploadUrl,
  uploadPreset,
} from "../../../../cloudinary-config/cloudinary-config";
import "./addbook.css";

interface FormData {
  book: string;
  author: string;
  description: string;
  condition: string;
  daysUsed: string;
  price: string;
  tags: string;
  location: string;
  category: string;
  isbnnumber: string;
  publisher: string;
  publishdate: string;
  pagescount: string;
  binding: string;
  uploadedImages: File[];
}

const Page: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    book: "",
    author: "",
    description: "",
    condition: "",
    daysUsed: "",
    price: "",
    tags: "",
    location: "",
    category: "",
    isbnnumber: "",
    publisher: "",
    publishdate: "",
    pagescount: "",
    binding: "",
    uploadedImages: [],
  });

  const [user, setUser] = useState<User | null>(null);

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = "/login";
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 6) {
      alert("You can upload a maximum of 6 images.");
      return;
    }
    setFormData((prev) => ({ ...prev, uploadedImages: files }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    // Validate form data
    if (
      !formData.book ||
      !formData.author ||
      !formData.description ||
      !formData.condition ||
      !formData.price ||
      !formData.location ||
      !formData.category
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      const imageUrls: string[] = [];
      for (const file of formData.uploadedImages) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", uploadPreset);

        const response = await fetch(cloudinaryUploadUrl, {
          method: "POST",
          body: formDataUpload,
        });

        const data = await response.json();
        if (data.secure_url) {
          imageUrls.push(data.secure_url);
        }
      }

      // Generate a unique ID for the book
      const bookRef = doc(collection(db, "books"));
      const bid = bookRef.id; // Get the generated ID

      const bookData = {
        bid, // ✅ Save unique book ID
        uid: user.uid,
        book: formData.book,
        author: formData.author,
        description: formData.description,
        condition: formData.condition,
        daysUsed: parseInt(formData.daysUsed, 10),
        price: formData.price,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        location: formData.location,
        category: formData.category,
        isbnnumber: formData.isbnnumber || null,
        publisher: formData.publisher || null,
        publishdate: formData.publishdate || null,
        pagescount: formData.pagescount || null,
        binding: formData.binding || null,
        uploadedImages: imageUrls,
        createdAt: Timestamp.fromDate(new Date()),
        moderationStatus: "pending", // ✅ New books are marked as "pending"
      };

      // Save book data with the generated bid
      await addDoc(collection(db, "books"), bookData);

      setFormData({
        book: "",
        author: "",
        description: "",
        condition: "",
        daysUsed: "",
        price: "",
        tags: "",
        location: "",
        category: "",
        isbnnumber: "",
        publisher: "",
        publishdate: "",
        pagescount: "",
        binding: "",
        uploadedImages: [],
      });

      alert("Book added successfully! It is now awaiting moderation.");
    } catch (error) {
      console.error("Error adding book: ", error);
      alert("Failed to add book. Please try again.");
    }
  };

  return (
    <div className="belowdash">
      <div className="addbook-tempconta">
        <form onSubmit={handleSubmit}>
          <div className="imagecontainerr">
            <label htmlFor="upload" className="uploadimg">
              <div>📤 Upload Images (Max 6 Images)</div>
            </label>
            <input
              id="upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
            <div className="image-preview">
              {formData.uploadedImages.map((file, index) => {
                const imageUrl = URL.createObjectURL(file);
                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Preview ${index}`}
                    onLoad={() => URL.revokeObjectURL(imageUrl)}
                    style={{ maxWidth: "100px", margin: "5px" }}
                  />
                );
              })}
            </div>
          </div>

          <div className="form-fields">
            <div className="textform">
              <div>
                <label>Book Name</label>
                <br />
                <input
                  type="text"
                  name="book"
                  value={formData.book}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Author</label>
                <br />
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Book Condition</label>
                <br />
                <textarea
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Book Description</label>
                <br />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Days Used</label>
                <br />
                <input
                  type="number"
                  name="daysUsed"
                  value={formData.daysUsed}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Price</label>
                <br />
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Tags(Max: 5 Tags Separated by Commas)</label>
                <br />
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="additional-info">
              <div>
                <label>Location</label>
                <br />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Category</label>
                <br />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">SDelect a Category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Technology">Technology</option>
                  <option value="Literature">Literature</option>
                  <option value="Biography">Biography</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="History">History</option>
                  <option value="Art">Art</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Travel">Travel</option>
                  <option value="Poetry">Poetry</option>
                </select>
              </div>

              <div>
                <label>ISBN Number</label>
                <br />
                <input
                  type="text"
                  name="isbnnumber"
                  value={formData.isbnnumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Publisher</label>
                <br />
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Published Date</label>
                <br />
                <input
                  type="text"
                  name="publishdate"
                  value={formData.publishdate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Pages</label>
                <br />
                <input
                  type="text"
                  name="pagescount"
                  value={formData.pagescount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Binding</label>
                <br />
                <input
                  type="text"
                  name="binding"
                  value={formData.binding}
                  onChange={handleChange}
                />
              </div>
              <div className="submitbutton">
                <button type="submit" >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
