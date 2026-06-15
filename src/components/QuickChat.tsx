import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, CornerDownLeft, Sparkles, Terminal, Copy, Check, Info } from "lucide-react";
import { ChatMessage, RepoMeta, GeminiAnalysis } from "../types";

interface QuickChatProps {
  owner: string;
  repo: string;
  repoMeta: RepoMeta | null;
  analysis: GeminiAnalysis | null;
}

const COMMON_QUESTIONS = [
  "What is the core purpose of this project?",
  "Recommend 3 feature ideas or expansion scripts.",
  "Describe the system architecture & folder setup.",
  "Identify potential performance pitfalls in this stack."
];

// Custom lightweight high-fidelity Markdown parser for formatted technical descriptions
function formatMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  // Split on triple backticks for multi-line block codes
  const blocks = text.split("```");

  blocks.forEach((block, index) => {
    // Elegant toggle: odd indices are code blocks
    if (index % 2 === 1) {
      // Extract language if specified on the first line
      const lines = block.split("\n");
      let lang = "bash";
      let codeLines = lines;
      if (lines[0] && lines[0].trim().length < 15 && !lines[0].includes(" ") && !lines[0].includes("=") && !lines[0].includes("{")) {
        lang = lines[0].trim();
        codeLines = lines.slice(1);
      }
      const rawCode = codeLines.join("\n").trim();
      parts.push(<CodeBlock key={`cb-${index}`} code={rawCode} lang={lang} />);
    } else {
      // Normal text: handle headers, bullets, inline code, bolding
      const lines = block.split("\n");
      lines.forEach((line, lineIdx) => {
        let cleanLine = line;
        
        // Match header formats
        if (cleanLine.startsWith("### ")) {
          parts.push(<h4 key={`h3-${index}-${lineIdx}`} className="text-sm font-semibold text-white font-display mt-3 mb-1.5">{cleanLine.substring(4)}</h4>);
          return;
        }
        if (cleanLine.startsWith("## ")) {
          parts.push(<h3 key={`h2-${index}-${lineIdx}`} className="text-base font-semibold text-white font-display mt-4 mb-2">{cleanLine.substring(3)}</h3>);
          return;
        }
        if (cleanLine.startsWith("# ")) {
          parts.push(<h2 key={`h1-${index}-${lineIdx}`} className="text-lg font-bold text-white font-display mt-4 mb-2">{cleanLine.substring(2)}</h2>);
          return;
        }

        // Match standard list bullets
        if (cleanLine.trim().startsWith("- ") || cleanLine.trim().startsWith("* ")) {
          const content = cleanLine.trim().substring(2);
          parts.push(
            <li key={`li-${index}-${lineIdx}`} className="ml-4 list-disc text-sm text-slate-350 leading-relaxed mb-1">
              {parseInlineMarkdown(content)}
            </li>
          );
          return;
        }

        // Standard text lines
        if (cleanLine.trim()) {
          parts.push(<p key={`p-${index}-${lineIdx}`} className="text-sm text-slate-350 leading-relaxed mb-2">{parseInlineMarkdown(cleanLine)}</p>);
        } else if (lineIdx > 0) {
          parts.push(<div key={`br-${index}-${lineIdx}`} className="h-2" />);
        }
      });
    }
  });

  return parts;
}

// Parse bold and inline code inside segments
function parseInlineMarkdown(text: string): React.ReactNode {
  // Simple replacement loop for code-blocks and bold items
  const tokens: React.ReactNode[] = [];
  let currentText = text;
  let keyIdx = 0;

  while (currentText.length > 0) {
    const boldIndex = currentText.indexOf("**");
    const codeIndex = currentText.indexOf("`");

    if (boldIndex === -1 && codeIndex === -1) {
      tokens.push(<span key={`txt-${keyIdx++}`}>{currentText}</span>);
      break;
    }

    // Process closest token
    if (codeIndex !== -1 && (boldIndex === -1 || codeIndex < boldIndex)) {
      // Prioritize inline code
      if (codeIndex > 0) {
        tokens.push(<span key={`txt-${keyIdx++}`}>{currentText.substring(0, codeIndex)}</span>);
      }
      const closeCodeIndex = currentText.indexOf("`", codeIndex + 1);
      if (closeCodeIndex !== -1) {
        const codeContent = currentText.substring(codeIndex + 1, closeCodeIndex);
        tokens.push(
          <code key={`code-${keyIdx++}`} className="px-1.5 py-0.5 bg-white/5 rounded text-indigo-400 font-mono text-xs border border-white/10">
            {codeContent}
          </code>
        );
        currentText = currentText.substring(closeCodeIndex + 1);
      } else {
        tokens.push(<span key={`txt-${keyIdx++}`}>{currentText.substring(codeIndex)}</span>);
        break;
      }
    } else {
      // Process bold matching
      if (boldIndex > 0) {
        tokens.push(<span key={`txt-${keyIdx++}`}>{currentText.substring(0, boldIndex)}</span>);
      }
      const closeBoldIndex = currentText.indexOf("**", boldIndex + 2);
      if (closeBoldIndex !== -1) {
        const boldContent = currentText.substring(boldIndex + 2, closeBoldIndex);
        tokens.push(<strong key={`bold-${keyIdx++}`} className="font-semibold text-white">{boldContent}</strong>);
        currentText = currentText.substring(closeBoldIndex + 2);
      } else {
        tokens.push(<span key={`txt-${keyIdx++}`}>{currentText.substring(boldIndex)}</span>);
        break;
      }
    }
  }

  return <>{tokens}</>;
}

