import { NextRequest, NextResponse } from "next/server";

const AGENT_IDS: Record<string, string> = {
  en: process.env.ELEVENLABS_AGENT_ID_EN || "agent_2701kmcgqbqve5bahqabmpf4tf7q",
  es: process.env.ELEVENLABS_AGENT_ID_ES || "agent_0101kmchv5n0egrays6354fx7j37",
  nl: process.env.ELEVENLABS_AGENT_ID_NL || "agent_0501kmchvpddetpty0ejw00wy315",
};

const API_KEY = process.env.ELEVENLABS_API_KEY || "";

export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 503 });
  }

  const locale = req.nextUrl.searchParams.get("locale") || "en";
  const agentId = AGENT_IDS[locale] ?? AGENT_IDS.en;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
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
