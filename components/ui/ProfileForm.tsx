"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { useNotifications } from "@/app/context/NotificationContext";

// Zod schema for profile validation
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data from Sanity when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user?clerkId=${user.id}`);
          const data = await response.json();
          if (data.user) {
            setFormData(data.user);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const [parent, child] = name.split(".") as [keyof ProfileFormData, string];
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const { addNotification } = useNotifications();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      profileSchema.parse(formData);
      setErrors({});

      // Save or update user profile
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user?.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
      addNotification("Profile saved successfully!", "success");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<string, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path.join(".")] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        addNotification("Failed to save profile. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <div className="space-y-2">
          <input
            name="address.street"
            type="text"
            placeholder="Street"
            value={formData.address.street}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors["address.street"] && (
            <p className="text-red-500 text-xs mt-1">{errors["address.street"]}</p>
          )}

          <input
            name="address.city"
            type="text"
            placeholder="City"
            value={formData.address.city}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors["address.city"] && (
            <p className="text-red-500 text-xs mt-1">{errors["address.city"]}</p>
          )}

          <input
            name="address.state"
            type="text"
            placeholder="State"
            value={formData.address.state}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors["address.state"] && (
            <p className="text-red-500 text-xs mt-1">{errors["address.state"]}</p>
          )}

          <input
            name="address.postalCode"
            type="text"
            placeholder="Postal Code"
            value={formData.address.postalCode}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors["address.postalCode"] && (
            <p className="text-red-500 text-xs mt-1">{errors["address.postalCode"]}</p>
          )}

          <input
            name="address.country"
            type="text"
            placeholder="Country"
            value={formData.address.country}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors["address.country"] && (
            <p className="text-red-500 text-xs mt-1">{errors["address.country"]}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
};

export default ProfileForm;