import { NextRequest, NextResponse } from "next/server";

const VPS_ENDPOINT = process.env.VPS_AI_ENDPOINT || "http://187.77.176.54:4200";
const VPS_SECRET = process.env.VPS_AI_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const response = await fetch(`${VPS_ENDPOINT}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VPS_SECRET}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("VPS proxy error:", response.status, err);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
