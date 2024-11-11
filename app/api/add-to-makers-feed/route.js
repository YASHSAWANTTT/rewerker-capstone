// app/api/add-to-makers-feed/route.js
import { connectToDatabase } from '../../../utils/mongodb';

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const { imageUrl, description, type, color, quantity, email, firstName, businessName } = await req.json();

    // Check for existing listing with the same imageUrl, email, and createdAt within a short timeframe
    const existingListing = await db.collection('makersFeed').findOne({
      imageUrl,
      email,
      createdAt: { $gte: new Date(Date.now() - 10000) } // adjust time range as needed
    });

    if (existingListing) {
      return new Response(JSON.stringify({ message: "Duplicate listing detected" }), {
        status: 409, // 409 Conflict
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newListing = {
      imageUrl,
      description,
      type,
      color,
      quantity,
      email,
      firstName,
      businessName, // Make sure businessName is included here
      createdAt: new Date(),
    };

    const result = await db.collection('makersFeed').insertOne(newListing);
    newListing._id = result.insertedId;

    return new Response(JSON.stringify({ message: 'Listing added successfully', listing: newListing }), {
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
}

