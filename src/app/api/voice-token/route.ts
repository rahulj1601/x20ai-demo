import { NextRequest, NextResponse } from "next/server";

const AGENT_IDS: Record<string, string> = {
  en: process.env.ELEVENLABS_AGENT_ID_EN || "agent_9101kmjydpqkfc0trczsqpx67cj3",
  es: process.env.ELEVENLABS_AGENT_ID_ES || "agent_5501kmjyeedtfgyrbbm9jscst5gb",
  nl: process.env.ELEVENLABS_AGENT_ID_NL || "agent_6601kmjye2p3es7sypdxbp5bck0m",
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
