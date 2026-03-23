import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { base64, mimeType, fileName } = await req.json();
    if (!base64) return NextResponse.json({ error: "No file data" }, { status: 400 });

    // For plain text files, just decode
    if (mimeType === "text/plain" || mimeType === "text/csv" || fileName?.endsWith(".txt") || fileName?.endsWith(".csv")) {
      const text = Buffer.from(base64, "base64").toString("utf-8");
      return NextResponse.json({ text: text.slice(0, 8000) });
    }

    // For PDFs, use unpdf
    if (mimeType === "application/pdf" || fileName?.endsWith(".pdf")) {
      const buffer = Buffer.from(base64, "base64");
      const { extractText } = await import("unpdf");
      const { text: pdfText } = await extractText(buffer);
      const text = (Array.isArray(pdfText) ? pdfText.join("\n") : pdfText).replace(/\s{3,}/g, "\n\n").trim().slice(0, 8000);
      return NextResponse.json({ text });
    }

    return NextResponse.json({ text: "" });
  } catch (error) {
    console.error("File extraction error:", error);
    return NextResponse.json({ text: "" });
  }
}
