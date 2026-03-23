import { NextRequest, NextResponse } from "next/server";

// ElevenLabs voice IDs - professional sounding agents
const VOICE_IDS: Record<string, string> = {
  en: "21m00Tcm4TlvDq8ikWAM", // Rachel - clear, professional American female
  nl: "21m00Tcm4TlvDq8ikWAM", // Same voice, multilingual model handles Dutch
  es: "21m00Tcm4TlvDq8ikWAM", // Same voice, multilingual model handles Spanish
};

// eleven_flash_v2_5 = fastest (~75ms), great for real-time voice demos
// eleven_multilingual_v2 = highest quality, multilingual
const MODEL_ID = "eleven_flash_v2_5";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 503 });
  }

  try {
    const { text, locale = "en" } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const voiceId = VOICE_IDS[locale] ?? VOICE_IDS.en;
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("ElevenLabs error:", response.status, err);
      return NextResponse.json({ error: "TTS failed" }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("TTS route error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
