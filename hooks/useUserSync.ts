import { useNotifications } from "@/app/context/NotificationContext";
import { ShippingDetails } from "@/typing";
import { getUserByClerkId, saveUser } from "@/utils/userUtils";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

interface UserSyncResult {
  syncUser: (shippingDetails: ShippingDetails) => Promise<boolean>;
  isLoading: boolean;
}

export const useUserSync = (): UserSyncResult | false => {
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async (clerkId: string) => {
    try {
      const userData = await getUserByClerkId(clerkId);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      addNotification("Failed to fetch user data. Please try again.", "error");
      return null;
    }
  };

  const syncUser = async (shippingDetails: ShippingDetails): Promise<boolean> => {
    if (!user) {
      addNotification("User session not found", "error");
      return false;
    }

    setIsLoading(true);

    try {
      console.log("Fetching existing user data...");
      const existingUser = await fetchUserData(user.id);

      const detailsMatch = existingUser && (
        existingUser.mobile === shippingDetails.mobile &&
        existingUser.email === shippingDetails.email &&
        existingUser.address?.street === shippingDetails.address &&
        existingUser.address?.city === shippingDetails.city &&
        existingUser.address?.postalCode === shippingDetails.postalCode &&
        existingUser.address?.country === shippingDetails.country
      );

      if (detailsMatch) {
        console.log("Shipping details match existing user data. Skipping update.");
        addNotification("User information is up to date.", "info");
        return true;
      }

      console.log("Updating or creating user in Sanity...");
      await saveUser({
        clerkId: user.id,
        name: shippingDetails.name,
        email: shippingDetails.email,
        mobile: shippingDetails.mobile,
        address: {
          street: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state || "",
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country,
        },
      });

      console.log("Syncing with Clerk metadata...");
      await user.update({
        firstName: shippingDetails.name.split(" ")[0],
        lastName: shippingDetails.name.split(" ").slice(1).join(" "),
        unsafeMetadata: {
          address: {
            street: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state || "",
            postalCode: shippingDetails.postalCode,
            country: shippingDetails.country,
          },
          phoneNumber: shippingDetails.mobile,
        },
      });

      // Handle email first
      const existingEmail = user.emailAddresses.find(
        (ea) => ea.emailAddress === shippingDetails.email
      );

      if (!existingEmail) {
        try {
          const newEmail = await user.createEmailAddress({
            email: shippingDetails.email,
          });
          await newEmail.prepareVerification({ strategy: "email_code" });
          addNotification(
            "A verification email has been sent to your inbox. Please verify your email to proceed.",
            "info"
          );
          return false;
        } catch (error) {
          console.error("Error creating email:", error);
          addNotification(
            "Failed to create email address. Please try again later.",
            "error"
          );
          return false;
        }
      } else if (existingEmail.verification?.status !== "verified") {
        await existingEmail.prepareVerification({ strategy: "email_code" });
        addNotification(
          "Your email is not verified. A verification email has been sent to your inbox.",
          "info"
        );
        return false;
      }

      if (existingEmail?.verification?.status === "verified") {
        await user.update({
          primaryEmailAddressId: existingEmail.id,
        });
      }

      addNotification("User information updated successfully", "success");
      return true;
    } catch (error) {
      console.error("Error in user sync:", error);
      addNotification("Failed to sync user information", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return user ? { syncUser, isLoading } : false;
};