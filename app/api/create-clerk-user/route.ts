// app/api/create-clerk-user/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, mobile } = await request.json();

    // Create a new user in Clerk
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');

    const response = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email_addresses: [{ email }],
        phone_numbers: [{ phone_number: mobile }],
        password: "temp" + Math.random().toString(36).slice(-8)
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create Clerk user');
    }

    const newUser = await response.json();

    // Send verification email
    await fetch(`https://api.clerk.com/v1/users/${newUser.id}/email_addresses/${newUser.email_addresses[0].id}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating Clerk user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}