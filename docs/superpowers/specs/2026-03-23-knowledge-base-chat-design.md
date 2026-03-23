# Knowledge Base Chat - Design Spec

**Date:** 2026-03-23
**Status:** Approved

## Summary

Add file upload + knowledge base querying to the x20ai text chat. Visitors upload documents during a session, the system extracts and stores text in React state, and every subsequent message includes all document context so the AI can answer from it.

## Constraints

- Session-scoped only (no persistence, no database)
- No OpenAI dependency - all chat goes through VPS `claude -p` (free)
- Context stuffing approach (no vector embeddings, no RAG retrieval)
- Leverage existing file extraction from `rag-chatbot-demo` (`unpdf` for PDFs, `mammoth` for DOCX)
- Multi-language support (en/es/nl) preserved

## Architecture

### Data Flow

1. User attaches file(s) via existing paperclip button
2. Client sends file to `/api/upload` endpoint
3. Server extracts text (PDF via `unpdf`, DOCX via `mammoth`, plain text decoded directly)
4. Extracted text returned to client
5. Client accumulates document texts in React state (`knowledgeBase` array)
6. On each chat message, all stored document texts are concatenated and sent as `fileContext` to `/api/chat`
7. `/api/chat` prepends document context to the message before forwarding to VPS `claude -p`
8. Claude answers grounded in all uploaded document content

### File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/api/upload/route.ts` | Create | Extract text from PDF/DOCX/TXT/CSV/MD/JSON. Port extraction logic from rag-chatbot-demo. Max 10MB per file. |
| `src/app/api/chat/route.ts` | Modify | Accept `fileContext` field. Prepend to message as document context block before sending to VPS. |
| `src/app/chat/page.tsx` | Modify | Add `knowledgeBase` state array. On file upload, call `/api/upload`, store extracted text. On send, include accumulated context. Show uploaded file count indicator. |
| `src/app/api/extract-file/route.ts` | Remove or keep as fallback | Replaced by `/api/upload` which handles more formats. |
| `package.json` | Modify | Add `unpdf`, `mammoth` dependencies. Remove `pdf-parse` (replaced by `unpdf`). |

### API: POST /api/upload

**Request:** FormData with `file` field (max 10MB)

**Response:**
```json
{
  "fileName": "report.pdf",
  "text": "extracted text content...",
  "charCount": 4500
}
```

**Supported formats:** PDF, DOCX, TXT, MD, CSV, JSON

### API: POST /api/chat (modified)

**New field in request body:**
```json
{
  "message": "What does the report say about revenue?",
  "history": [...],
  "locale": "en",
  "fileContext": "--- Document: report.pdf ---\n[extracted text]\n\n--- Document: notes.txt ---\n[extracted text]",
  "fileContent": "base64...",  // existing image field
  "fileName": "image.png",     // existing image field
  "fileType": "image/png"      // existing image field
}
```

The `fileContext` field is the concatenated knowledge base. It gets prepended to the message sent to VPS:

```
[Documents uploaded by user:]

--- Document: report.pdf ---
[text]

--- Document: notes.txt ---
[text]

[User question:]
What does the report say about revenue?
```

### Client State

```typescript
type KnowledgeDoc = {
  name: string;
  text: string;
  charCount: number;
};

// In ChatDemo component:
const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeDoc[]>([]);
```

### UI Changes

- Existing paperclip button now routes non-image files through `/api/upload` instead of `/api/extract-file`
- Image files continue using the existing vision path (Anthropic SDK with OAuth token)
- Small badge/counter showing "N docs uploaded" appears above the input when knowledgeBase is non-empty
- Each uploaded doc shows in the attachment preview area with name + char count
- Users can remove individual docs from the knowledge base

### Context Limits

- Max 10MB per file upload
- Extracted text truncated to 8000 chars per document
- Total context injected capped at 30,000 chars (enough for ~5-6 full docs)
- If over cap, oldest documents are trimmed first with "[truncated]" marker

## What's NOT in scope

- No persistent storage
- No vector embeddings or semantic search
- No admin/pre-loaded knowledge base
- No changes to voice AI
