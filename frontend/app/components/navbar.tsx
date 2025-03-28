"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

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
    </nav>
  );
}
