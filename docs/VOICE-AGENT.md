# Voice Agent Configuration

## Overview

Eva is the X20 AI voice agent built on ElevenLabs Conversational AI 2.0. Three separate agents handle English, Dutch, and Spanish conversations.

## Agent Details

### English (EN)
- **Agent ID:** `agent_2701kmcgqbqve5bahqabmpf4tf7q`
- **Voice:** Jessica (`cgSgspJ2msm6clMCkdW9`) — Playful, Bright, Warm (conversational)
- **LLM:** GPT-4.1
- **Language:** en

### Dutch (NL)
- **Agent ID:** `agent_0501kmchvpddetpty0ejw00wy315`
- **Voice:** Anouk (`VZNV9uacLFc9lUWH1xMS`) — Dutch native voice
- **LLM:** GPT-4.1
- **Language:** nl
- **Note:** Richard has a custom Anouk voice (`8qhThszW242PBcrqrwoC`) on his ElevenLabs account that should replace this once shared properly

### Spanish (ES)
- **Agent ID:** `agent_0101kmchv5n0egrays6354fx7j37`
- **Voice:** Jessica (`cgSgspJ2msm6clMCkdW9`) — Multilingual via eleven_v3_conversational
- **LLM:** GPT-4.1
- **Language:** es

## TTS Settings (All Agents)

| Setting | Value | Notes |
|---------|-------|-------|
| Model | `eleven_v3_conversational` | Latest multilingual conversational model |
| Stability | 0.5 | Balance of consistency and expressiveness |
| Similarity Boost | 0.8 | Strong voice character |
| Expressive Mode | true | Emotional intonation |
| Speed | 1.0 | Natural pace |
| Audio Format | pcm_16000 | 16kHz PCM |

## Turn-Taking Settings

| Setting | Value |
|---------|-------|
| Turn Model | turn_v2 |
| Turn Eagerness | patient |
| Speculative Turn | true |
| Turn Timeout | 8s |

## ASR (Speech Recognition)

| Setting | Value |
|---------|-------|
| Provider | scribe_realtime |
| Quality | high |
| Input Format | pcm_16000 |

## Updating Agents via API

Agents are configured on ElevenLabs' side. To update settings:

```bash
curl -X PATCH "https://api.elevenlabs.io/v1/convai/agents/{AGENT_ID}" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_config": {
      "tts": {
        "voice_id": "NEW_VOICE_ID",
        "stability": 0.5,
        "similarity_boost": 0.8
      }
    }
  }'
```

No deployment needed — agent config changes take effect immediately.

## Changelog

### 2026-03-24 — Voice Quality Improvements
**Problem:** Richard reported voices sound robotic for both English and Dutch.

**Root causes identified:**
1. Stability too low (0.2) — caused inconsistent, unnatural speech patterns
2. Similarity too low (0.55) — weak voice character, less warmth
3. EN used Amy voice (educational use case, not conversational)
4. EN used Gemini Flash LLM (speed-optimized, less natural responses)
5. ES used Amy British voice (wrong language character)

**Changes made:**
- EN: Voice changed Amy → Jessica (conversational), LLM gemini-flash → GPT-4.1
- NL: Voice settings tuned (kept Anouk voice)
- ES: Voice changed Amy → Jessica (multilingual conversational)
- All: Stability 0.2 → 0.5, Similarity 0.55 → 0.8

**Pending:**
- Integrate Richard's custom Anouk voice for NL agent (requires voice sharing from his ElevenLabs account)
