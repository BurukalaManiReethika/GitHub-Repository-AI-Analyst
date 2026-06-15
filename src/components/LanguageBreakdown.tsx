import { Code2 } from "lucide-react";

interface LanguageBreakdownProps {
  languages: Record<string, number>;
}

// Map key GitHub languages to their exact official Hex codes
const COLOR_MAP: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Ruby: "#701516",
  Go: "#00add8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4f5d95",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

// Fallback color generator using string hashing
function getDeterministicColor(str: string): string {
  if (COLOR_MAP[str]) return COLOR_MAP[str];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

export default function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  const totalWeight = Object.values(languages).reduce((sum, val) => sum + val, 0);

  if (totalWeight === 0 || Object.keys(languages).length === 0) {
    return (
      <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center text-center h-full">
        <Code2 className="w-8 h-8 text-slate-650 mb-2 animate-pulse" />
        <p className="text-sm font-sans text-slate-500">No language details found</p>
      </div>
    );
  }

  // Calculate percentages and sort descending
  const computed = Object.entries(languages)
    .map(([name, weight]) => {
      const percent = (weight / totalWeight) * 100;
      return {
        name,
        weight,
        percent: parseFloat(percent.toFixed(1)),
        color: getDeterministicColor(name),
      };
    })
    .sort((a, b) => b.weight - a.weight);

  // Take top languages, merge others
  const limit = 5;
  let displayLanguages = computed.slice(0, limit);
  if (computed.length > limit) {
    const mixedPercent = computed
      .slice(limit)
      .reduce((sum, item) => sum + item.percent, 0);
    displayLanguages.push({
      name: "Other",
      weight: 0,
      percent: parseFloat(mixedPercent.toFixed(1)),
      color: "#94a3b8",
    });
  }

  return (
    <div className="bg-[#0D0D0E] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full" id="language-breakdown-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-white/5 text-indigo-400 border border-white/10 rounded-lg">
          <Code2 className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold text-white font-display">
          Source Language Breakdown
        </h3>
      </div>

      {/* Multi-segmented distribution bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-white/5 border border-white/5 mb-6">
        {displayLanguages.map((lang, idx) => (
          <div
            key={lang.name}
            id={`lang-segment-${idx}`}
            style={{
              width: `${lang.percent}%`,
              backgroundColor: lang.color,
            }}
            title={`${lang.name}: ${lang.percent}%`}
            className="h-full transition-all duration-300 hover:opacity-90 cursor-help"
          />
        ))}
      </div>

      {/* Structured metrics representation */}
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[140px] pr-1 scrollbar-thin">
        {displayLanguages.map((lang, idx) => (
          <div
            key={lang.name}
            id={`lang-entry-${idx}`}
            className="flex items-center gap-2.5 p-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all"
          >
            <span
              style={{ backgroundColor: lang.color }}
              className="w-2.5 h-2.5 rounded-full shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-300 truncate">
                {lang.name}
              </span>
              <span className="text-[10px] font-sans text-slate-500">
                {lang.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
