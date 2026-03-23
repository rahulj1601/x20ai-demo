"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLocale } from "@/lib/locale-context";
import { translations } from "@/lib/i18n";

type Message = {
  id: string;
  sender: "user" | "agent" | "system";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  attachment?: { name: string; mimeType: string; preview?: string };
};

type HistoryEntry = { role: "user" | "assistant"; content: string };

type KnowledgeDoc = {
  name: string;
  text: string;
  charCount: number;
};

type Attachment = {
  base64: string;
  mimeType: string;
  name: string;
  preview?: string;
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-primary" style={{ animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

function AgentMessage({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="text-sm space-y-1 my-2 pl-4 list-disc">{children}</ul>,
        ol: ({ children }) => <ol className="text-sm space-y-1 my-2 pl-4 list-decimal">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        h1: ({ children }) => <h1 className="text-sm font-bold mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold mb-1.5">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");
          return isBlock ? (
            <code className="block bg-black/10 rounded px-2 py-1 text-xs font-mono my-1">{children}</code>
          ) : (
            <code className="bg-black/10 rounded px-1 text-xs font-mono">{children}</code>
          );
        },
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">{children}</a>
        ),
        blockquote: ({ children }) => <blockquote className="border-l-2 border-primary/30 pl-3 italic opacity-80 my-1">{children}</blockquote>,
      }}
    >
      {text}
    </ReactMarkdown>
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
  const [suggestions, setSuggestions] = useState<string[]>(t.suggestions.slice(0, 3));
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeDoc[]>([]);
  const historyRef = useRef<HistoryEntry[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      { id: "welcome", sender: "agent", text: t.welcomeMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setSuggestions(t.suggestions.slice(0, 3));
    setKnowledgeBase([]);
    historyRef.current = [];
  }, [locale, t.welcomeMessage, t.suggestions]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  // Build knowledge base context string
  const buildFileContext = useCallback((): string => {
    if (knowledgeBase.length === 0) return "";
    return knowledgeBase.map((doc) => `--- Document: ${doc.name} ---\n${doc.text}`).join("\n\n");
  }, [knowledgeBase]);

  const handleFileSelect = useCallback(async (file: File) => {
    const isImage = file.type.startsWith("image/");

    if (isImage) {
      // Images go through attachment path (vision API)
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.split(",")[1];
        setAttachment({ base64, mimeType: file.type, name: file.name, preview: dataUrl });
      };
      reader.readAsDataURL(file);
      return;
    }

    // Documents go to knowledge base via /api/upload
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Show uploading system message
    const uploadMsgId = Date.now().toString();
    setMessages((prev) => [...prev, {
      id: uploadMsgId,
      sender: "system",
      text: `Uploading "${file.name}"...`,
      time: now,
    }]);

    try {
      let res: Response;
      const ext = file.name.split(".").pop()?.toLowerCase();

      // DOCX: extract client-side to avoid Vercel body size limits
      if (ext === "docx") {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: result.value, fileName: file.name }),
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        res = await fetch("/api/upload", { method: "POST", body: formData });
      }

      const data = await res.json();

      if (res.ok && data.success) {
        setKnowledgeBase((prev) => [...prev, { name: data.fileName, text: data.text, charCount: data.charCount }]);
        setMessages((prev) => prev.map((m) =>
          m.id === uploadMsgId
            ? { ...m, text: `"${data.fileName}" added to knowledge base (${Math.round(data.charCount / 1000)}k chars). Ask me anything about it.` }
            : m
        ));
      } else {
        setMessages((prev) => prev.map((m) =>
          m.id === uploadMsgId
            ? { ...m, text: data.error || `Failed to process "${file.name}".` }
            : m
        ));
      }
    } catch {
      setMessages((prev) => prev.map((m) =>
        m.id === uploadMsgId
          ? { ...m, text: `Upload failed for "${file.name}". Please try again.` }
          : m
      ));
    }
  }, []);

  const removeDoc = useCallback((name: string) => {
    setKnowledgeBase((prev) => prev.filter((d) => d.name !== name));
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const currentAttachment = attachment;
    if (!text.trim() && !currentAttachment) return;
    if (isTyping) return;

    const displayText = text.trim() || (currentAttachment ? currentAttachment.name : "");

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: displayText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      attachment: currentAttachment ? { name: currentAttachment.name, mimeType: currentAttachment.mimeType, preview: currentAttachment.preview } : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachment(null);
    setSuggestions([]);
    setIsTyping(true);

    setTimeout(() => setMessages((prev) => prev.map((m) => m.id === userMsg.id ? { ...m, status: "delivered" } : m)), 400);
    setTimeout(() => setMessages((prev) => prev.map((m) => m.id === userMsg.id ? { ...m, status: "read" } : m)), 900);

    historyRef.current.push({ role: "user", content: displayText });

    try {
      const body: Record<string, unknown> = {
        message: text.trim(),
        history: historyRef.current.slice(-8),
        locale,
      };

      // Include knowledge base context if docs are uploaded
      const fileContext = buildFileContext();
      if (fileContext) {
        body.fileContext = fileContext;
      }

      // Image attachment (vision path)
      if (currentAttachment?.mimeType.startsWith("image/")) {
        body.fileContent = currentAttachment.base64;
        body.fileName = currentAttachment.name;
        body.fileType = currentAttachment.mimeType;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const reply: string = data.reply ?? (locale === "nl" ? "Sorry, er is iets misgegaan." : locale === "es" ? "Lo siento, algo salió mal." : "Sorry, something went wrong.");
      const newSuggestions: string[] = Array.isArray(data.suggestions) ? data.suggestions : t.suggestions.slice(0, 3);

      historyRef.current.push({ role: "assistant", content: reply });

      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);

      setTimeout(() => setSuggestions(newSuggestions), 300);
    } catch {
      setIsTyping(false);
      const errMsg = locale === "nl" ? "Sorry, er is iets misgegaan. Probeer het opnieuw." : locale === "es" ? "Lo siento, algo salió mal. Inténtalo de nuevo." : "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: errMsg,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
      setSuggestions(t.suggestions.slice(0, 3));
    }
  }, [isTyping, locale, t.suggestions, attachment, buildFileContext]);

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
          <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col" style={{ height: "620px" }}>
            {/* Header */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center overflow-hidden">
                  <Image src="/x20ai-logo.png" alt="x20ai" width={28} height={28} className="rounded-full" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-card" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-foreground">x20ai Assistant</div>
                <div className="text-xs text-success">{t.online}</div>
              </div>
              {knowledgeBase.length > 0 && (
                <div className="text-xs text-muted-foreground bg-secondary rounded-full px-2.5 py-1">
                  {knowledgeBase.length} doc{knowledgeBase.length > 1 ? "s" : ""} loaded
                </div>
              )}
            </div>

            {/* Knowledge base docs bar */}
            {knowledgeBase.length > 0 && (
              <div className="px-4 py-2 border-b border-border/50 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
                {knowledgeBase.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-1.5 bg-secondary rounded-full px-2.5 py-1 flex-shrink-0">
                    <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-foreground/70 max-w-[100px] truncate">{doc.name}</span>
                    <button onClick={() => removeDoc(doc.name)} className="text-muted-foreground hover:text-foreground">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"} animate-fade-in-up`}>
                  {msg.sender === "system" ? (
                    <div className="text-xs text-center text-muted-foreground py-1 max-w-[80%]">{msg.text}</div>
                  ) : (
                    <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}>
                      {msg.attachment && (
                        <div className="mb-2">
                          {msg.attachment.preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={msg.attachment.preview} alt={msg.attachment.name} className="rounded-lg max-h-40 max-w-full object-cover" />
                          ) : (
                            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-xs truncate max-w-[160px]">{msg.attachment.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {msg.text && (msg.sender === "agent" ? (
                        <AgentMessage text={msg.text} />
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      ))}
                      <div className={`flex items-center gap-1 mt-1 ${msg.sender === "user" ? "justify-end" : ""}`}>
                        <span className="text-[10px] opacity-60">{msg.time}</span>
                        {msg.sender === "user" && msg.status && (
                          <span className="text-[10px]">
                            {msg.status === "sent" && "✓"}
                            {msg.status === "delivered" && "✓✓"}
                            {msg.status === "read" && <span className="text-blue-300">✓✓</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
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
            {suggestions.length > 0 && !isTyping && (
              <div className="px-5 py-2.5 border-t border-border/50 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Attachment preview (images only) */}
            {attachment && (
              <div className="px-5 pt-2 flex-shrink-0">
                <div className="inline-flex items-center gap-2 bg-secondary rounded-xl px-3 py-2 max-w-[240px]">
                  {attachment.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={attachment.preview} alt={attachment.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                  ) : (
                    <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  <span className="text-xs text-foreground truncate flex-1">{attachment.name}</span>
                  <button onClick={() => setAttachment(null)} className="text-muted-foreground hover:text-foreground flex-shrink-0 ml-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="px-5 py-3 border-t border-border flex items-center gap-2 flex-shrink-0"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp,application/pdf,text/plain,text/csv,.md,.json,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isTyping}
                className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center transition-all disabled:opacity-30 text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={knowledgeBase.length > 0
                  ? (locale === "nl" ? "Stel een vraag over je documenten..." : locale === "es" ? "Pregunta sobre tus documentos..." : "Ask about your documents...")
                  : t.typePlaceholder}
                className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground text-foreground"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={(!input.trim() && !attachment) || isTyping}
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-30 flex items-center justify-center transition-all flex-shrink-0"
              >
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
