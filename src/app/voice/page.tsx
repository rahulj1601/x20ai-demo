"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { VOICE_CONVERSATION } from "@/lib/x20-knowledge";

type TranscriptEntry = {
  speaker: "caller" | "agent";
  text: string;
  timestamp: string;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Waveform({ active, size = "sm" }: { active: boolean; size?: "sm" | "lg" }) {
  const barCount = size === "lg" ? 40 : 24;
  return (
    <div className={`flex items-center gap-[2px] ${size === "lg" ? "h-16" : "h-8"}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-150 ${
            active ? "bg-[var(--accent)]" : "bg-[var(--border)]"
          }`}
          style={{
            height: active ? undefined : size === "lg" ? "4px" : "3px",
            animation: active
              ? `${size === "lg" ? "waveform-lg" : "waveform"} ${0.4 + Math.random() * 0.6}s ease-in-out ${Math.random() * 0.5}s infinite`
              : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function VoiceDemo() {
  const [status, setStatus] = useState<"idle" | "ringing" | "connected" | "ended">("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<"caller" | "agent" | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [scriptIndex, setScriptIndex] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scriptTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [transcript, scrollToBottom]);

  // Call duration timer
  useEffect(() => {
    if (status === "connected") {
      timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Script progression
  const advanceScript = useCallback(() => {
    if (scriptIndex >= VOICE_CONVERSATION.length) {
      setCurrentSpeaker(null);
      setTimeout(() => setStatus("ended"), 2000);
      return;
    }

    const entry = VOICE_CONVERSATION[scriptIndex];
    setCurrentSpeaker(entry.speaker);

    // Simulate "speaking" duration then add to transcript
    const speakDuration = entry.text.length * 35 + 500;
    scriptTimerRef.current = setTimeout(() => {
      const now = new Date();
      setTranscript((prev) => [
        ...prev,
        {
          speaker: entry.speaker,
          text: entry.text,
          timestamp: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`,
        },
      ]);
      setCurrentSpeaker(null);

      // Brief pause then next line
      scriptTimerRef.current = setTimeout(() => {
        setScriptIndex((i) => i + 1);
      }, entry.delay);
    }, speakDuration);
  }, [scriptIndex]);

  useEffect(() => {
    if (status === "connected") {
      advanceScript();
    }
    return () => {
      if (scriptTimerRef.current) clearTimeout(scriptTimerRef.current);
    };
  }, [status, scriptIndex, advanceScript]);

  const startCall = () => {
    setStatus("ringing");
    setTranscript([]);
    setCallDuration(0);
    setScriptIndex(0);
    setTimeout(() => setStatus("connected"), 2500);
  };

  const endCall = () => {
    setStatus("ended");
    setCurrentSpeaker(null);
    if (scriptTimerRef.current) clearTimeout(scriptTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetCall = () => {
    setStatus("idle");
    setTranscript([]);
    setCallDuration(0);
    setScriptIndex(0);
    setCurrentSpeaker(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--muted)] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Voice AI Demo
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Live Voice Agent Simulation
          </h1>
          <p className="text-[var(--muted)]">
            Watch Eva, x20ai&apos;s voice agent, handle a real sales inquiry call
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Call Interface */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            {/* Call header */}
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm">Eva - x20ai Voice Agent</div>
                  <div className="text-xs text-[var(--muted)]">
                    {status === "idle" && "Ready to take calls"}
                    {status === "ringing" && "Ringing..."}
                    {status === "connected" && `Connected - ${formatTime(callDuration)}`}
                    {status === "ended" && `Call ended - ${formatTime(callDuration)}`}
                  </div>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                status === "connected" ? "bg-[var(--success)] animate-pulse" :
                status === "ringing" ? "bg-amber-400 animate-pulse" :
                "bg-[var(--muted)]"
              }`} />
            </div>

            {/* Waveform / Call visual */}
            <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[300px]">
              {status === "idle" && (
                <div className="text-center animate-fade-in-up">
                  <div className="w-24 h-24 rounded-full border-2 border-[var(--border)] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <p className="text-[var(--muted)] mb-6">Press the button to start a simulated call</p>
                  <button
                    onClick={startCall}
                    className="px-8 py-3 rounded-full bg-[var(--success)] hover:bg-green-400 text-black font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Start Call
                  </button>
                </div>
              )}

              {status === "ringing" && (
                <div className="text-center animate-fade-in-up">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-[var(--accent)]/20" style={{ animation: "pulse-ring 1.5s ease-in-out infinite" }} />
                    <div className="absolute inset-2 rounded-full bg-[var(--accent)]/30" style={{ animation: "pulse-ring 1.5s ease-in-out 0.3s infinite" }} />
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg font-medium">Connecting to Eva...</p>
                  <p className="text-sm text-[var(--muted)] mt-1">x20ai Voice Agent</p>
                </div>
              )}

              {status === "connected" && (
                <div className="w-full text-center">
                  <Waveform active={currentSpeaker !== null} size="lg" />
                  <div className="mt-6 mb-8">
                    {currentSpeaker ? (
                      <p className="text-sm text-[var(--accent-light)] animate-pulse">
                        {currentSpeaker === "agent" ? "Eva is speaking..." : "Caller is speaking..."}
                      </p>
                    ) : (
                      <p className="text-sm text-[var(--muted)]">Listening...</p>
                    )}
                  </div>
                  <button
                    onClick={endCall}
                    className="px-8 py-3 rounded-full bg-[var(--danger)] hover:bg-red-400 text-white font-semibold transition-all duration-200"
                  >
                    End Call
                  </button>
                </div>
              )}

              {status === "ended" && (
                <div className="text-center animate-fade-in-up">
                  <div className="w-24 h-24 rounded-full bg-[var(--surface-light)] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-1">Call Complete</p>
                  <p className="text-sm text-[var(--muted)] mb-6">Duration: {formatTime(callDuration)}</p>
                  <button
                    onClick={resetCall}
                    className="px-6 py-2.5 rounded-full border border-[var(--border)] hover:border-[var(--accent)] text-sm font-medium transition-all duration-200"
                  >
                    Start New Call
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Transcript */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="text-sm font-semibold">Live Transcript</span>
              </div>
              {status === "connected" && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--success)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                  Recording
                </span>
              )}
            </div>

            <div ref={transcriptRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-[400px] max-h-[500px]">
              {transcript.length === 0 && status === "idle" && (
                <div className="flex items-center justify-center h-full text-[var(--muted)] text-sm">
                  Transcript will appear here when the call starts
                </div>
              )}
              {transcript.length === 0 && status === "ringing" && (
                <div className="flex items-center justify-center h-full text-[var(--muted)] text-sm animate-pulse">
                  Connecting...
                </div>
              )}
              {transcript.map((entry, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${entry.speaker === "agent" ? "animate-slide-in-left" : "animate-slide-in-right"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    entry.speaker === "agent"
                      ? "bg-gradient-to-br from-[var(--accent)] to-purple-600 text-white"
                      : "bg-[var(--surface-light)] text-[var(--muted)]"
                  }`}>
                    {entry.speaker === "agent" ? "AI" : "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">
                        {entry.speaker === "agent" ? "Eva (AI Agent)" : "Caller"}
                      </span>
                      <span className="text-xs text-[var(--muted)]">{entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{entry.text}</p>
                  </div>
                </div>
              ))}
              {currentSpeaker && (
                <div className={`flex gap-3 ${currentSpeaker === "agent" ? "animate-slide-in-left" : "animate-slide-in-right"}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    currentSpeaker === "agent"
                      ? "bg-gradient-to-br from-[var(--accent)] to-purple-600 text-white"
                      : "bg-[var(--surface-light)] text-[var(--muted)]"
                  }`}>
                    {currentSpeaker === "agent" ? "AI" : "C"}
                  </div>
                  <div className="flex items-center gap-1 pt-2">
                    {[0, 1, 2].map((dot) => (
                      <div
                        key={dot}
                        className="w-2 h-2 rounded-full bg-[var(--accent)]"
                        style={{ animation: `typing-dot 1.2s ease-in-out ${dot * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Call stats */}
            {(status === "connected" || status === "ended") && (
              <div className="px-6 py-3 border-t border-[var(--border)] grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-[var(--muted)]">Duration</div>
                  <div className="text-sm font-mono font-semibold">{formatTime(callDuration)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[var(--muted)]">Messages</div>
                  <div className="text-sm font-semibold">{transcript.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[var(--muted)]">Sentiment</div>
                  <div className="text-sm font-semibold text-[var(--success)]">Positive</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
