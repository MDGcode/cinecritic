"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { UserAuth } from "../context/AuthContext"; // Import UserAuth
import Image from "next/image";
import DefaultAvatar from "../images/default_avatar.webp";
import { useEffect, useState } from "react";
import LoadingSpinner from "./loading-spinner";
export default function Navbar() {
  const pathname = usePathname();
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      console.error(err);
    }
  };
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <Link href="/">CineCritic</Link>
        <Link
          href="/"
          className={
            pathname === "/" ? "font-bold underline" : "hover:underline"
          }
        >
          HOME
        </Link>
        <Link
          href="/myreviews"
          className={
            pathname === "/myreviews"
              ? "font-bold underline"
              : "hover:underline"
          }
        >
          MY REVIEWS
        </Link>
        <Link
          href="/feed"
          className={
            pathname === "/feed" ? "font-bold underline" : "hover:underline"
          }
        >
          FEED
        </Link>
      </div>
      <div className="flex items-center border border-white px-2 py-1 rounded-md">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-white placeholder-gray-400 px-2"
        />
        <Search className="w-5 h-5" />
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : !user ? (
        <div onClick={handleSignIn} className=" cursor-pointer">
          Login
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Image
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
              src={user.photoURL || DefaultAvatar}
              alt="user photo"
            />
            <div className="text-white">{user.displayName}</div>
          </div>
          <div onClick={handleSignOut} className="cursor-pointer">
            Logout
          </div>
        </div>
      )}
    </nav>
  );
}
