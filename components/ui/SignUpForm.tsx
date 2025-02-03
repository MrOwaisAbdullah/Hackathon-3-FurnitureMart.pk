// app/signup/components/SignUpForm.tsx
'use client';
import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      // Start the signup process
      await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        password: formData.password,
        unsafeMetadata: {
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          role: 'customer',
        },
      });

      // Verify the email address (optional)
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Sync user data with Sanity
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: signUp.createdUserId,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phoneNumber,
          address: formData.address,
          role: 'customer',
        }),
      });

      if (response.ok) {
        console.log('User data synced with Sanity');
      } else {
        console.error('Failed to sync user data with Sanity');
      }

      // Set the user as active and redirect to the checkout page
      await setActive({ session: signUp.createdSessionId });
      router.push('/checkout');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
      />
      {/* Repeat for email, password, phone, and address */}
      <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;