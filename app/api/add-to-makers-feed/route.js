// app/api/add-to-makers-feed/route.js
import { connectToDatabase } from '../../../utils/mongodb';

export async function POST(req) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const { imageUrl, description, type, color, quantity, email, firstName } = await req.json();

      const newListing = {
        imageUrl,
        description,
        type,
        color,
        quantity,
        email,
        firstName,
        createdAt: new Date(),
      };

      const result = await db.collection('makersFeed').insertOne(newListing);
      const insertedListing = await db.collection('makersFeed').findOne({ _id: result.insertedId });

      return new Response(JSON.stringify({ message: 'Listing added successfully', listing: insertedListing }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error inserting listing into MongoDB:", error);
      return new Response(JSON.stringify({ message: "Failed to insert listing into MongoDB" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
