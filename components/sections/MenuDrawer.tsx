import React, { useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "../ui/drawer";
import { CgCloseO, CgMenuRight } from "react-icons/cg";
import Link from "next/link";
import { CiHeart } from "react-icons/ci";
import { PiShoppingCart } from "react-icons/pi";

type MenuDrawerProps = {
  count: number;
};

const MenuDrawer = ({count}: MenuDrawerProps) => {

    // State to manage the open/close status of the drawer
    const [isOpen, setIsOpen] = useState(false);
  
    // Function to toggle the drawer's open/close state
    const toggleDrawer = () => setIsOpen((prev) => !prev);
    // Function to explicitly close the drawer
    const closeDrawer = () => setIsOpen(false);
    
  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      {/* Button to Toggle Drawer */}
      <button onClick={toggleDrawer} className="text-3xl lg:hidden">
        <CgMenuRight />
      </button>
      <DrawerContent className="bg-background mx-auto max-w-[80%] text-left px-6 lg:max-w-[35%] md:max-w-[50%]">
        {/* Close Button */}
        <DrawerClose
          className="absolute top-3 right-3 m-5 text-xl"
          onClick={closeDrawer}
        >
          <CgCloseO />
        </DrawerClose>
        <DrawerTitle className="text-xl my-5 font-bold">Main Menu</DrawerTitle>
        {/* Each link includes an onClick handler to close the drawer */}
        <div className="flex flex-col gap-5 text-2xl">
          <Link
            href="/"
            className="mr-9 text-lg  text-[#636270] active:text-primary hover:text-primary"
            onClick={closeDrawer}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="mr-9 text-lg text-[#636270] active:text-primary hover:text-primary"
            onClick={closeDrawer}
          >
            Shop
          </Link>
          <Link
            href="/contact"
            className="mr-9 text-lg text-[#636270] active:text-primary hover:text-primary"
            onClick={closeDrawer}
          >
            Contact
          </Link>

          <Link
            href="/about"
            className="mr-9 text-lg text-[#636270] active:text-primary hover:text-primary"
            onClick={closeDrawer}
          >
            About
          </Link>
        </div>
        <Link
          href="/wishlist"
          className="group flex items-center mt-2 gap-2 group-hover:text-primary"
          onClick={closeDrawer}
        >
          <span className="flex items-center gap-2 mr-9 text-lg text-[#636270] active:text-primary group-hover:text-primary">
            <CiHeart className="w-6 h-6 " />
            Wishlist
          </span>
        </Link>

        <div className="items-center flex mt-5">
          <p className="text-base font-medium text-gray-500">
            Contact:
            <span className="ml-2 text-text">(808) 555-0111</span>
          </p>
        </div>

        <Link href={"/cart"} onClick={closeDrawer}>
          <div className="group mt-5 rounded-xl gap-3 flex items-center max-w-40 ">
            <PiShoppingCart className="text-3xl group-hover:text-primary flex items-center justify-center" />
            <p className="group-hover:text-primary">Cart</p>
            <div className="rounded-full text-xs min-w-5 min-h-5 flex justify-center items-center text-center text-white bg-primary">
              {count}
            </div>
          </div>
        </Link>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
