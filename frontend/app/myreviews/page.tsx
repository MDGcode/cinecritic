"use client";
import LoadingSpinner from "../components/loading-spinner";
import { UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
export default function MyReviews() {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <>
      <div className="p-4">
        {loading ? (
          <LoadingSpinner />
        ) : !user ? (
          <p>Please log in to leave a review</p>
        ) : (
          <p>Welcome {user.displayName}</p>
        )}
      </div>
    </>
  );
}
