// app/api/collectors-feed.js
import { MongoClient, ObjectId } from 'mongodb';

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

// GET method: Fetch all listings and map _id to id
export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const collectorsFeed = await db.collection('collectorsFeed').find({}).toArray();

    // Map MongoDB _id to id for frontend consistency
    const mappedCollectorsFeed = collectorsFeed.map(item => ({
      ...item,
      id: item._id, // Assign _id to id
      _id: undefined, // Optionally remove _id if you don’t want it in the frontend
    }));

    return new Response(JSON.stringify(mappedCollectorsFeed), { status: 200 });
  } catch (error) {
    console.error("Error fetching feed from MongoDB:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch feed from MongoDB" }), { status: 500 });
  }
}

// DELETE method: Delete a listing by id
export async function DELETE(req) {
  try {
    const db = await connectToDatabase();
    const { id } = await req.json();

    // Ensure the id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: "Invalid ID format" }), { status: 400 });
    }

    const result = await db.collection('collectorsFeed').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return new Response(JSON.stringify({ message: "Item deleted successfully" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "Item not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting item from MongoDB:", error);
    return new Response(JSON.stringify({ message: "Failed to delete item from MongoDB" }), { status: 500 });
  }
}
// export async function POST(req) {
//   try {
//     const db = await connectToDatabase();
//     const newListing = await req.json();

//     const result = await db.collection('collectorsFeed').insertOne(newListing);
//     return new Response(JSON.stringify({ _id: result.insertedId, ...newListing }), { status: 201 });
//   } catch (error) {
//     console.error("Error adding listing to MongoDB:", error);
//     return new Response(JSON.stringify({ message: "Failed to add listing" }), { status: 500 });
//   }
// }


