import Checkout from "@/components/sections/Checkout";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6 mx-5">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-800">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-gray-800">Checkout</li>
        </ol>
      </nav>
      <Checkout />
    </>
  );
};

export default page;