// Elegant expandable/scrollable code snippet component
function CodeBlock({ code, lang }: { code: string; lang: string; key?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-slate-200/60 bg-slate-900 shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-white/5 font-mono text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5 font-medium tracking-wide">
          <Terminal className="w-3 h-3 text-indigo-400" />
          {lang.toUpperCase()}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5 px-2 py-1 rounded"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy snippet</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-xs text-slate-200 font-mono leading-relaxed max-h-[300px] scrollbar-thin">
        <pre>{code}</pre>
      </div>
    </div>
  );
}

export default function QuickChat({ owner, repo, repoMeta, analysis }: QuickChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Clear chat history when repository shifts
    setMessages([
      {
        id: "intro-message",
        role: "model",
        content: `I've completely loaded and indexed the structural data for **${owner}/${repo}**. Feel free to ask me questions regarding directory workflows, setup suggestions, refactoring insights, or technology selections!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setError(null);
  }, [owner, repo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (rawMessage: string) => {
    const text = rawMessage.trim();
    if (!text || isSending) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsSending(true);

    try {
      // Grab short-listed history for scaling contexts safely
      const mappedHistory = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          repo,
          message: text,
          history: mappedHistory,
          repoMeta,
          analysis
        })
      });

      if (!res.ok) {
        throw new Error("Server failed to respond correctly. Try again in a little bit!");
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: "model",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || "Something went wrong sending messages");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-[650px]" id="repository-quick-chat">
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/5 text-indigo-400 border border-white/10 rounded-lg">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-display">
              Interactive Repository Chat
            </h3>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">
              Ask specifics about this project codebase
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-sans text-indigo-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full font-medium">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Gemini 3.5 Core
        </div>
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length <= 1 && (
        <div className="mb-4 shrink-0 px-1" id="chat-suggested-prompts">
          <p className="text-[10px] font-sans text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1 font-bold">
            <Info className="w-3 h-3" />
            Quick-start questions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMON_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                type="button"
                className="text-left px-3.5 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] bg-white/[0.02] border border-white/5 rounded-xl transition-all cursor-pointer font-sans"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Messages viewport */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 scrollbar-thin flex flex-col custom-chat-messages-viewport">
        {messages.map((m) => (
          <div
            key={m.id}
            id={m.id}
            className={`flex gap-3 max-w-[85%] ${
              m.role === "user" ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            {/* Avatar block */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-650 text-white border-indigo-500 font-medium"
                  : "bg-white/5 text-slate-300 border-white/10"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble contents */}
            <div className="flex flex-col gap-1">
              <div
                className={`p-4 rounded-3xl ${
                  m.role === "user"
                    ? "bg-indigo-600/85 text-white rounded-tr-none border border-indigo-500/30 shadow-md"
                    : "bg-white/[0.02] border border-white/5 text-slate-300 rounded-tl-none font-sans"
                }`}
              >
                {m.role === "user" ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <div className="space-y-1.5 leading-relaxed selection:bg-indigo-950/50">{formatMarkdown(m.content)}</div>
                )}
              </div>
              <span
                className={`text-[9px] text-slate-500 font-sans px-1.5 ${
                  m.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex gap-3 max-w-[80%] self-start" id="chat-loading-item">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-4 h-4 animate-pulse text-indigo-400" />
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl rounded-tl-none flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={listEndRef} />
      </div>

      {error && (
        <p className="text-red-450 text-xs font-sans pb-2 px-1 text-center" id="chat-error-log">
          {error}
        </p>
      )}

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMessage);
        }}
        className="relative shrink-0"
        id="chat-send-form"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            id="chat-search-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
            placeholder="Query codebase structure, technical designs, scripts..."
            className="w-full pr-14 pl-4 py-4 bg-[#080809] border border-white/10 rounded-2xl text-xs sm:text-sm placeholder-slate-550 text-slate-200 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            id="chat-submit-btn"
            disabled={isSending || !inputMessage.trim()}
            className="absolute right-2 px-3 py-2 bg-white hover:bg-slate-200 hover:text-black text-black rounded-xl shadow-sm transition-all focus:outline-none disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none cursor-pointer font-semibold text-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between items-center px-1.5 mt-1.5 text-[10px] text-slate-500 font-sans">
          <span>Type questions about files or build scripts</span>
          <span className="flex items-center gap-0.5">
            Press <CornerDownLeft className="w-2.5 h-2.5 inline" /> to submit
          </span>
        </div>
      </form>
    </div>
  );
}
