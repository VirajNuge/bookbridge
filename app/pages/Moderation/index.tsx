"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const AdminDashboard = () => {
  const router = useRouter();
  const [adminid, setAdminid] = useState("");

  useEffect(() => {
    const storedAdminId = sessionStorage.getItem("adminid");
    if (storedAdminId) {
      setAdminid(storedAdminId);
    } else {
      router.push("/LoginPages/adminlogin");
    }
  }, []);

  if (!adminid) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, Admin</h1>
      <p>Your Admin ID: {adminid}</p>
      <ul>
        <li>
          <Link href={`/Moderation/${adminid}/AddModerator`}>
            Manage Moderators
          </Link>
        </li>
        <li>
          <Link href={`/Moderation/${adminid}/AllListings`}>View Listings</Link>
        </li>
        <li>
          <Link href={`/Moderation/${adminid}/AllUsers`}>Manage Users</Link>
        </li>
        <li>
          <Link href={`/Moderation/${adminid}/NewListings`}>New Listings</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
