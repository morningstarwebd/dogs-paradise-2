import { NextRequest, NextResponse } from "next/server";
import { groq, GROQ_MODEL } from "@/lib/groq";

export async function POST(req: NextRequest) {
  if (!groq) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const { breedName, type } = await req.json();

    if (!breedName) {
      return NextResponse.json({ error: "Breed name is required" }, { status: 400 });
    }

    const systemPrompt =
      type === "short"
        ? `You are an expert dog breeder and copywriter for 'Dogs Paradise'. Write a very brief, engaging 1-2 sentence short description for the dog breed: '${breedName}'. Focus on its temperament, suitability as a pet, and charm. DO NOT include any markdown formatting, asterisks, or quotes. Just the raw text.`
        : `You are an expert dog breeder and copywriter for 'Dogs Paradise'. Write a comprehensive and engaging long description for the dog breed: '${breedName}'. Include 2-3 well-structured paragraphs covering its history, temperament, care requirements, and why it makes a great companion. DO NOT use markdown headers or bold text (**). Just clean paragraphs separated by newlines.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a ${type} description for ${breedName}` }
      ],
      temperature: 0.6,
      max_tokens: type === "short" ? 150 : 600,
    });

    const generatedText = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error("[api/ai/breed-description] Error generating description:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
