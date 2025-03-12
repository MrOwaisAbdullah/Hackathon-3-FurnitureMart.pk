import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { CartProvider } from "./context/CartContext";
import { NotificationsProvider } from "./context/NotificationContext";
import { ToastContainer } from "@/components/ui/Toast";
import { WishlistProvider } from "./context/WishlistContext";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Comforty Furniture Shop",
  description: "Created By Owais Abdullah",
};

const ClerkProvider = dynamic(
  () => import("@/components/sections/ClerkWrapper"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
        <link rel="preload" href="/globals.css" as="style" />
      </head>
      <body>
      <ClerkProvider
      afterSignUpUrl="/checkout" // Redirect to checkout after signup
    >
        <CartProvider>
        <WishlistProvider>
          <NotificationsProvider>
            <Header />
            {children}
            <ToastContainer />
            <Footer />
          </NotificationsProvider>
          </WishlistProvider>
        </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
