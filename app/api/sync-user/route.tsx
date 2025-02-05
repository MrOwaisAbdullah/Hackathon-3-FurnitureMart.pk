// import { client } from "@/sanity/lib/client";

// export async function POST(req: Request) {
//   const { userId, name, email, phone, address, role } = await req.json();

//   try {
//     await client.createIfNotExists({
//       _id: userId,
//       _type: 'user',
//       name,
//       email,
//       phone,
//       address,
//       role,
//     });

//     return new Response(JSON.stringify({ message: 'User synced successfully!' }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error('Error syncing user with Sanity:', error);
//     return new Response(JSON.stringify({ message: 'Failed to sync user.' }), {
//       status: 500,
//     });
//   }
// }