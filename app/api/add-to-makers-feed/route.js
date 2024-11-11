// pages/api/add-to-makers-feed.js
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const { imageUrl, description, type, color, quantity, businessName, firstName } = req.body;

      const newListing = {
        imageUrl,
        description,
        type,
        color,
        quantity,
        businessName,
        firstName,
        createdAt: new Date(),
      };

      const result = await db.collection('makersFeed').insertOne(newListing);
      const insertedListing = await db.collection('makersFeed').findOne({ _id: result.insertedId });

      res.status(201).json({ message: 'Listing added successfully', listing: insertedListing });
    } catch (error) {
      console.error("Error inserting listing into MongoDB:", error);
      res.status(500).json({ message: "Failed to insert listing into MongoDB" });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
