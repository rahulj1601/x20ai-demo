"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/locale-context";
import { translations } from "@/lib/i18n";

type TranscriptEntry = { speaker: "caller" | "agent"; text: string; timestamp: string };
type Message = { role: "user" | "assistant"; content: string };

// Locale -> BCP 47 lang tag for speech recognition
const SPEECH_LANG: Record<string, string> = { en: "en-GB", nl: "nl-NL", es: "es-ES" };

function getTimestamp() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Waveform({ active, size = "sm" }: { active: boolean; size?: "sm" | "lg" }) {
  const barCount = size === "lg" ? 40 : 24;
  // Use stable seeds per bar - avoid Math.random() on render
  const seeds = useRef(
    Array.from({ length: 40 }, () => ({ dur: 0.4 + Math.random() * 0.6, delay: Math.random() * 0.5 }))
  );
  return (
    <div className={`flex items-center gap-[2px] ${size === "lg" ? "h-16" : "h-8"}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-150 ${active ? "bg-primary" : "bg-border"}`}
          style={{
            height: active ? undefined : size === "lg" ? "4px" : "3px",
            animation: active
              ? `${size === "lg" ? "waveform-lg" : "waveform"} ${seeds.current[i].dur}s ease-in-out ${seeds.current[i].delay}s infinite`
              : "none",
          }}
        />
      ))}
    </div>
  );
}

