import React, { useRef, useEffect, useState } from "react";
import "./viewbookelement.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase-config/firebase-config";
import {
  cloudinaryUploadUrl,
  uploadPreset,
} from "../../../../cloudinary-config/cloudinary-config";
import { deleteDoc } from "firebase/firestore";

interface Props {
  id: string;
  productimage: string;
  bookname: string;
  authorname: string;
  bookprice: string;
  bookdes: string;
  tag1: string;
  tag2: string;
  tag3: string;
  tag4: string;
  tag5: string;
}

const ViewBookElement: React.FC<Props> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [updatedData, setUpdatedData] = useState({
    book: props.bookname,
    publisher: props.authorname,
    price: props.bookprice,
    condition: props.bookdes,
    tags: [props.tag1, props.tag2, props.tag3, props.tag4, props.tag5],
    location: "",
    description: "",
    pagescount: "",
    binding: "",
    category: "",
    isbnnumber: "",
    publishedate: "",
  });
  const titleRef = useRef<HTMLDivElement>(null);
  const [truncatedTitle, setTruncatedTitle] = useState(props.bookname);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === "tags" && typeof index === "number") {
      const newTags = [...updatedData.tags];
      newTags[index] = value;
      setUpdatedData({ ...updatedData, tags: newTags });
    } else {
      setUpdatedData({ ...updatedData, [name]: value });
    }
  };
  // Already in your setup

  const handleDeleteBook = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const bookRef = doc(db, "books", props.id);
      await deleteDoc(bookRef);
      alert("Book deleted successfully.");
      // Optional: remove from UI (if using state in parent)
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book.");
    }
  };

  const handleMarkAsSold = async () => {
    const confirm = window.confirm(
      "Are you sure you want to mark this book as SOLD?"
    );
    if (!confirm) return;

    try {
      const bookRef = doc(db, "books", props.id);
      await updateDoc(bookRef, { moderationStatus: "sold" });
      alert("Book marked as SOLD.");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).slice(0, 7);
      setImages(selected);
    }
  };

  const uploadToCloudinary = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(cloudinaryUploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      let uploadedImageURLs: string[] = [];

      if (images.length > 0) {
        const uploadPromises = images.map((img) => uploadToCloudinary(img));
        uploadedImageURLs = await Promise.all(uploadPromises);
      }

      const bookRef = doc(db, "books", props.id);
      await updateDoc(bookRef, {
        ...updatedData,
        uploadedImages:
          uploadedImageURLs.length > 0 ? uploadedImageURLs : undefined,
      });

      alert("Book updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const measureText = () => {
      let text = props.bookname;
      el.textContent = text;

      while (el.scrollWidth > el.clientWidth && text.length > 0) {
        text = text.slice(0, -1);
        el.textContent = text + "...";
      }

      setTruncatedTitle(el.textContent || props.bookname);
    };

    measureText();
    window.addEventListener("resize", measureText);

    return () => window.removeEventListener("resize", measureText);
  }, [props.bookname]);

  return (
    <>
      <div className="viewbookcontainer">
        <div className="imagecontainer">
          <img src={props.productimage} />
        </div>
        <div className="textcontainer">
          <p className="bookname">
            {props.bookname.split(" ").slice(0, 3).join(" ")}
            {props.bookname.split(" ").length > 4 && "..."}
          </p>

          <p className="authorname">by {props.authorname}</p>
          <p className="bookprice">Price: Rs.{props.bookprice}</p>
          <p className="bookdes">{props.bookdes}</p>
          <p className="tags">
            Tag:
            {[props.tag1, props.tag2, props.tag3, props.tag4, props.tag5].map(
              (tag, i) =>
                tag && (
                  <p className="taggs" key={i}>
                    {tag}
                  </p>
                )
            )}
          </p>
        </div>
        <div className="viewbuttons">
          <button onClick={() => setIsModalOpen(true)}>EDIT BOOK</button>
          <button onClick={handleMarkAsSold}>MARK AS SOLD</button>

          <button className="delbutton" onClick={handleDeleteBook}>
            DELETE BOOK
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Book</h2>
            <input
              name="book"
              value={updatedData.book}
              onChange={handleChange}
              placeholder="Book Name"
            />
            <input
              name="publisher"
              value={updatedData.publisher}
              onChange={handleChange}
              placeholder="Author"
            />
            <input
              name="price"
              value={updatedData.price}
              onChange={handleChange}
              placeholder="Price"
            />
            <textarea
              name="condition"
              value={updatedData.condition}
              onChange={handleChange}
              placeholder="Condition"
            />
            <textarea
              name="description"
              value={updatedData.description}
              onChange={handleChange}
              placeholder="Description"
            />
            <input
              name="location"
              value={updatedData.location}
              onChange={handleChange}
              placeholder="Location"
            />
            <input
              name="pagescount"
              value={updatedData.pagescount}
              onChange={handleChange}
              placeholder="Pages"
            />
            <input
              name="binding"
              value={updatedData.binding}
              onChange={handleChange}
              placeholder="Binding Type"
            />
            <input
              name="category"
              value={updatedData.category}
              onChange={handleChange}
              placeholder="Category"
            />
            <input
              name="isbnnumber"
              value={updatedData.isbnnumber}
              onChange={handleChange}
              placeholder="ISBN"
            />
            <input
              name="publishedate"
              value={updatedData.publishedate}
              onChange={handleChange}
              placeholder="Publish Date"
            />

            {updatedData.tags.map((tag, index) => (
              <input
                key={index}
                name="tags"
                value={tag}
                onChange={(e) => handleChange(e, index)}
                placeholder={`Tag ${index + 1}`}
              />
            ))}

            <label>Upload up to 7 images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />

            <div className="modal-buttons">
              <button onClick={handleUpdate} disabled={updating}>
                {updating ? "Updating..." : "Save Changes"}
              </button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewBookElement;
