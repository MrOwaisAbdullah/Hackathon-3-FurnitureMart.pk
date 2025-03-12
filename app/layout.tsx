import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Comforty Furniture Shop",
  description: "Created By Owais Abdullah",
};

const WishlistProvider = dynamic(
  () => import("./context/WishlistContext").then(mod => mod.WishlistProvider),
  { ssr: false }
);
const NotificationsProvider = dynamic(
  () => import("./context/NotificationContext").then(mod => mod.NotificationsProvider),
  { ssr: false }
);
const CartProvider = dynamic(
  () => import("./context/CartContext").then(mod => mod.CartProvider),
  { ssr: false }
);
const ToastContainer = dynamic(
  () => import("@/components/ui/Toast").then(mod => mod.ToastContainer),
  { ssr: false }
);
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
