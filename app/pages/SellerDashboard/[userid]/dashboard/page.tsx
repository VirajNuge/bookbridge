"use client";

import { useEffect, useState, use } from "react";
import "./sellerdashboard.css";
import DashTop from "../../components/dashtop/dashtop";
import Chart from "../../components/chart/chart";
import ContactCard from "../../components/contacts/contacts";
import BookCal from "../../components/bookcal/bookcal";
import Review from "../../components/review/review";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../../firebase-config/firebase-config";
import dayjs from "dayjs";

export default function SellerDashboard({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const { userid } = use(params);

  const [listingCount, setListingCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0.0);
  const [chartData, setChartData] = useState<
    { date: string; count: number }[]
  >([]);
  const [contacts, setContacts] = useState<
    { name: string; image: string; chatId: string }[]
  >([]);
  const [reviews, setReviews] = useState<
    { id: string; rating: number; text: string; reviewer: string }[]
  >([]);

  useEffect(() => {
    const refreshCount = localStorage.getItem("refreshCount");
    if (!refreshCount) {
      localStorage.setItem("refreshCount", "1");
    } else if (parseInt(refreshCount) < 3) {
      const newCount = parseInt(refreshCount) + 1;
      localStorage.setItem("refreshCount", newCount.toString());
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Listings count
        const booksQuery = query(
          collection(db, "books"),
          where("uid", "==", userid)
        );
        const booksSnapshot = await getDocs(booksQuery);
        setListingCount(booksSnapshot.size);

        // 2. Reviews & average rating
        const reviewsQuery = query(
          collection(db, "reviews"),
          where("sellerId", "==", userid)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);

        let totalStars = 0;
        let reviewCount = 0;
        const reviewsList: {
          id: string;
          rating: number;
          text: string;
          reviewer: string;
        }[] = [];

        reviewsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (typeof data.stars === "number") {
            totalStars += data.stars;
            reviewCount++;
          }

          reviewsList.push({
            id: doc.id,
            rating: data.stars,
            text: data.review,
            reviewer: data.userName || "Anonymous",
          });
        });

        const avgRating = reviewCount > 0 ? totalStars / reviewCount : 0;
        setAverageRating(parseFloat(avgRating.toFixed(2)));
        setReviews(reviewsList);

        // 3. Chart data (books per day this month)
        const startOfMonth = dayjs().startOf("month").toDate();
        const endOfMonth = dayjs().endOf("month").toDate();

        const tempData: { [date: string]: number } = {};
        booksSnapshot.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt;

          if (createdAt && typeof createdAt.toDate === "function") {
            const createdDate = createdAt.toDate();
            if (createdDate >= startOfMonth && createdDate <= endOfMonth) {
              const date = dayjs(createdDate).format("YYYY-MM-DD");
              tempData[date] = (tempData[date] || 0) + 1;
            }
          }
        });

        const daysInMonth = dayjs().daysInMonth();
        const chartArray = Array.from({ length: daysInMonth }, (_, index) => {
          const date = dayjs()
            .startOf("month")
            .add(index, "day")
            .format("YYYY-MM-DD");
          return { date, count: tempData[date] || 0 };
        });

        setChartData(chartArray);

        // 4. Contacts: use sellerId and chat doc format <buyerId>_<sellerId>
        const chatsSnapshot = await getDocs(collection(db, "chats"));
        const contactMap = new Map<
          string,
          { name: string; image: string; chatId: string }
        >();

        for (const chatDoc of chatsSnapshot.docs) {
          const chatId = chatDoc.id;
          if (!chatId.endsWith(`_${userid}`)) continue;

          const buyerId = chatId.split("_")[0];
          if (contactMap.has(buyerId)) continue;

          try {
            const userDoc = await getDoc(doc(db, "users", buyerId));
            if (!userDoc.exists()) continue;

            const userData: DocumentData = userDoc.data();
            const name = `${userData?.fname || ""} ${userData?.lname || ""}`.trim();
            const image = userData?.profilepicture || "/default-profile.png";

            contactMap.set(buyerId, {
              name: name || "Unknown Buyer",
              image,
              chatId,
            });
          } catch (err) {
            console.error(`Error loading buyer (${buyerId})`, err);
          }
        }

        setContacts(Array.from(contactMap.values()));
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };

    fetchData();
  }, [userid]);

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews((prev) => prev.filter((review) => review.id !== id));
      console.log("Deleted review:", id);
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  return (
    <div className="tempconta">
      <DashTop
        lclicks={92}
        response={2}
        listings={listingCount}
        rating={averageRating}
      />

      <div className="containertwo">
        <Chart data={chartData} />

        <div className="Contacts">
          <h3>Latest Contacts</h3>
          <div className="contacts-scrollable">
            {contacts.length === 0 ? (
              <p>No contacts yet.</p>
            ) : (
              contacts.map((contact, index) => (
                <ContactCard
                  key={index}
                  name={contact.name}
                  image={contact.image}
                  linkTo={`/pages/SellerDashboard/${userid}/Message?chatId=${contact.chatId}`}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="containerthree">
        <div className="Listings">
          <h3>Book Worth Calculator</h3>
          <BookCal />
        </div>
        <div className="Reviews">
  <h3>Reviews</h3>
  <div className="reviews-scrollable">
    {reviews.length === 0 ? (
      <p>No reviews yet.</p>
    ) : (
      reviews.map((review) => (
        <Review
          key={review.id}
          rating={review.rating}
          text={review.text}
          reviewer={review.reviewer}
          onDelete={() => handleDeleteReview(review.id)}
        />
      ))
    )}
  </div>
</div>

      </div>
    </div>
  );
}
