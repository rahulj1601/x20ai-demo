import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const VPS_ENDPOINT = process.env.VPS_AI_ENDPOINT || "http://187.77.176.54:4200";
const VPS_SECRET = process.env.VPS_AI_SECRET || "";
// OAuth token used as API key for vision — pulled from VPS credentials
const OAUTH_TOKEN = process.env.VPS_OAUTH_TOKEN || "";

const SYSTEM_PROMPT = `You are the x20ai AI assistant - a knowledgeable, helpful chat agent for x20ai's website.

About x20ai:
- x20ai builds AI-powered voice and text agents for service businesses
- Products:
  - **AI Voice Receptionist**: Handles inbound calls 24/7, books appointments, answers FAQs, qualifies leads
  - **AI Text Agent**: Handles WhatsApp, SMS, and webchat enquiries instantly
  - **Lead Reactivation**: Outbound AI voice campaigns to re-engage cold leads
  - **AI Dashboard**: Real-time analytics showing calls handled, sentiment, resolution rates
- Industries served: solar installers, heat pump companies, boiler installers, property management, aesthetic clinics, dental practices, physiotherapy clinics
- Key benefits: 40% fewer missed calls, 60% of enquiries auto-resolved without human intervention, sub-1-second response time, 99.9% uptime SLA
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

function getDefaultSuggestions(locale: string): string[] {
  if (locale === "nl") return ["Wat kost het?", "Hoe snel kan het live?", "Welke branches doen jullie?"];
  if (locale === "es") return ["¿Cuánto cuesta?", "¿Cuándo puede estar listo?", "¿Qué sectores cubrís?"];
  return ["How much does it cost?", "How quickly can I go live?", "What industries do you serve?"];
}

type HistoryEntry = { role: "user" | "assistant"; content: string };

async function handleWithVision(
  message: string,
  imageBase64: string,
  imageMimeType: string,
  history: HistoryEntry[],
  locale: string
) {
  const client = new Anthropic({ apiKey: OAUTH_TOKEN });
  const langNote = locale === "nl" ? " (Respond in Dutch)" : locale === "es" ? " (Respond in Spanish)" : "";

  const messages: Anthropic.MessageParam[] = [
    ...history.slice(-8).map((h) => ({ role: h.role, content: h.content })),
    {
      role: "user" as const,
      content: [
        { type: "image" as const, source: { type: "base64" as const, media_type: imageMimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: imageBase64 } },
        { type: "text" as const, text: message || "What can you tell me about this?" },
      ],
    },
  ];

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    system: SYSTEM_PROMPT + langNote,
    messages,
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "{}";
  try {
    const parsed = JSON.parse(raw);
    return { reply: parsed.reply ?? raw, suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : getDefaultSuggestions(locale) };
  } catch {
    return { reply: raw, suggestions: getDefaultSuggestions(locale) };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], locale = "en", fileContent, fileName, fileType, fileContext } = body;

    if (!message && !fileContent) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Image files: use vision via Anthropic SDK with OAuth token
    if (fileContent && fileType?.startsWith("image/") && OAUTH_TOKEN) {
      try {
        const result = await handleWithVision(message || "", fileContent, fileType, history, locale);
        return NextResponse.json(result);
      } catch (err) {
        console.error("Vision API error:", err);
        // Fall through to VPS proxy with file description
      }
    }

    // Build message with file context for VPS proxy
    let enrichedMessage = message || "";

    // Knowledge base context (accumulated uploaded docs)
    if (fileContext) {
      const contextBlock = fileContext.length > 30000 ? fileContext.slice(0, 30000) + "\n...[truncated]" : fileContext;
      enrichedMessage = `[Documents uploaded by user:]\n\n${contextBlock}\n\n[User question:]\n${enrichedMessage || "Please summarise these documents and tell me how x20ai could help."}`;
    } else if (fileContent && !fileType?.startsWith("image/")) {
      // Single file attachment (legacy path)
      const truncated = fileContent.length > 4000 ? fileContent.slice(0, 4000) + "\n...[truncated]" : fileContent;
      enrichedMessage = `[Attached file: ${fileName}]\n\n${truncated}\n\n${message || "Please summarise this document and tell me how x20ai could help."}`;
    } else if (fileContent && fileType?.startsWith("image/") && !OAUTH_TOKEN) {
      enrichedMessage = `[User attached an image: ${fileName}] ${message || ""}`;
    }

    const response = await fetch(`${VPS_ENDPOINT}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${VPS_SECRET}` },
      body: JSON.stringify({ message: enrichedMessage, history, locale }),
    });

    if (!response.ok) {
      console.error("VPS proxy error:", response.status);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
