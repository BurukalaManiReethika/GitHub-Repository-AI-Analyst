import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, Star, GitFork, AlertCircle, BookOpen, Terminal, 
  Sparkles, ExternalLink, RefreshCw, Layers, ShieldCheck, Heart, 
  Command, Copy, Check, Clock, SquareTerminal, Cpu, HardDriveDownload
} from "lucide-react";

import RepoSelector from "./components/RepoSelector";
import LanguageBreakdown from "./components/LanguageBreakdown";
import QuickChat from "./components/QuickChat";
import { RepoAnalysisResponse } from "./types";

export default function App() {
  const [owner, setOwner] = useState("google");
  const [repo, setRepo] = useState("zx");
  const [isLoading, setIsLoading] = useState(false);
  const [repoData, setRepoData] = useState<RepoAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedQuickstart, setCopiedQuickstart] = useState(false);

  // Analyze the chosen repository
  const handleAnalyze = async (selectedOwner: string, selectedRepo: string) => {
    setIsLoading(true);
    setError(null);
    setOwner(selectedOwner);
    setRepo(selectedRepo);

    try {
      const response = await fetch("/api/analyze-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: selectedOwner, repo: selectedRepo })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to analyze repository metrics");
      }

      const data = await response.json();
      setRepoData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected issue occurred while mapping codebase telemetry");
    } finally {
      setIsLoading(false);
    }
  };

  // Perform initial demo load of Google's ZX script helper project on startup
  useEffect(() => {
    handleAnalyze("google", "zx");
  }, []);

  const handleCopyQuickstart = () => {
    if (!repoData) return;
    navigator.clipboard.writeText(repoData.analysis.setupQuickstart);
    setCopiedQuickstart(true);
    setTimeout(() => setCopiedQuickstart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Sleek Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0D0D0E]/85 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-650 rounded-xl flex items-center justify-center text-white font-mono shadow-lg shadow-indigo-600/30">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight font-display">
                GitBlueprint <span className="text-xs text-indigo-400 font-normal font-sans ml-1">AI Analyst</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-sans tracking-wide">
                Codebase Architect & Repository Insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live UTC clock indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 font-mono text-[10px]">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>UTC : {new Date().toISOString().substring(11, 16)}</span>
            </div>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer transition-all"
            >
              <Github className="w-4 h-4 text-slate-400" />
              <span>GitHub Org</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Repo Finder / Search Module */}
        <RepoSelector onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Global Error Notice Panel */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto mb-8 bg-rose-950/20 border border-rose-900/30 rounded-2xl p-5 flex items-start gap-3"
            id="global-error-panel"
          >
            <AlertCircle className="w-5 h-5 text-rose-450 shrink-0 mt-0.5 animate-bounce" />
            <div className="font-sans">
              <h4 className="text-sm font-semibold text-white">Telemetry Analysis Interrupted</h4>
              <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                {error}
              </p>
              <button
                onClick={() => handleAnalyze(owner, repo)}
                type="button"
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black hover:bg-slate-200 border border-transparent rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all animate-pulse"
              >
                <RefreshCw className="w-3 h-3 text-black" />
                Retry connection
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            /* Immersive Shimmering Dark Skeleton Suite */
            <motion.div
              key="skeleton-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              id="shimmer-loading-root"
            >
              <div className="lg:col-span-2 space-y-8">
                {/* Repo Banner skeleton */}
                <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl" />
                    <div className="space-y-2 flex-grow">
                      <div className="h-5 bg-white/10 rounded-lg w-1/3" />
                      <div className="h-3 bg-white/5 rounded-lg w-2/3" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-4 bg-white/5 rounded-lg w-full" />
                    <div className="h-4 bg-white/5 rounded-lg w-5/6" />
                  </div>
                </div>

                {/* Grid metrics skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 h-24 flex flex-col justify-between">
                      <div className="w-7 h-7 bg-white/10 rounded-lg" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                  ))}
                </div>

                {/* Multi-segmented breakdown skeleton */}
                <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 h-56 space-y-4 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/4" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-10 bg-white/[0.02] border border-white/5 rounded-xl" />
                    <div className="h-10 bg-white/[0.02] border border-white/5 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Chat column skeleton */}
              <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 h-[600px] animate-pulse space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 bg-white/10 rounded-lg" />
                    <div className="h-4 bg-white/10 rounded w-28" />
                  </div>
                  <div className="w-16 h-6 bg-indigo-500/10 rounded-full" />
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="h-14 bg-white/5 rounded-2xl w-3/4" />
                  <div className="h-14 bg-white/5 rounded-2xl w-2/3 self-end" />
                  <div className="h-14 bg-white/5 rounded-2xl w-4/5" />
                </div>
                <div className="h-12 bg-white/5 border border-white/5 rounded-xl" />
              </div>
            </motion.div>
          ) : repoData ? (
            /* Live Dashboard Analytics Platform */
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              id="dashboard-root-panel"
            >
              {/* Primary Insights Columns */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Subheader Titlecard */}
                <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl" id="repo-banner-card">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={repoData.repoInfo.ownerAvatar}
                        alt={repoData.repoInfo.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl border border-white/10 shadow-lg"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xl font-bold text-white tracking-tight font-display">
                            {repoData.repoInfo.name}
                          </h3>
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] text-slate-400 font-mono">
                            {repoData.repoInfo.defaultBranch}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-sans mt-0.5 flex items-center gap-1">
                          <Github className="w-3 h-3 text-slate-500" />
                          <span>github.com/{repoData.repoInfo.fullName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 sm:mt-0">
                      {repoData.repoInfo.homepage && (
                        <a
                          href={repoData.repoInfo.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-2 bg-indigo-650/20 hover:bg-[#1f1e3a] border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-xl cursor-pointer transition-all"
                        >
                          <span className="p-0.5 bg-white/10 rounded">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </span>
                          Website
                        </a>
                      )}
                      <a
                        href={`https://github.com/${repoData.repoInfo.fullName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition-all"
                      >
                        <Github className="w-4 h-4 text-slate-450" />
                        Explore on GitHub
                      </a>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-300 font-sans leading-relaxed">
                    {repoData.repoInfo.description || "This repository provides no standard high-level description on GitHub and relies solely on secondary documentations."}
                  </p>

                  <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between flex-wrap gap-4 text-xs font-sans text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      License : <strong className="text-slate-300 font-medium">{repoData.repoInfo.license}</strong>
                    </span>
                    <span>
                      Last synchronized updates : <strong className="text-slate-300 font-medium">{new Date(repoData.repoInfo.updatedAt).toLocaleDateString()}</strong>
                    </span>
                  </div>
                </div>

                {/* 4 Bento Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="metric-bento-grid">
                  <div className="bg-[#0D0D0E] border border-white/10 rounded-2xl p-4 shadow-2xl hover:border-white/15 transition-all duration-300">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 fill-amber-500" />
                    </div>
                    <p className="text-xs text-slate-500 font-sans mt-3">Stargazers</p>
                    <p className="text-lg font-bold text-white mt-1 font-mono">{repoData.repoInfo.stars.toLocaleString()}</p>
                  </div>

                  <div className="bg-[#0D0D0E] border border-white/10 rounded-2xl p-4 shadow-2xl hover:border-white/15 transition-all duration-300">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <GitFork className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 font-sans mt-3">Forks Index</p>
                    <p className="text-lg font-bold text-white mt-1 font-mono">{repoData.repoInfo.forks.toLocaleString()}</p>
                  </div>

                  <div className="bg-[#0D0D0E] border border-white/10 rounded-2xl p-4 shadow-2xl hover:border-white/15 transition-all duration-300">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-450 border border-rose-500/20 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 font-sans mt-3">Open Issues</p>
                    <p className="text-lg font-bold text-white mt-1 font-mono">{repoData.repoInfo.openIssues.toLocaleString()}</p>
                  </div>

                  <div className="bg-[#0D0D0E] border border-white/10 rounded-2xl p-4 shadow-2xl hover:border-white/15 transition-all duration-300">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 font-sans mt-3">Watchers</p>
                    <p className="text-lg font-bold text-white mt-1 font-mono">{repoData.repoInfo.watchers.toLocaleString()}</p>
                  </div>
                </div>

                {/* Split segment: Languages + AI Synopsis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Executive AI Synopsis */}
                  <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 shadow-2xl md:col-span-2 flex flex-col justify-between" id="synopsis-card">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-white/5 text-indigo-400 border border-white/10 rounded-lg">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-semibold text-white font-display">
                          Executive AI Synopsis
                        </h3>
                      </div>
                      <p className="text-sm text-slate-350 leading-relaxed font-sans font-normal italic">
                        &ldquo;{repoData.analysis.summary}&rdquo;
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-sans text-indigo-400 font-medium">
                      <Cpu className="w-3.5 h-3.5 animate-pulse" />
                      Analyzed by Gemini on raw source README configurations
                    </div>
                  </div>

                  {/* Language breakdown */}
                  <div>
                    <LanguageBreakdown languages={repoData.languages} />
                  </div>
                </div>

                {/* Codebase technical architecture mapping */}
                <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6" id="architecture-blueprint-card">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                    <div className="p-1.5 bg-white/5 text-slate-300 border border-white/10 rounded-lg">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white font-display">
                        Codebase Architectural Blueprint
                      </h3>
                      <p className="text-[10px] text-slate-505 font-sans mt-0.5">
                        Technical stacks, component mappings, and software design patterns
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Technical Tags */}
                    <div>
                      <h4 className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-2">
                        Dependencies & Platforms
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {repoData.analysis.architecture.primaryStack.map((stackItem) => (
                          <span
                            key={stackItem}
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-300 transition-colors"
                          >
                            {stackItem}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Structural Architectural Concept */}
                    <div>
                      <h4 className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-2">
                        System Layout & Core Patterns
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-sans">
                        {repoData.analysis.architecture.designPattern}
                      </p>
                    </div>
                  </div>

                  {/* Folder Structure mapping */}
                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-3 font-bold">
                      Directory Architecture Highlighted
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {repoData.analysis.architecture.keyComponents.map((component, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2.5 p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl text-xs font-medium text-slate-300 transition-all font-sans"
                        >
                          <span className="w-2 h-2 rounded-full bg-slate-500" />
                          <span>{component}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Installation Commands Workspace */}
                <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-200" id="terminal-setup-card">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-white/5 text-white rounded-lg flex items-center justify-center border border-white/10">
                        <SquareTerminal className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold tracking-wide text-white">
                          Quick-start & Setup commands
                        </h3>
                        <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                          Extracted from installation script profiles
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCopyQuickstart}
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-xs font-medium text-slate-300 hover:text-white rounded-xl cursor-pointer transition-all"
                    >
                      {copiedQuickstart ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-450" />
                          <span className="text-emerald-405 font-semibold">Copied instructions</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy setup script</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-[#080809] rounded-2xl p-4 font-mono text-xs text-indigo-400 leading-relaxed max-h-[250px] overflow-y-auto scrollbar-thin border border-white/5">
                    <pre className="whitespace-pre-wrap">{repoData.analysis.setupQuickstart}</pre>
                  </div>
                </div>

                {/* Optimizations & Recommendations */}
                <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4" id="recommendations-card">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-white/5 mb-4">
                    <div className="p-1.5 bg-white/5 text-emerald-450 border border-white/10 rounded-lg">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white font-display">
                        AI Codebase Recommendations
                      </h3>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Performance optimizations, system warnings, and architectural updates
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {repoData.analysis.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex gap-3.5 p-4 bg-white/[0.01]/30 hover:bg-white/[0.02] border border-white/5 rounded-2xl transition-colors font-sans"
                      >
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-xs">
                          {index + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {rec}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Column - Scoped Interactive Chat */}
              <div className="lg:sticky lg:top-24 h-fit">
                <QuickChat
                  owner={owner}
                  repo={repo}
                  repoMeta={repoData.repoInfo}
                  analysis={repoData.analysis}
                />
              </div>

            </motion.div>
          ) : (
            /* Blank empty state fallback */
            <div className="text-center py-20 bg-[#0D0D0E] border border-white/10 rounded-3xl p-8" id="empty-state-panel">
              <Github className="w-12 h-12 text-slate-600 mx-auto animate-pulse mb-3" />
              <p className="text-slate-500 text-sm font-sans">
                Type in any public GitHub repository to map codebase blueprints instantly.
              </p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer credits boundary */}
      <footer className="mt-20 border-t border-white/10 bg-[#0A0A0B] py-8 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-slate-550">
          <p className="flex items-center gap-1 justify-center sm:justify-start">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for open-source engineering exploration.
          </p>
          <p className="font-mono text-[10px] text-slate-600">
             Clean Architect Platform © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