// Check Web Speech API support
function hasSpeechSupport() {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

export default function VoiceDemo() {
  const { locale } = useLocale();
  const t = translations[locale].voice;

  const [status, setStatus] = useState<"idle" | "ringing" | "connected" | "ended">("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<"caller" | "agent" | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [speechSupported] = useState(hasSpeechSupport);
  const [micError, setMicError] = useState<string | null>(null);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const historyRef = useRef<Message[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const statusRef = useRef(status);

  useEffect(() => { statusRef.current = status; }, [status]);

  // Scroll to bottom when transcript updates
  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [transcript, currentSpeaker]);

  // Call timer
  useEffect(() => {
    if (status === "connected") {
      timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  // Init speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") synthRef.current = window.speechSynthesis;
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText("");
  }, []);

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current) { onEnd?.(); return; }
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG[locale] ?? "en-GB";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    // Try to pick a natural voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith(locale === "nl" ? "nl" : locale === "es" ? "es" : "en") && !v.name.includes("Google")
    ) ?? voices.find((v) => v.lang.startsWith(locale === "nl" ? "nl" : locale === "es" ? "es" : "en"));
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    synthRef.current.speak(utterance);
  }, [locale]);

  const addToTranscript = useCallback((speaker: "caller" | "agent", text: string) => {
    setTranscript((prev) => [...prev, { speaker, text, timestamp: getTimestamp() }]);
  }, []);

  const sendToAI = useCallback(async (userMessage: string) => {
    setCurrentSpeaker("agent");
    setIsThinking(true);

    // Add user message to transcript
    addToTranscript("caller", userMessage);
    historyRef.current.push({ role: "user", content: userMessage });

    try {
      const res = await fetch("/api/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: historyRef.current.slice(-10),
          locale,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const reply: string = data.reply ?? "Sorry, I didn't catch that.";

      historyRef.current.push({ role: "assistant", content: reply });
      setIsThinking(false);
      addToTranscript("agent", reply);

      // Speak the reply
      speakText(reply, () => {
        setCurrentSpeaker(null);
        // Resume listening if still connected
        if (statusRef.current === "connected") {
          startListeningCycle();
        }
      });
    } catch {
      setIsThinking(false);
      setCurrentSpeaker(null);
      const errMsg = locale === "nl" ? "Sorry, er is iets misgegaan." : locale === "es" ? "Lo siento, algo salió mal." : "Sorry, something went wrong.";
      addToTranscript("agent", errMsg);
      speakText(errMsg, () => {
        if (statusRef.current === "connected") startListeningCycle();
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, addToTranscript, speakText]);

  const startListeningCycle = useCallback(() => {
    if (statusRef.current !== "connected") return;
    if (!speechSupported) return;

    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    const rec = new SpeechRecognitionCtor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = SPEECH_LANG[locale] ?? "en-GB";
    recognitionRef.current = rec;

    rec.onstart = () => {
      setIsListening(true);
      setCurrentSpeaker("caller");
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      setInterimText(interim);
      if (final.trim()) {
        setInterimText("");
        setIsListening(false);
        setCurrentSpeaker(null);
        recognitionRef.current = null;
        sendToAI(final.trim());
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") {
        // Silently restart on no-speech
        setIsListening(false);
        setCurrentSpeaker(null);
        setInterimText("");
        if (statusRef.current === "connected") {
          setTimeout(() => startListeningCycle(), 500);
        }
      } else if (event.error === "not-allowed") {
        setMicError("Microphone access denied. Please allow microphone access and try again.");
        setIsListening(false);
        setCurrentSpeaker(null);
      } else {
        setIsListening(false);
        setCurrentSpeaker(null);
        setInterimText("");
      }
    };

    rec.onend = () => {
      // If no final result was sent and still connected, restart
      if (statusRef.current === "connected" && !isThinking) {
        // Small delay to avoid rapid restart
      }
      setIsListening(false);
    };

    try { rec.start(); } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, speechSupported, sendToAI]);

  const startCall = async () => {
    setStatus("ringing");
    setTranscript([]);
    setCallDuration(0);
    historyRef.current = [];
    setMicError(null);

    setTimeout(() => {
      setStatus("connected");

      // Greeting from AI
      const greeting =
        locale === "nl"
          ? "Hallo! U spreekt met de AI-assistent van x20ai. Hoe kan ik u vandaag helpen?"
          : locale === "es"
          ? "¡Hola! Habla con el asistente de IA de x20ai. ¿En qué puedo ayudarle hoy?"
          : "Hello! You've reached the x20ai AI assistant. How can I help you today?";

      setCurrentSpeaker("agent");
      addToTranscript("agent", greeting);
      historyRef.current.push({ role: "assistant", content: greeting });

      speakText(greeting, () => {
        setCurrentSpeaker(null);
        startListeningCycle();
      });
    }, 2500);
  };

  const endCall = () => {
    stopListening();
    if (synthRef.current) synthRef.current.cancel();
    setStatus("ended");
    setCurrentSpeaker(null);
    setIsThinking(false);
    setInterimText("");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetCall = () => {
    stopListening();
    if (synthRef.current) synthRef.current.cancel();
    setStatus("idle");
    setTranscript([]);
    setCallDuration(0);
    setCurrentSpeaker(null);
    setIsThinking(false);
    setInterimText("");
    historyRef.current = [];
    setMicError(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (synthRef.current) synthRef.current.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stopListening]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {t.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
          {!speechSupported && (
            <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 inline-block">
              {locale === "nl" ? "Gebruik Chrome of Edge voor spraakinvoer" : locale === "es" ? "Usa Chrome o Edge para entrada de voz" : "Use Chrome or Edge for voice input"}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Call Interface */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.aiAgent}</div>
                  <div className="text-xs text-muted-foreground">
                    {status === "idle" && t.readyToTakeCalls}
                    {status === "ringing" && t.ringing}
                    {status === "connected" && `${t.connected} - ${formatTime(callDuration)}`}
                    {status === "ended" && `${t.callEnded} - ${formatTime(callDuration)}`}
                  </div>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${status === "connected" ? "bg-success animate-pulse" : status === "ringing" ? "bg-amber-400 animate-pulse" : "bg-muted-foreground/30"}`} />
            </div>

            <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[300px]">
              {status === "idle" && (
                <div className="text-center animate-fade-in-up">
                  <div className="w-24 h-24 rounded-full border-2 border-border flex items-center justify-center mx-auto mb-6">
                    <Image src="/x20ai-logo.png" alt="x20ai" width={48} height={48} className="rounded-full" />
                  </div>
                  <p className="text-muted-foreground mb-2">{t.pressButtonToStart}</p>
                  {speechSupported && (
                    <p className="text-xs text-muted-foreground mb-6">
                      {locale === "nl" ? "Spreek met de AI - echte stemherkenning" : locale === "es" ? "Habla con la IA - reconocimiento de voz real" : "Speak with the AI - real voice recognition"}
                    </p>
                  )}
                  {!speechSupported && (
                    <p className="text-xs text-muted-foreground mb-6">
                      {locale === "nl" ? "Simulatiemodus - geen microfoon vereist" : locale === "es" ? "Modo simulación - sin micrófono requerido" : "Simulation mode - no microphone required"}
                    </p>
                  )}
                  <button onClick={startCall} className="px-8 py-3 rounded-full bg-success hover:bg-success/90 text-white font-semibold transition-all duration-200 flex items-center gap-2 mx-auto">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {t.startCall}
                  </button>
                </div>
              )}

              {status === "ringing" && (
                <div className="text-center animate-fade-in-up">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-primary/20" style={{ animation: "pulse-ring 1.5s ease-in-out infinite" }} />
                    <div className="absolute inset-2 rounded-full bg-primary/30" style={{ animation: "pulse-ring 1.5s ease-in-out 0.3s infinite" }} />
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
                      <Image src="/x20ai-logo.png" alt="x20ai" width={32} height={32} className="rounded-full" />
                    </div>
                  </div>
                  <p className="text-lg font-medium text-foreground">{t.connectingTo}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.voiceAgent}</p>
                </div>
              )}

              {status === "connected" && (
                <div className="w-full text-center">
                  <Waveform active={currentSpeaker !== null || isListening} size="lg" />
                  <div className="mt-6 mb-4">
                    {isThinking ? (
                      <p className="text-sm text-primary animate-pulse">
                        {locale === "nl" ? "AI denkt na..." : locale === "es" ? "IA pensando..." : "AI thinking..."}
                      </p>
                    ) : currentSpeaker === "agent" ? (
                      <p className="text-sm text-primary animate-pulse">{t.agentSpeaking}</p>
                    ) : isListening ? (
                      <p className="text-sm text-success animate-pulse">{t.callerSpeaking}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">{t.listening}</p>
                    )}
                    {interimText && (
                      <p className="text-xs text-muted-foreground mt-1 italic">&ldquo;{interimText}&rdquo;</p>
                    )}
                  </div>

                  {micError && (
                    <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-4">{micError}</p>
                  )}

                  {/* Mic indicator */}
                  {speechSupported && (
                    <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full mb-4 ${
                      isListening ? "bg-success/10 text-success border border-success/20" : "bg-secondary text-muted-foreground"
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                      </svg>
                      {isListening
                        ? (locale === "nl" ? "Luistert..." : locale === "es" ? "Escuchando..." : "Listening...")
                        : (locale === "nl" ? "Microfoon gereed" : locale === "es" ? "Micrófono listo" : "Mic ready")}
                    </div>
                  )}

                  <button onClick={endCall} className="px-8 py-3 rounded-full bg-destructive hover:bg-destructive/90 text-white font-semibold transition-all duration-200">
                    {t.endCall}
                  </button>
                </div>
              )}

              {status === "ended" && (
                <div className="text-center animate-fade-in-up">
                  <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-foreground mb-1">{t.callComplete}</p>
                  <p className="text-sm text-muted-foreground mb-6">{t.duration}: {formatTime(callDuration)}</p>
                  <button onClick={resetCall} className="px-6 py-2.5 rounded-full border border-border hover:border-primary text-sm font-medium text-foreground transition-all duration-200">
                    {t.newCall}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Transcript */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="text-sm font-semibold text-foreground">{t.liveTranscript}</span>
              </div>
              {status === "connected" && (
                <span className="flex items-center gap-1.5 text-xs text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  {t.recording}
                </span>
              )}
            </div>

            <div ref={transcriptRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-[400px] max-h-[500px]">
              {transcript.length === 0 && status === "idle" && (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">{t.transcriptWillAppear}</div>
              )}
              {transcript.length === 0 && status === "ringing" && (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm animate-pulse">{t.connecting}...</div>
              )}
              {transcript.map((entry, i) => (
                <div key={i} className={`flex gap-3 ${entry.speaker === "agent" ? "animate-slide-in-left" : "animate-slide-in-right"}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    entry.speaker === "agent" ? "bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white" : "bg-secondary text-muted-foreground"
                  }`}>
                    {entry.speaker === "agent" ? "AI" : "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">{entry.speaker === "agent" ? t.aiAgent : t.caller}</span>
                      <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.text}</p>
                  </div>
                </div>
              ))}

              {/* Interim speech bubble */}
              {interimText && (
                <div className="flex gap-3 animate-slide-in-right opacity-60">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold bg-secondary text-muted-foreground">C</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground leading-relaxed italic">{interimText}...</p>
                  </div>
                </div>
              )}

              {/* Thinking / speaking indicator */}
              {(isThinking || (currentSpeaker === "agent" && !isThinking)) && !interimText && (
                <div className="flex gap-3 animate-slide-in-left">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white">AI</div>
                  <div className="flex items-center gap-1 pt-2">
                    {[0, 1, 2].map((dot) => (
                      <div key={dot} className="w-2 h-2 rounded-full bg-primary" style={{ animation: `typing-dot 1.2s ease-in-out ${dot * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(status === "connected" || status === "ended") && (
              <div className="px-6 py-3 border-t border-border grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">{t.duration}</div>
                  <div className="text-sm font-mono font-semibold text-foreground">{formatTime(callDuration)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">{t.messages}</div>
                  <div className="text-sm font-semibold text-foreground">{transcript.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">{t.sentiment}</div>
                  <div className="text-sm font-semibold text-success">{t.positive}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
