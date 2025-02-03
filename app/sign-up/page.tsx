'use client';

import SignUpForm from "@/components/ui/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;