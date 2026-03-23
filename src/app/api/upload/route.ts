import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function splitText(text: string, chunkSize = 800, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) chunks.push(chunk);
    start += chunkSize - overlap;
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    let text: string;
    let fileName: string;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      text = body.text;
      fileName = body.fileName;
      if (!text || !fileName) {
        return NextResponse.json({ error: "Missing text or fileName" }, { status: 400 });
      }
    } else {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "Missing file" }, { status: 400 });
      }

      fileName = file.name;
      const ext = "." + fileName.split(".").pop()?.toLowerCase();
      const allowed = [".pdf", ".txt", ".md", ".csv", ".json", ".docx"];

      if (!allowed.includes(ext)) {
        return NextResponse.json({ error: "Unsupported file type. Upload PDF, DOCX, TXT, MD, CSV, or JSON." }, { status: 400 });
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large. Maximum 10MB." }, { status: 400 });
      }

      if (ext === ".pdf") {
        const buffer = await file.arrayBuffer();
        const { extractText } = await import("unpdf");
        const { text: pdfText } = await extractText(buffer);
        text = Array.isArray(pdfText) ? pdfText.join("\n") : pdfText;
      } else if (ext === ".docx") {
        const buffer = await file.arrayBuffer();
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
        text = result.value;
      } else {
        text = await file.text();
      }
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from file." }, { status: 400 });
    }

    // Truncate to 8000 chars per doc
    const truncated = text.length > 8000 ? text.slice(0, 8000) + "\n...[truncated]" : text;

    return NextResponse.json({
      success: true,
      fileName,
      text: truncated,
      charCount: truncated.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
}
