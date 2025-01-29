import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Object } from "../../models/lib/object.model.js";

const router = Router();

// Initialize Pinecone and Google AI
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const pineconeIndex = pinecone.index("my-ai-index");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Embedding model for vectorization
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

// Improved system prompt with better personality and capabilities description
const SYSTEM_PROMPT = `You are a helpful and intelligent AI assistant that serves as a personal knowledge manager. Your name is March Assistant.

Your core capabilities include:
1. Storing and retrieving user's notes, tasks, and other information
2. Answering questions based on stored content
3. Helping users organize and understand their information
4. Maintaining context across conversations

When responding without stored context:
- Introduce yourself as March Assistant
- Explain that you can help manage and retrieve personal information
- Offer to store new information or suggest ways to use the system

When responding with context:
- Directly answer questions using stored information
- Synthesize multiple pieces of information when relevant
- Maintain a helpful and professional tone
- Format responses clearly using markdown when appropriate

Always be:
- Clear and direct in your responses
- Helpful in suggesting next steps
- Honest about what information is or isn't available`;

// Using gemini-1.5-flash with improved configuration
const chatModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40
    },
    systemInstruction: SYSTEM_PROMPT
});

// Add retry logic for AI operations
async function withRetry (operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxRetries) throw error;
            if (error.message.includes('503') || error.message.includes('overloaded')) {
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
                continue;
            }
            throw error;
        }
    }
}

// Generate embeddings for text
async function generateEmbedding (text) {
    return withRetry(async () => {
        try {
            const result = await embeddingModel.embedContent(text);
            const embedding = result.embedding.values;

            if (!embedding || embedding.length === 0) {
                throw new Error("Empty embedding generated");
            }

            return embedding;
        } catch (error) {
            console.error("Embedding generation failed:", error);
            throw error;
        }
    });
}

// Save new content with embeddings
async function saveContent (title, content, userId, type = 'note') {
    try {
        // Generate embedding for the content
        const embedding = await generateEmbedding(`${title} ${content}`);

        // Save to MongoDB
        const newObject = await Object.create({
            title,
            content,
            type,
            user: userId,
            createdAt: new Date()
        });

        // Save to Pinecone
        await pineconeIndex.upsert([{
            id: newObject._id.toString(),
            values: embedding,
            metadata: {
                title,
                content,
                type,
                userId: userId.toString(),
                createdAt: new Date().toISOString()
            }
        }]);

        return newObject;
    } catch (error) {
        console.error("Failed to save content:", error);
        throw error;
    }
}

// Search and retrieve relevant content
async function searchContent (query, userId, options = { limit: 5 }) {
    try {
        const queryEmbedding = await generateEmbedding(query);

        const searchResults = await pineconeIndex.query({
            vector: queryEmbedding,
            topK: options.limit,
            filter: {
                userId: userId.toString()
            },
            includeMetadata: true
        });

        return searchResults.matches.map(match => ({
            ...match.metadata,
            score: match.score
        }));
    } catch (error) {
        console.error("Search failed:", error);
        throw error;
    }
}

// Format content for AI response
function formatContextForAI (relevantContent) {
    return relevantContent.map(item => {
        return `CONTENT(type=${item.type}, relevance=${item.score.toFixed(2)}):
Title: ${item.title}
Content: ${item.content}
---`;
    }).join('\n');
}

// Generate AI response with fallback
async function generateAIResponse (prompt, hasContext = true) {
    return withRetry(async () => {
        try {
            if (!hasContext) {
                const introPrompt = `The user has asked: "${prompt}"
                Please respond according to your introduction protocol, explaining your capabilities as March Assistant
                and how you can help them manage their information. Be engaging but concise.`;

                const result = await chatModel.generateContent(introPrompt);
                return result.response.text();
            }

            const result = await chatModel.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            if (error.message.includes('503') || error.message.includes('overloaded')) {
                if (!hasContext) {
                    return `Hi! I'm March Assistant, your personal knowledge manager. I can help you store and retrieve information, manage tasks, and answer questions based on your stored content. Would you like to start by saving some information or learning more about how I can help?`;
                }

                const relevantPieces = prompt.split('Question:')[0]
                    .split('CONTENT')
                    .filter(piece => piece.includes('relevance'))
                    .sort((a, b) => {
                        const scoreA = parseFloat(a.match(/relevance=(\d+\.\d+)/)?.[1] || 0);
                        const scoreB = parseFloat(b.match(/relevance=(\d+\.\d+)/)?.[1] || 0);
                        return scoreB - scoreA;
                    });

                if (relevantPieces.length > 0) {
                    return `Based on the most relevant stored information: ${relevantPieces[0].split('Content:')[1].split('---')[0].trim()}`;
                }
            }
            throw error;
        }
    });
}

// API Routes
router.post("/content", async (req, res) => {
    try {
        const { title, content, type } = req.body;
        const userId = req.user._id;

        const savedContent = await saveContent(title, content, userId, type);
        res.json(savedContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/ask", async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user._id;

        if (!query?.trim()) {
            return res.status(400).json({ error: "Query is required" });
        }

        // Search for relevant content
        const relevantContent = await searchContent(query, userId, { limit: 5 });

        let answer;
        if (relevantContent.length === 0) {
            // Generate response without context
            answer = await generateAIResponse(query, false);

            return res.json({
                answer,
                suggestion: "Try saving some information first using the /content endpoint",
                hasStoredContent: false
            });
        }

        // Format context for AI
        const context = formatContextForAI(relevantContent);

        // Generate AI response with context
        const prompt = `Based on the following information from the user's stored content:

${context}

Question: "${query}"

Please provide a helpful response that directly answers the question using the available information.`;

        answer = await generateAIResponse(prompt, true);

        res.json({
            answer,
            hasStoredContent: true,
            relevantContent: relevantContent.map(({ title, type, score }) => ({
                title,
                type,
                relevance: score
            }))
        });
    } catch (error) {
        console.error("Error processing question:", error);
        res.status(500).json({
            error: "An error occurred while processing your request. Please try again later.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;
