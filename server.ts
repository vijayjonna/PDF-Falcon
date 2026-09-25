import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client Lazily/Safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Healthcheck API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Summarizer API
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { text, fileName, options } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No document text provided." });
    }

    const ai = getGeminiClient();
    const prompt = `Analyze the following document content from file "${fileName || "document.pdf"}".
Provide a structured response in Markdown format including:
1. **Executive Summary** (2-3 concise paragraphs)
2. **Key Takeaways & Highlights** (bulleted list)
3. **Important Dates, Numbers & Entities** (if applicable)
4. **Action Items / Next Steps** (if applicable)

Document Content:
${text.slice(0, 30000)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert document intelligence assistant that creates thorough, elegant, clear Markdown summaries of PDFs.",
      },
    });

    res.json({ result: response.text || "Failed to generate summary." });
  } catch (err: any) {
    console.error("Error in /api/ai/summarize:", err);
    res.status(500).json({ error: err.message || "Failed to summarize document." });
  }
});

// AI Translate API
app.post("/api/ai/translate", async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Text and targetLanguage are required." });
    }

    const ai = getGeminiClient();
    const prompt = `Translate the following text into ${targetLanguage}. Maintain original headings, bullet structure, and formatting cleanly.

Text to translate:
${text.slice(0, 25000)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional document translator. Translate accurately preserving professional terminology.",
      },
    });

    res.json({ translatedText: response.text || "" });
  } catch (err: any) {
    console.error("Error in /api/ai/translate:", err);
    res.status(500).json({ error: err.message || "Failed to translate document." });
  }
});

// AI PDF to Markdown API
app.post("/api/ai/markdown", async (req, res) => {
  try {
    const { text, fileName } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No document text provided." });
    }

    const ai = getGeminiClient();
    const prompt = `Convert the following document raw text extracted from "${fileName || "document.pdf"}" into clean, beautifully structured GitHub-flavored Markdown.
Include headings (#, ##), bulleted/numbered lists, quotes, and clean Markdown tables where appropriate.

Raw Document Content:
${text.slice(0, 30000)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ markdown: response.text || "" });
  } catch (err: any) {
    console.error("Error in /api/ai/markdown:", err);
    res.status(500).json({ error: err.message || "Failed to convert document to Markdown." });
  }
});

// AI OCR for Images/Scans API
app.post("/api/ai/ocr", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Image base64 data required." });
    }

    const ai = getGeminiClient();
    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          imagePart,
          { text: "Perform high-accuracy Optical Character Recognition (OCR) on this document image. Extract all text verbatim preserving layout, headers, paragraphs, and tables." },
        ],
      },
    });

    res.json({ extractedText: response.text || "" });
  } catch (err: any) {
    console.error("Error in /api/ai/ocr:", err);
    res.status(500).json({ error: err.message || "OCR recognition failed." });
  }
});

// AI Q&A Chat with Document API
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { documentText, question, chatHistory } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const ai = getGeminiClient();
    const prompt = `You are a helpful document assistant answering questions based strictly on the provided document content.
Document Content Context:
${(documentText || "").slice(0, 25000)}

Previous conversation:
${(chatHistory || []).map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n')}

User Question: ${question}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ answer: response.text || "I could not analyze this document." });
  } catch (err: any) {
    console.error("Error in /api/ai/chat:", err);
    res.status(500).json({ error: err.message || "Failed to answer question." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
