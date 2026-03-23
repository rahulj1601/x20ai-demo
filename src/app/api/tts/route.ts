import { NextRequest, NextResponse } from "next/server";

// Voice selection: Grace (US) for EN/ES, Amy (UK) for NL or when specified
// Grace - Customer Service Angel (American): kSDv9EbJ41pJUICMEOOu
// Amy - Warm, Bright and Approachable (British): n3Vun1rdyiQUF5EqCtmC
const VOICES = {
  grace: "kSDv9EbJ41pJUICMEOOu", // US - Grace
  amy: "n3Vun1rdyiQUF5EqCtmC",   // UK - Amy
};

// eleven_flash_v2_5: ~75ms latency, multilingual, sounds incredibly human
const MODEL_ID = "eleven_flash_v2_5";

// Normalise text so ElevenLabs reads it naturally
function normaliseForSpeech(text: string): string {
  return text
    // "x20ai" / "X20AI" / "x20 ai" -> "X Twenty AI" (the business name)
    .replace(/\bx20\s*ai\b/gi, "X Twenty AI")
    // "x20" standalone -> "X Twenty"
    .replace(/\bx20\b/gi, "X Twenty")
    // Strip markdown symbols that would be read aloud
    .replace(/[*_`#~]/g, "")
    // Bullet points -> natural pause
    .replace(/^\s*[-•]\s*/gm, "")
    // Multiple spaces/newlines -> single space
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 503 });
  }

  try {
    const { text, locale = "en", voice = "grace" } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const voiceId = voice === "amy" ? VOICES.amy : VOICES.grace;
    const cleanText = normaliseForSpeech(text);
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.80,
          style: 0.15,
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
