// utils/userUtils.ts

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserData {
  clerkId: string;
  name: string;
  email: string;
  mobile: string;
  address: Address;
  addressHistory?: Address[];
  previousPhones?: string[];
  previousEmails?: string[];
}

import { ShippingDetails } from "@/typing";
import { UserResource } from "@clerk/types";

export async function saveUser(userData: UserData) {
  try {
    console.log("Saving user data to Sanity:", userData);

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Sanity API error:", data);
      throw new Error(data.error || 'Failed to save user data');
    }

    console.log("User data saved successfully.");
    return await response.json();
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const response = await fetch(`/api/user?clerkId=${clerkId}`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function syncUserWithClerk(user: UserResource, shippingDetails: ShippingDetails) {
  try {
    await user.update({
      firstName: shippingDetails.name.split(' ')[0],
      lastName: shippingDetails.name.split(' ').slice(1).join(' '),
      unsafeMetadata: {
        phoneNumber: shippingDetails.mobile,
        address: {
          street: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state || "",
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country
        }
      }
    });
    return true;
  } catch (error) {
    console.error('Error updating Clerk user:', error);
    throw error;
  }
}