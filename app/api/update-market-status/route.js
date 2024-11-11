// /app/api/update-market-status/route.js

import { connectToDatabase } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
    try {
        // Parse request body
        const { id, marketStatus, claimedBy } = await request.json();

        // Validate required fields
        if (!id || !marketStatus || !claimedBy) {
            return new Response(
                JSON.stringify({ success: false, message: 'Missing required fields.' }),
                { status: 400 }
            );
        }

        // Connect to the database
        const { db } = await connectToDatabase();

        // Update the item in the collectorsFeed collection
        const result = await db.collection('collectorsFeed').updateOne(
            { _id: new ObjectId(id) }, // Ensure `_id` is correctly handled as ObjectId
            { $set: { marketStatus, claimedBy } }
        );

        if (result.modifiedCount === 0) {
            return new Response(
                JSON.stringify({ success: false, message: 'No document found or updated.' }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error updating market status:', error);
        return new Response(
            JSON.stringify({ success: false, error: 'Internal server error' }),
            { status: 500 }
        );
    }
}
