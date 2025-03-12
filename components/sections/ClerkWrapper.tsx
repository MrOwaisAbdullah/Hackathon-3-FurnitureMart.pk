"use client";

import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

interface ClerkWrapperProps {
  children: React.ReactNode;
  afterSignUpUrl?: string;
}

export default function ClerkWrapper({ children, afterSignUpUrl }: ClerkWrapperProps) {
  return (
    <ClerkProvider afterSignUpUrl={afterSignUpUrl}>
      {children}
    </ClerkProvider>
  );
}
