import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image base64 is required' }, { status: 400 });
    }

    // Construct the prompt to analyze the base64 image
    const prompt = `Analyze the product in this image and generate a concise description. Include details about the product type, color, and quantity.`;

    // Use the base64 image in the GPT-4 request
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What is in this image?' },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64, // Send base64 image
              },
            },
          ],
        },
      ],
      max_tokens: 150,
    });

    const messageContent = completion.choices[0]?.message?.content?.trim();

    if (!messageContent) {
      return NextResponse.json({ error: 'No response from GPT' }, { status: 500 });
    }

    // Assuming the description comes in a structured format (Description, Type, Color, Quantity)
    const [description, type, color, quantity] = messageContent.split('\n').map(item => item.trim());

    return NextResponse.json({ description, type, color, quantity });
  } catch (error) {
    console.error('Error generating product details with GPT:', error);
    return NextResponse.json({ error: 'Error generating product details' }, { status: 500 });
  }
}
