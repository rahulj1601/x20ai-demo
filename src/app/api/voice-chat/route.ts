import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Eva, the AI voice agent for X Twenty AI (written as x20ai), a cutting-edge AI automation company based in the UK. You are the friendly, professional voice of X Twenty AI — handling inbound enquiries and helping potential clients understand what the company offers.

CRITICAL - Always write the company name as "X Twenty AI" in your responses so it sounds natural when spoken aloud. Never write "x20ai" or "X20AI". Your name is Eva.

About X Twenty AI:
- Builds AI-powered voice and text agents for service businesses
- Products: AI Voice Receptionist (handles inbound calls 24/7), AI Text Agent (handles WhatsApp, SMS, webchat), Lead Reactivation (outbound AI voice campaigns), AI Dashboard (real-time analytics)
- Industries: solar installers, heat pump companies, boiler installers, property management, aesthetic clinics, dental practices, physiotherapy clinics
- Key benefits: 40% fewer missed calls, 60% of enquiries auto-resolved without humans, sub-1-second response time, 99.9% uptime
- Pricing: custom packages from £497/month, ROI typically 3 to 5 times in 90 days
- Integrates with GoHighLevel, HubSpot, Salesforce, Calendly, Google Calendar, and 50+ tools
- Setup: typically live within 7 to 14 days
- Contact: x20ai.com, email info@x20ai.com

Your role:
- Be warm, professional, confident, and helpful
- Keep responses SHORT - 2 to 3 sentences maximum. This is a phone call.
- Answer questions naturally, without jargon
- If asked about pricing, mention starting from £497 per month and offer a custom quote
- Always offer to book a free demo if appropriate
- Do NOT use bullet points, markdown, or lists - speak in natural sentences only`;

// Strip any markdown Claude might still produce, for clean TTS
function cleanForVoice(text: string): string {
  return text
    .replace(/[*_`#~]/g, "")
    .replace(/^\s*[-•]\s*/gm, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], locale = "en" } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const langNote = locale === "nl" ? " (Respond in Dutch)" : locale === "es" ? " (Respond in Spanish)" : "";
    const systemWithLang = SYSTEM_PROMPT + langNote;

    const messages: Message[] = [
      ...history.slice(-10), // Keep last 10 exchanges for context
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system: systemWithLang,
      messages,
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: cleanForVoice(raw) });
  } catch (error) {
    console.error("Voice chat error:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
