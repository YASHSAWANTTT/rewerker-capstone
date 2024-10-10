import { NextRequest, NextResponse } from "next/server";
import openai from "openai";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    // // Mock response instead of calling OpenAI API
    // const mockResponse = {
    //   description:
    //     "The image shows three utensils: two forks and one spoon, all made of tarnished silver metal. The top fork has a simple, beaded-edge handle, while the bottom fork has a floral pattern on the handle. The spoon is plain with a smooth, slightly worn appearance. All items have a vintage look.",
    //   type: "Metal",
    //   color: "Tarnished silver",
    //   quantity: "Two forks and one spoon",
    // };

    // return NextResponse.json(mockResponse);

    // Uncomment below for real API calls once your quota is increased
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Describe the product in this image: ${imageUrl}` },
      ],
    });

    const messageContent = completion?.choices?.[0]?.message?.content?.trim();

    if (!messageContent) {
      return NextResponse.json({ error: 'No response from GPT' }, { status: 500 });
    }

    const [description, type, color, quantity] = messageContent.split('\n').map((item) => item.trim());

    return NextResponse.json({ description, type, color, quantity });
    
  } catch (error) {
    console.error("Error generating product details with GPT:", error);
    return NextResponse.json(
      { error: "Error generating product details" },
      { status: 500 }
    );
  }
}
