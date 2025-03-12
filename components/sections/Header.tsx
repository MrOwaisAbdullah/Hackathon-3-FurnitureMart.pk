"use client";
import { inter } from "../../app/fonts";
import Link from "next/link";
import React, { useMemo } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { PiShoppingCart } from "react-icons/pi";
import Image from "next/image";
import logo from "../../Public/Logo Icon.png";
import { CiCircleAlert, CiHeart } from "react-icons/ci";
import { useCart } from "@/app/context/CartContext";
import dynamic from "next/dynamic";
import { CgMenuRight } from "react-icons/cg";

const Header = () => {
  const { state } = useCart(); // Access the cart state from context
  const { cart } = state;

  // Memoize cart count calculation
  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + (item.quantity || 0), 0),
    [cart]
  );

  const MenuDrawer = dynamic(() => import("./MenuDrawer"), {
    ssr: false,
    loading: () => (
      <button className="text-3xl lg:hidden cursor-not-allowed">
        <CgMenuRight />
      </button>
    ),
  });

  return (
    <header className={`${inter.className} overflow-hidden`}>
      {/* Upper Section */}
      <div className=" bg-accent">
        <div className="max-w-7xl m-auto w-full flex flex-col md:flex-row gap-2 xl:px-0 px-3 py-2 text-[#BEBDC7] items-center justify-between ">
          <div>
            <p className="flex sm:flex-row flex-col xl:justify-center text-xs text-start">
              &#x2713; &nbsp; Free shipping on all orders over $50
            </p>
          </div>
          <div className="flex justify-between items-center text-xs gap-4 ">
            <p className="flex gap-2 pb-2 md:pb-0 items-center ">
              Eng
              <IoIosArrowDown />
            </p>
            <Link href={"/faq"}>
              <p>Faqs</p>
            </Link>
            <span className="flex items-center gap-1">
              <CiCircleAlert className="text-[#918F9F] text-sm" />
              <p>Need Help</p>
            </span>
          </div>
        </div>
      </div>
      {/* Middle Section */}
      <div
        className={`flex gap-3 bg-secondary w-full text-text justify-between px-5 lg:px-12 h-[5.5rem]`}
      >
        <div className=" flex max-w-7xl m-auto pt-5 pb-2 w-full justify-between items-center">
          <Link
            href="/"
            className={`flex text-2xl gap-2 font-medium items-center`}
          >
            <Image src={logo} alt="FurnitureMart.pk"></Image>
            FurnitureMart
          </Link>
          <div className="flex gap-5 items-center justify-center">
            <Link
              href="/wishlist"
              className="hidden md:flex items-center gap-2 hover:text-primary"
            >
              <CiHeart className="w-6 h-6 " />
            </Link>
            <Link href={"/cart"}>
              <div className="group bg-white py-3 px-3 md:px-5 rounded-xl gap-3 hidden xs:flex items-center justify-center max-w-30 sm:max-w-40 ">
                <PiShoppingCart className="text-2xl group-hover:text-primary flex items-center justify-center" />
                <p className="group-hover:text-primary">Cart</p>
                <div className="rounded-full text-xs min-w-5 min-h-5 flex justify-center items-center text-center text-white bg-primary">
                  {cartCount}
                </div>
              </div>
            </Link>
            <MenuDrawer count={cartCount} />
          </div>
        </div>
      </div>
      {/* Bottom Section, Hidden on smaller devices */}
      <div className="hidden lg:flex border-b">
        <div className="flex max-w-7xl m-auto w-full text-text justify-between px-5 lg:px-12 xl:px-0 h-[5.5rem]">
          <div className="flex flex-wrap items-center text-base">
            <Link
              href="/"
              className="mr-9 text-sm  text-[#636270] active:text-primary hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="mr-9 text-sm text-[#636270] active:text-primary hover:text-primary"
            >
              Shop
            </Link>
            <Link
              href="/contact"
              className="mr-9 text-sm text-[#636270] active:text-primary hover:text-primary"
            >
              Contact
            </Link>

            <Link
              href="/about"
              className="mr-9 text-sm text-[#636270] active:text-primary hover:text-primary"
            >
              About
            </Link>
          </div>

          <div className="items-center flex">
            <p className="text-sm font-medium text-gray-500">
              Contact:<span className="ml-2 text-text">(808) 555-0111</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
