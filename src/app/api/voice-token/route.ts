import { NextResponse } from "next/server";

const AGENT_ID = process.env.ELEVENLABS_AGENT_ID || "agent_2701kmcgqbqve5bahqabmpf4tf7q";
const API_KEY = process.env.ELEVENLABS_API_KEY || "";

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
      { headers: { "xi-api-key": API_KEY } }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("ElevenLabs signed URL error:", response.status, err);
      return NextResponse.json({ error: "Failed to get conversation token" }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error("Voice token error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
