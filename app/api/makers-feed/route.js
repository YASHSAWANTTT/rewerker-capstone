// app/api/makers-feed.js
import { MongoClient, ObjectId } from "mongodb";

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
  return client.db("your_database_name"); // replace with your actual database name
};

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const makersFeed = await db.collection("makersFeed").find({}).toArray();

    // Map MongoDB _id to id for frontend consistency
    const mappedMakersFeed = makersFeed.map((item) => ({
      ...item,
      id: item._id, // Add `id` for frontend compatibility
      _id: undefined, // Optionally remove `_id` if you don’t want it to appear in the frontend
    }));

    return new Response(JSON.stringify(mappedMakersFeed), { status: 200 });
  } catch (error) {
    console.error("Error fetching makers feed from MongoDB:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch makers feed" }),
      { status: 500 }
    );
  }
}

// export async function POST(req) {
//   try {
//     const db = await connectToDatabase();
//     const newListing = await req.json();

//     const result = await db.collection('makersFeed').insertOne(newListing);
//     return new Response(JSON.stringify({ _id: result.insertedId, ...newListing }), { status: 201 });
//   } catch (error) {
//     console.error("Error adding listing to MongoDB:", error);
//     return new Response(JSON.stringify({ message: "Failed to add listing" }), { status: 500 });
//   }
// }

export async function DELETE(req) {
  try {
    const db = await connectToDatabase();
    const { id } = await req.json();

    const result = await db
      .collection("makersFeed")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Item deleted successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error deleting item from MongoDB:", error);
    return new Response(JSON.stringify({ message: "Failed to delete item" }), {
      status: 500,
    });
  }
}
