"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/locale-context";
import { translations, getMatchedResponse } from "@/lib/i18n";

type Message = { id: string; sender: "user" | "agent"; text: string; time: string; status?: "sent" | "delivered" | "read" };

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-primary" style={{ animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

export default function ChatDemo() {
  const { locale } = useLocale();
  const t = translations[locale].chat;

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", sender: "agent", text: t.welcomeMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset welcome message when locale changes
  useEffect(() => {
    setMessages([
      { id: "welcome", sender: "agent", text: t.welcomeMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setShowSuggestions(true);
  }, [locale, t.welcomeMessage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: text.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), status: "sent" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowSuggestions(false);
    setIsTyping(true);

    setTimeout(() => { setMessages((prev) => prev.map((m) => (m.id === userMsg.id ? { ...m, status: "delivered" } : m))); }, 500);
    setTimeout(() => { setMessages((prev) => prev.map((m) => (m.id === userMsg.id ? { ...m, status: "read" } : m))); }, 1000);

    const response = getMatchedResponse(text, locale);
    const typingDelay = Math.min(response.length * 15 + 800, 3000);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: "agent", text: response, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      setTimeout(() => setShowSuggestions(true), 500);
    }, typingDelay);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {t.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col" style={{ height: "600px" }}>
            {/* Chat Header */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center overflow-hidden">
                  <Image src="/x20ai-logo.png" alt="x20ai" width={28} height={28} className="rounded-full" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-card" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">x20ai Assistant</div>
                <div className="text-xs text-success">{t.online}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.sender === "user" ? "justify-end" : ""}`}>
                      <span className="text-[10px] opacity-60">{msg.time}</span>
                      {msg.sender === "user" && msg.status && (
                        <span className="text-[10px]">
                          {msg.status === "sent" && "\u2713"}
                          {msg.status === "delivered" && "\u2713\u2713"}
                          {msg.status === "read" && <span className="text-blue-300">{"\u2713\u2713"}</span>}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="bg-secondary rounded-2xl rounded-bl-sm"><TypingIndicator /></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && messages.length < 4 && (
              <div className="px-5 py-2 flex gap-2 overflow-x-auto">
                {t.suggestions.slice(0, 3).map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} className="flex-shrink-0 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-all">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="px-5 py-3 border-t border-border flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.typePlaceholder}
                className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground text-foreground"
                disabled={isTyping}
              />
              <button type="submit" disabled={!input.trim() || isTyping} className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-30 flex items-center justify-center transition-all">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
