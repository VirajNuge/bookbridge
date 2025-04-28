import React from "react";
import Link from "next/link";
import "./category.css";

interface CategoryProps {
  image: string;
  heading: string;
  link: string;
}

const Category: React.FC<CategoryProps> = ({ image, heading, link }) => {
  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <div className="categorycontainer">
        <center>
          <img src={image} alt={heading} />
          <h1>{heading}</h1>
          <button>Browse</button>
        </center>
      </div>
    </Link>
  );
};

export default Category;
