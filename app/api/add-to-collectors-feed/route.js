// // pages/api/add-to-feed.js
// import { MongoClient } from 'mongodb';
// import { NextApiRequest, NextApiResponse } from 'next';

// const client = new MongoClient(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// let clientPromise;

// const connectToDatabase = async () => {
//   if (!clientPromise) {
//     clientPromise = client.connect();
//   }
//   await clientPromise;
//   return client.db('your_database_name'); // replace with your database name
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const db = await connectToDatabase();
//       const { imageUrl, description, type, color, quantity, email, firstName } = req.body;

//       const newListing = {
//         imageUrl,
//         description,
//         type,
//         color,
//         quantity,
//         email,
//         firstName,
//         createdAt: new Date(),
//       };

//       const result = await db.collection('makersFeed').insertOne(newListing);
//       res.status(201).json({ message: 'Listing added successfully', listing: result.ops[0] });
//     } catch (error) {
//       console.error("Error inserting listing into MongoDB:", error);
//       res.status(500).json({ message: "Failed to insert listing into MongoDB" });
//     }
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }
