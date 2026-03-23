import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the x20ai AI assistant - a knowledgeable, helpful chat agent for x20ai's website.

About x20ai:
- x20ai builds AI-powered voice and text agents for service businesses
- Products:
  - **AI Voice Receptionist**: Handles inbound calls 24/7, books appointments, answers FAQs, qualifies leads
  - **AI Text Agent**: Handles WhatsApp, SMS, and webchat enquiries instantly
  - **Lead Reactivation**: Outbound AI voice campaigns to re-engage cold leads
  - **AI Dashboard**: Real-time analytics showing calls handled, sentiment, resolution rates
- Industries served: solar installers, heat pump companies, boiler installers, property management, aesthetic clinics, dental practices, physiotherapy clinics
- Key benefits:
  - 40% fewer missed calls
  - 60% of enquiries auto-resolved without human intervention
  - Sub-1-second response time
  - 99.9% uptime SLA
  - Integrates with GoHighLevel, HubSpot, Salesforce, Calendly, Google Calendar, and 50+ tools
- Pricing: custom packages from £497/month, ROI typically 3-5x in 90 days
- Setup: typically live within 7-14 days
- Company based in UK, serving clients across UK and Europe
- Book a free demo: x20ai.com | Email: info@x20ai.com

Your response format (REQUIRED - return valid JSON only, no markdown code blocks):
{"reply":"your response here in markdown format","suggestions":["question 1","question 2","question 3"]}

Rules:
- reply: Use markdown formatting (bold, bullet lists, headers where appropriate). Keep responses helpful and concise. Max 200 words.
- suggestions: Always provide exactly 3 relevant follow-up questions the user might want to ask next. Keep them short (under 10 words each).
- Never break the JSON format. Escape any quotes inside strings properly.
- Match the user's language (English/Dutch/Spanish).`;

type HistoryMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], locale = "en" } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const langNote = locale === "nl" ? " (Respond in Dutch)" : locale === "es" ? " (Respond in Spanish)" : "";

    const messages: HistoryMessage[] = [
      ...history.slice(-8),
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: SYSTEM_PROMPT + langNote,
      messages,
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "{}";

    // Parse the JSON response
    let reply = "";
    let suggestions: string[] = [];
    try {
      const parsed = JSON.parse(raw);
      reply = parsed.reply ?? "";
      suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [];
    } catch {
      // If JSON parse fails, use raw text as reply with fallback suggestions
      reply = raw;
      suggestions = getDefaultSuggestions(locale);
    }

    return NextResponse.json({ reply, suggestions });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}

function getDefaultSuggestions(locale: string): string[] {
  if (locale === "nl") return ["Wat kost het?", "Hoe snel kan het live?", "Welke branches doen jullie?"];
  if (locale === "es") return ["¿Cuánto cuesta?", "¿Cuándo puede estar listo?", "¿Qué sectores cubrís?"];
  return ["How much does it cost?", "How quickly can I go live?", "What industries do you serve?"];
}
