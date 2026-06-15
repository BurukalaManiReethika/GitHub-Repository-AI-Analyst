import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper: Safely fetch from GitHub API with optional user token & User-Agent
async function fetchFromGitHub(endpoint: string, userToken?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitHub-Repo-AI-Analyst-App",
  };

  if (userToken && userToken.trim() !== "") {
    headers["Authorization"] = `token ${userToken}`;
  }

  const response = await fetch(`https://api.github.com/${endpoint}`, { headers });
  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error(`GitHub API limit exceeded or access forbidden (Status: ${response.status}). If possible, please supply a GitHub Personal Access Token in Settings.`);
    }
    throw new Error(`Failed to retrieve data from GitHub (Status: ${response.status}). Please check the repository name.`);
  }
  return response.json();
}

// Helper: Safely fetch README content with fallback
async function fetchReadmeContent(owner: string, repo: string, userToken?: string): Promise<string> {
  try {
    const data = await fetchFromGitHub(`repos/${owner}/${repo}/readme`, userToken) as { content?: string; encoding?: string };
    if (data.content && data.encoding === "base64") {
      // Decode base64
      const cleanedBase64 = data.content.replace(/\s/g, "");
      return Buffer.from(cleanedBase64, "base64").toString("utf-8");
    }
  } catch (err: any) {
    console.warn("Primary README fetch failed, trying fallback to raw content router", err.message);
  }

  // Fallback 1: Try raw.githubusercontent.com main
  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    const res = await fetch(rawUrl, { headers: { "User-Agent": "GitHub-Repo-AI-Analyst-App" } });
    if (res.ok) return await res.text();
  } catch (e) {}

  // Fallback 2: Try raw.githubusercontent.com master
  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
    const res = await fetch(rawUrl, { headers: { "User-Agent": "GitHub-Repo-AI-Analyst-App" } });
    if (res.ok) return await res.text();
  } catch (e) {}

  return "No README file found or accessible for this repository.";
}

// API: Analyze repository metadata & README with Gemini API
app.post("/api/analyze-repo", async (req, res) => {
  const { owner, repo, token } = req.body;

  if (!owner || !repo) {
    return res.status(400).json({ error: "Missing repository identity parameters" });
  }

  try {
    // 1. Fetch live metadata and language specifications
    const repoInfoFuture = fetchFromGitHub(`repos/${owner}/${repo}`, token);
    const languagesFuture = fetchFromGitHub(`repos/${owner}/${repo}/languages`, token);
    const readmeContentFuture = fetchReadmeContent(owner, repo, token);

    const [repoInfo, languages, readme] = await Promise.all([
      repoInfoFuture,
      languagesFuture,
      readmeContentFuture,
    ]);

    // Truncate README content to prevent context overflow, while preserving significant content
    const maxReadmeLength = 15000;
    const truncatedReadme = readme.length > maxReadmeLength 
      ? readme.substring(0, maxReadmeLength) + "\n\n...[README truncated for length]..."
      : readme;

    // Create the analytical prompt for Gemini
    const analysisPrompt = `
      You are an expert software architect and open-source project analyst.
      Analyze the following GitHub repository metrics and its parsed README file:

      Repository: ${owner}/${repo}
      Description: ${repoInfo.description || "No description provided"}
      Languages detected: ${JSON.stringify(languages)}
      Primary Language: ${repoInfo.language || "Unknown"}
      Stars: ${repoInfo.stargazers_count}
      Forks: ${repoInfo.forks_count}
      Open Issues: ${repoInfo.open_issues_count}

      README File:
      """
      ${truncatedReadme}
      """

      Generate a highly-detailed, accurate analysis. Do not include mock values. Adhere to the requested JSON response schema structure.
    `;

    // Leverage Gemini-3.5-flash for structured analysis
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: analysisPrompt,
      config: {
        systemInstruction: "You are a professional software analyst. Provide deep, accurate insights. Do not hallucinate. Format your output strictly using the requested JSON schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { 
              type: Type.STRING, 
              description: "A highly informative, human-readable summary of this repository (exactly 2-3 sentences)." 
            },
            architecture: {
              type: Type.OBJECT,
              properties: {
                primaryStack: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }, 
                  description: "Key programming languages, frameworks, or libraries identified." 
                },
                designPattern: { 
                  type: Type.STRING, 
                  description: "The primary design pattern, system design features, or architectural layout of the codebase." 
                },
                keyComponents: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }, 
                  description: "A bulleted breakdown of main folders or structural elements highlighted." 
                }
              },
              required: ["primaryStack", "designPattern", "keyComponents"]
            },
            setupQuickstart: { 
              type: Type.STRING, 
              description: "Elegant, brief instructions or CLI commands to build, install dependencies, and run this project." 
            },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 4 compelling highlights or accomplishments of this repository."
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 actionable suggestions focusing on security, code-splitting, standard updates, or performance."
            }
          },
          required: ["summary", "architecture", "setupQuickstart", "highlights", "recommendations"]
        }
      }
    });

    const parsedAnalysis = JSON.parse(geminiResponse.text?.trim() || "{}");

    res.json({
      repoInfo: {
        name: repoInfo.name,
        fullName: repoInfo.full_name,
        description: repoInfo.description,
        stars: repoInfo.stargazers_count,
        forks: repoInfo.forks_count,
        watchers: repoInfo.watchers_count,
        openIssues: repoInfo.open_issues_count,
        ownerAvatar: repoInfo.owner?.avatar_url,
        homepage: repoInfo.homepage,
        license: repoInfo.license?.name || "None Specified",
        updatedAt: repoInfo.updated_at,
        defaultBranch: repoInfo.default_branch,
      },
      languages,
      analysis: parsedAnalysis
    });

  } catch (error: any) {
    console.error("API error during analysis setup:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during analysis" });
  }
});

// API: Perform interactive Gemini chats scoped to the repository context
app.post("/api/chat-repo", async (req, res) => {
  const { owner, repo, message, history, repoMeta, analysis } = req.body;

  if (!owner || !repo || !message) {
    return res.status(400).json({ error: "Missing required chat parameters" });
  }

  try {
    // Scaffold system context containing everything about this repository
    const systemContext = `
      You are an expert developer assistant responding to queries about the repository: ${owner}/${repo}.
      Here is the repository metadata:
      - Description: ${repoMeta?.description || "No description"}
      - Primary license: ${repoMeta?.license || "Unknown"}
      - Key topics: ${JSON.stringify(analysis?.architecture?.primaryStack || [])}
      - Architectural design pattern: ${analysis?.architecture?.designPattern || "Interactive design"}
      - Highlights: ${JSON.stringify(analysis?.highlights || [])}

      Use this codebase state to respond thoroughly, accurately, and professionally. Use Markdown for formatting. Reference directory layouts, suggest improvements, or answer generic queries within this context.
    `;

    // Map history to standard chat interface parameters
    const chatHistory = (history && history.length > 0)
      ? history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        }))
      : [];

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: chatHistory,
      config: {
        systemInstruction: systemContext,
      }
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during chat session" });
  }
});

// Mount Vite middleware / static files router
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Vite Server] Bound successfully on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
