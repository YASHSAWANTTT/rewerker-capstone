// pages/api/makers-feed.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let clientPromise;

const connectToDatabase = async () => {
  if (!clientPromise) {
    clientPromise = client.connect();
  }
  await clientPromise;
  return client.db('your_database_name'); // replace with your actual database name
};

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const collectorsFeed = await db.collection('collectorsFeed').find({}).toArray();

    return new Response(JSON.stringify(collectorsFeed), { status: 200 });
  } catch (error) {
    console.error("Error fetching feed from MongoDB:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch feed from MongoDB" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const newListing = await req.json();

    const result = await db.collection('collectorsFeed').insertOne(newListing);
    return new Response(JSON.stringify({ _id: result.insertedId, ...newListing }), { status: 201 });
  } catch (error) {
    console.error("Error adding listing to MongoDB:", error);
    return new Response(JSON.stringify({ message: "Failed to add listing" }), { status: 500 });
  }
}

