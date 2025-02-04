import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { nanoid } from 'nanoid';

// Helper function to add keys to array items
function addKeysToArrayItems<T extends object>(items: T[]): (T & { _key: string })[] {
  return items.map(item => ({
    ...item,
    _key: nanoid() // Generates a unique key for each array item
  }));
}

// GET request handler
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    const user = await client.fetch(
      `*[_type == "user" && clerkId == $clerkId][0]`,
      { clerkId }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// POST request handler
export async function POST(request: Request) {
  try {
    const { clerkId, name, email, address, mobile } = await request.json();

    if (!clerkId || !name || !email || !address || !mobile) {
      console.error("Missing required fields in request:", { clerkId, name, email, address, mobile });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists by mobile number
    const existingUserByMobile = await client.fetch(
      `*[_type == "user" && mobile == $mobile][0]`,
      { mobile }
    );

    // Check if user exists by clerkId
    const existingUserByClerkId = !existingUserByMobile
      ? await client.fetch(`*[_type == "user" && clerkId == $clerkId][0]`, {
          clerkId,
        })
      : null;

    const existingUser = existingUserByMobile || existingUserByClerkId;

    if (existingUser) {
      console.log("Updating existing user:", existingUser._id);

      // Prepare historical data with keys
      const addressHistory = existingUser.addressHistory || [];
      const previousPhones = existingUser.previousPhones || [];
      const previousEmails = existingUser.previousEmails || [];

      if (JSON.stringify(existingUser.address) !== JSON.stringify(address)) {
        addressHistory.push({
          ...existingUser.address,
          _key: nanoid()
        });
      }

      if (existingUser.mobile !== mobile) {
        previousPhones.push({
          value: existingUser.mobile,
          _key: nanoid()
        });
      }

      if (existingUser.email !== email) {
        previousEmails.push({
          value: existingUser.email,
          _key: nanoid()
        });
      }

      // Update existing user
      const updatedUser = await client
        .patch(existingUser._id)
        .set({
          clerkId,
          name,
          email,
          mobile,
          address,
          addressHistory: addKeysToArrayItems(addressHistory),
          previousPhones: previousPhones.map((phone: { value: string; _key: string } | string) => 
            typeof phone === 'string' 
              ? { value: phone, _key: nanoid() }
              : phone
          ),
          previousEmails: previousEmails.map((email: { value: string; _key: string } | string)=> 
            typeof email === 'string' 
              ? { value: email, _key: nanoid() }
              : email
          ),
        })
        .commit();

      console.log("User updated successfully:", updatedUser);
      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } else {
      console.log("Creating new user...");

      // Create new user with empty arrays (they'll have keys when items are added)
      const newUser = await client.create({
        _type: "user",
        clerkId,
        name,
        email,
        mobile,
        address,
        addressHistory: [],
        previousPhones: [],
        previousEmails: [],
      });

      console.log("New user created successfully:", newUser);
      return NextResponse.json({ user: newUser }, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to save user data:", error);
    return NextResponse.json(
      { error: "Failed to save user data" },
      { status: 500 }
    );
  }
}