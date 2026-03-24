# X20 AI Demo Platform

Interactive demo for X20 AI's voice and chat agents.

**Live:** https://x20ai-demo.vercel.app

## Pages

- `/voice` — Eva voice agent (ElevenLabs Conversational AI)
- `/chat` — Text AI assistant with document upload (RAG)
- `/dashboard` — Analytics overview

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Voice:** ElevenLabs ConvAI (WebSocket, `@11labs/client` SDK)
- **Chat:** Anthropic Claude (via VPS proxy)
- **Styling:** Tailwind CSS 4
- **Hosting:** Vercel (auto-deploy from `main`)

## Voice Agent Architecture

Eva uses ElevenLabs Conversational AI with separate agents per language:

| Language | Agent ID | Voice | LLM |
|----------|----------|-------|-----|
| English | `agent_2701kmcgqbqve5bahqabmpf4tf7q` | Jessica (conversational) | GPT-4.1 |
| Dutch | `agent_0501kmchvpddetpty0ejw00wy315` | Anouk (Dutch) | GPT-4.1 |
| Spanish | `agent_0101kmchv5n0egrays6354fx7j37` | Jessica (conversational) | GPT-4.1 |

**TTS Model:** `eleven_v3_conversational` (expressive mode, turn_v2)
**Voice Settings:** stability=0.5, similarity=0.8

### How it works

1. User clicks "Start Call" on `/voice`
2. Frontend requests mic permission, then fetches a signed URL from `/api/voice-token`
3. `@11labs/client` opens a WebSocket session to ElevenLabs
4. Real-time bidirectional audio: user speaks via mic, Eva responds via speaker
5. Transcript events update the UI live

## Environment Variables

```bash
# ElevenLabs (voice agent)
ELEVENLABS_API_KEY=           # ElevenLabs API key
ELEVENLABS_AGENT_ID_EN=       # English agent ID (optional, has fallback)
ELEVENLABS_AGENT_ID_NL=       # Dutch agent ID (optional, has fallback)
ELEVENLABS_AGENT_ID_ES=       # Spanish agent ID (optional, has fallback)

# Anthropic (chat agent)
ANTHROPIC_API_KEY=            # Claude API key

# VPS (AI proxy)
VPS_AI_ENDPOINT=              # VPS endpoint URL
VPS_AI_SECRET=                # VPS auth token
VPS_OAUTH_TOKEN=              # Anthropic OAuth token
```

## Local Development

```bash
npm install
# Copy env vars from Vercel: npx vercel env pull
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── voice/page.tsx          # Voice agent UI
│   ├── chat/page.tsx           # Chat UI with file upload
│   ├── dashboard/page.tsx      # Analytics
│   ├── api/
│   │   ├── voice-token/        # ElevenLabs signed URL generation
│   │   ├── tts/                # Text-to-speech endpoint
│   │   ├── voice-chat/         # VPS proxy for voice responses
│   │   ├── chat/               # Claude chat with vision
│   │   ├── upload/             # File processing (PDF, DOCX)
│   │   └── extract-file/       # File content extraction
│   └── layout.tsx
├── components/
│   ├── Navbar.tsx              # Nav + language selector
│   └── ClientLayout.tsx        # Locale provider
└── lib/
    ├── i18n.ts                 # Translations (EN, NL, ES)
    └── locale-context.tsx      # React locale context
```
