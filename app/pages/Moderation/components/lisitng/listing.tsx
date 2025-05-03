 "use client";
import React from "react";
import "./listing.css";

interface ListingProps {
  imageUrl: string;
  title: string;
  author: string;
  price: string;
  sellerName: string;
  onApprove: () => void;
  onReject: () => void;
  sellerUid: string; // ✅ Seller's UID needed for navigation
  bid: string | boolean;
 // ✅ Book ID for Product Page
}

const Listing: React.FC<ListingProps> = ({
  imageUrl,
  title,
  author,
  price,
  sellerName,
  onApprove,
  onReject,
  sellerUid,
  bid,
}) => {
  return (
    <div className="allcontainer">
      <img src={imageUrl} alt={title} />
      <div>
        <h2>{title}</h2>
        <h3>Author: {author}</h3>
        <p>{price}</p>

        {/* ✅ Clicking Seller Name Opens Seller Page in a New Tab */}
        <button
          className="sellerbutton"
          onClick={() =>
            window.open(`/pages/seller/${sellerUid}/SellerPage`, "_blank")
          }
        >
          Seller: {sellerName}
        </button>
        <br />

        {/* ✅ Clicking Check Listing Opens Product Page in the Same Tab */}
        <button
          className="checkbutton"
          onClick={() => window.open(`/pages/${bid}/ProductPage`, "_self")}
        >
          Check Listing
        </button>
      </div>

      <div className="buttons">
        <div className="approvebuttons">
          <button className="right" onClick={onApprove}>
            ✓
          </button>
          <button className="wrong" onClick={onReject}>
            ✘
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listing;
