"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, Film, X } from "lucide-react";
import { UserAuth } from "../context/AuthContext";
import DefaultAvatar from "../images/default_avatar.webp";
import LoadingSpinner from "./loading-spinner";
import SearchBar from "./search-bar";

export default function Navbar() {
  const pathname = usePathname();
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={
          pathname === "/"
            ? "font-bold text-blue-700 border-b-2 border-blue-700"
            : "text-gray-700 hover:text-blue-700 transition-colors"
        }
      >
        HOME
      </Link>
      <Link
        href="/myreviews"
        className={
          pathname === "/myreviews"
            ? "font-bold text-blue-700 border-b-2 border-blue-700"
            : "text-gray-700 hover:text-blue-700 transition-colors"
        }
      >
        MY REVIEWS
      </Link>
      <Link
        href="/feed"
        className={
          pathname === "/feed"
            ? "font-bold text-blue-700 border-b-2 border-blue-700"
            : "text-gray-700 hover:text-blue-700 transition-colors"
        }
      >
        FEED
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg">
                <Film className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-blue-700 hidden sm:block">
                CineCritic
              </span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-8 items-center">
              <NavLinks />
            </div>
          </div>

          {/* Search Bar and Auth - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div>
              <SearchBar />
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : !user ? (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={user.photoURL || DefaultAvatar}
                      alt={user.displayName || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-y-0 right-0 z-50 w-[80%] max-w-sm bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-blue-700">
                CineCritic
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <SearchBar />
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-6 p-4 border-b">
            <Link
              href="/"
              className={
                pathname === "/"
                  ? "font-bold text-blue-700"
                  : "text-gray-700 hover:text-blue-700 transition-colors"
              }
            >
              HOME
            </Link>
            <Link
              href="/myreviews"
              className={
                pathname === "/myreviews"
                  ? "font-bold text-blue-700"
                  : "text-gray-700 hover:text-blue-700 transition-colors"
              }
            >
              MY REVIEWS
            </Link>
            <Link
              href="/feed"
              className={
                pathname === "/feed"
                  ? "font-bold text-blue-700"
                  : "text-gray-700 hover:text-blue-700 transition-colors"
              }
            >
              FEED
            </Link>
          </div>

          {/* Mobile Auth */}
          <div className="mt-auto p-4">
            {loading ? (
              <LoadingSpinner />
            ) : !user ? (
              <button
                onClick={handleSignIn}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={user.photoURL || DefaultAvatar}
                      alt={user.displayName || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 ${
          mobileMenuOpen ? "opacity-25" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
}
