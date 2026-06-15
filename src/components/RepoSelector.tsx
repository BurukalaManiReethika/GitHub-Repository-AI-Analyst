import React, { useState } from "react";
import { Search, Github, Cpu, Sparkles } from "lucide-react";

interface RepoSelectorProps {
  onAnalyze: (owner: string, repo: string) => void;
  isLoading: boolean;
}

const PRESETS = [
  { owner: "google", repo: "zx", label: "google/zx", desc: "Scripting tool" },
  { owner: "tailwindlabs", repo: "tailwindcss", label: "tailwind/css", desc: "Utility-first CSS" },
  { owner: "facebook", repo: "react", label: "facebook/react", desc: "UI Library" },
  { owner: "expressjs", repo: "express", label: "expressjs/express", desc: "Node.js Server" },
  { owner: "lucide-react", repo: "lucide", label: "lucide/icons", desc: "Beautiful icons" }
];

export default function RepoSelector({ onAnalyze, isLoading }: RepoSelectorProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.trim()) {
      setError("Please key in a valid GitHub repository path or URL");
      return;
    }

    // Support both full URLs (e.g., https://github.com/facebook/react) and path formats (e.g., facebook/react)
    let cleanInput = input.trim().replace(/\/$/, ""); // remove trailing slash
    
    if (cleanInput.includes("github.com/")) {
      const parts = cleanInput.split("github.com/");
      if (parts.length > 1) {
        cleanInput = parts[1];
      }
    }

    const segments = cleanInput.split("/");
    if (segments.length < 2) {
      setError("Please format as 'owner/repository' (e.g. facebook/react)");
      return;
    }

    const owner = segments[segments.length - 2];
    const repo = segments[segments.length - 1];

    if (!owner || !repo) {
      setError("Could not parse owner and repository name correctly");
      return;
    }

    onAnalyze(owner, repo);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          Powered by Gemini 3.5 & Live GitHub Telemetry
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white font-display sm:text-4xl">
          GitHub Repository <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI Analyst</span>
        </h2>
        <p className="mt-3 text-slate-400 font-sans leading-relaxed text-sm sm:text-base">
          Analyze any public GitHub repository instantly. Retrieve live metrics, map code architecture, extract installation setups, and chat directly with its codebase context using Gemini AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 w-full" id="repo-search-form">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Github className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              id="repo-input-url"
              placeholder="Enter repository (e.g., facebook/react or full GitHub link)"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(null);
              }}
              className="block w-full pl-12 pr-4 py-4 bg-[#080809] border border-white/10 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500 text-sm sm:text-base transition-all font-sans"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            id="analyze-btn"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-200 text-black font-semibold rounded-2xl shadow-md cursor-pointer disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none transition-all text-sm sm:text-base shrink-0"
          >
            {isLoading ? (
              <>
                <Cpu className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze Project
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-red-400 text-xs font-sans pl-2" id="selector-error">
            {error}
          </p>
        )}
      </form>

      {/* Preset Recommendations */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <p className="text-xs font-sans text-slate-500 uppercase tracking-widest mb-3 font-bold">
          Try a popular public project
        </p>
        <div className="flex flex-wrap gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              id={`preset-${preset.owner}-${preset.repo}`}
              type="button"
              onClick={() => {
                setInput(`${preset.owner}/${preset.repo}`);
                onAnalyze(preset.owner, preset.repo);
              }}
              disabled={isLoading}
              className="flex flex-col items-start px-4 py-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 hover:shadow-lg rounded-xl cursor-pointer text-left transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-xs font-semibold text-slate-300 group-hover:text-indigo-400 transition-colors">
                {preset.label}
              </span>
              <span className="text-[10px] text-slate-500 font-sans mt-0.5">
                {preset.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
