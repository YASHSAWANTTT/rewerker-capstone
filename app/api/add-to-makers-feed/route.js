import { connectToDatabase } from '../../../utils/mongodb';

export async function POST(req) {
  try {
    const { db } = await connectToDatabase(); // Ensure destructuring `db`
    const { imageUrl, description, type, color, quantity, email, firstName, businessName } = await req.json();

    // Check for existing listing with the same imageUrl, email, and createdAt within a short timeframe
    const existingListing = await db.collection('makersFeed').findOne({
      imageUrl,
      email,
      createdAt: { $gte: new Date(Date.now() - 10000) } // Adjust time range as needed
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
      businessName,
      createdAt: new Date(),
    };

    const result = await db.collection('makersFeed').insertOne(newListing);

    return new Response(JSON.stringify({ message: 'Listing added successfully', listing: { ...newListing, _id: result.insertedId } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error inserting listing into MongoDB:", error);
    return new Response(JSON.stringify({ message: "Failed to insert listing into MongoDB", error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
