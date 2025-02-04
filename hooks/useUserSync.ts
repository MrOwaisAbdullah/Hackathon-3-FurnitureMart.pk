import { useState } from 'react';
import { useUser, useSignIn } from '@clerk/nextjs';
import { getUserByClerkId, saveUser } from '@/utils/userUtils';
import { ShippingDetails } from '@/typing';
import { useNotifications } from '@/app/context/NotificationContext';

interface UserSyncResult {
  syncUser: (shippingDetails: ShippingDetails) => Promise<boolean>;
  isLoading: boolean;
}

const createNewClerkUser = async (shippingDetails: ShippingDetails) => {
  try {
    const response = await fetch('/api/create-clerk-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shippingDetails),
    });
    if (!response.ok) {
      throw new Error('Failed to create new Clerk user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating new Clerk user:', error);
    return null;
  }
};

export const useUserSync = (): UserSyncResult | false => {
  const { user } = useUser();
  const { signIn } = useSignIn();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async (clerkId: string) => {
    try {
      const userData = await getUserByClerkId(clerkId);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const syncUser = async (shippingDetails: ShippingDetails): Promise<boolean> => {
    if (!user) {
      addNotification('User session not found', 'error');
      return false;
    }
  
    setIsLoading(true);
    try {
      console.log("Fetching existing user data...");
      const existingUser = await fetchUserData(user.id);
      console.log("Existing user data:", existingUser);
  
      const detailsMatch = existingUser && (
        existingUser.mobile === shippingDetails.mobile ||
        existingUser.email === shippingDetails.email
      );
  
      if (existingUser && !detailsMatch) {
        const confirmNewUser = window.confirm(
          'The shipping details do not match the existing user profile. Would you like to create a new account with these details?'
        );
  
        if (confirmNewUser) {
          try {
            const newClerkUser = await createNewClerkUser(shippingDetails);
            if (!newClerkUser) {
              throw new Error('Failed to create new Clerk user');
            }
  
            await saveUser({
              clerkId: newClerkUser.id,
              name: shippingDetails.name,
              email: shippingDetails.email,
              mobile: shippingDetails.mobile,
              address: {
                street: shippingDetails.address,
                city: shippingDetails.city,
                state: shippingDetails.state || '',
                postalCode: shippingDetails.postalCode,
                country: shippingDetails.country,
              },
            });
  
            await signIn?.create({ identifier: shippingDetails.email });
            addNotification('New account created successfully', 'success');
            return true;
          } catch (error) {
            console.error('Error in user sync:', error);
            addNotification('Failed to sync user information', 'error');
            return false;
          } finally {
            setIsLoading(false);
          }
        } else {
          return false;
        }
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
          state: shippingDetails.state || '',
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country,
        },
      });
  
      console.log("Syncing with Clerk metadata...");
      try {
        await user.update({
          firstName: shippingDetails.name.split(' ')[0],
          lastName: shippingDetails.name.split(' ').slice(1).join(' '),
          unsafeMetadata: {
            address: {
              street: shippingDetails.address,
              city: shippingDetails.city,
              state: shippingDetails.state || '',
              postalCode: shippingDetails.postalCode,
              country: shippingDetails.country,
            },
            phoneNumber: shippingDetails.mobile
          },
        });
      
        // Handle email first
        if (shippingDetails.email) {
          // Check if email exists in Clerk
          const existingEmail = user.emailAddresses.find(
            (ea) => ea.emailAddress === shippingDetails.email
          );
      
          if (!existingEmail) {
            try {
              // Create new email if it doesn't exist
              const newEmail = await user.createEmailAddress({
                email: shippingDetails.email,
              });
              
              // Prepare verification for the new email
              await newEmail.prepareVerification({
                strategy: 'email_code'
            });
              addNotification("A verification email has been sent to your inbox.", "info");
              return false;
            } catch (error) {
              console.error('Error creating email:', error);
              throw error;
            }
          } else if (existingEmail.verification?.status !== "verified") {
            // If email exists but isn't verified
            await existingEmail.prepareVerification({
                strategy: 'email_code'
            });
            addNotification("Please verify your email address.", "info");
            return false;
          }
      
          // Set as primary email if verified
          if (existingEmail?.verification?.status === "verified") {
            await user.update({
              primaryEmailAddressId: existingEmail.id
            });
          }
        }
      
        addNotification('User information updated successfully', 'success');
        return true;
      } catch (error) {
        console.error('Error in user sync:', error);
        addNotification('Failed to sync user information', 'error');
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return user ? { syncUser, isLoading } : false;
};