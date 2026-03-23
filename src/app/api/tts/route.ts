import { NextRequest, NextResponse } from "next/server";

// ElevenLabs voice IDs
// aria (9BWtsMINqrJLrRacOk9x) - expressive, warm American female - excellent for multilingual
const VOICE_ID = "9BWtsMINqrJLrRacOk9x"; // Aria

// eleven_flash_v2_5: lowest latency (~75ms), multilingual, sounds incredibly human
// This is the best model for real-time voice - fast AND high quality
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

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

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
          stability: 0.4,       // slightly lower = more expressive
          similarity_boost: 0.8, // high clarity
          style: 0.2,           // slight style boost for natural warmth
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
