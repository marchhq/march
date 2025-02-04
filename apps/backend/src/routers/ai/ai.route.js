// import { Router } from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { Object } from "../../models/lib/object.model.js";

// const router = Router();

// // Initialize Pinecone and Google AI
// const pinecone = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY
// });

// const pineconeIndex = pinecone.index("my-ai-index");
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// // Embedding model for vectorization
// const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

// // Improved system prompt with better personality and capabilities description
// const SYSTEM_PROMPT = `You are a helpful and intelligent AI assistant that serves as a personal knowledge manager. Your name is March Assistant.

// Your core capabilities include:
// 1. Storing and retrieving user's notes, tasks, and other information
// 2. Answering questions based on stored content
// 3. Helping users organize and understand their information
// 4. Maintaining context across conversations

// When responding without stored context:
// - Introduce yourself as March Assistant
// - Explain that you can help manage and retrieve personal information
// - Offer to store new information or suggest ways to use the system

// When responding with context:
// - Directly answer questions using stored information
// - Synthesize multiple pieces of information when relevant
// - Maintain a helpful and professional tone
// - Format responses clearly using markdown when appropriate

// Always be:
// - Clear and direct in your responses
// - Helpful in suggesting next steps
// - Honest about what information is or isn't available`;

// // Using gemini-1.5-flash with improved configuration
// const chatModel = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     generationConfig: {
//         temperature: 0.7,
//         topP: 0.8,
//         topK: 40
//     },
//     systemInstruction: SYSTEM_PROMPT
// });

// // Add retry logic for AI operations
// async function withRetry (operation, maxRetries = 3, delay = 1000) {
//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//             return await operation();
//         } catch (error) {
//             if (attempt === maxRetries) throw error;
//             if (error.message.includes('503') || error.message.includes('overloaded')) {
//                 await new Promise(resolve => setTimeout(resolve, delay * attempt));
//                 continue;
//             }
//             throw error;
//         }
//     }
// }

// // Generate embeddings for text
// async function generateEmbedding (text) {
//     return withRetry(async () => {
//         try {
//             const result = await embeddingModel.embedContent(text);
//             const embedding = result.embedding.values;

//             if (!embedding || embedding.length === 0) {
//                 throw new Error("Empty embedding generated");
//             }

//             return embedding;
//         } catch (error) {
//             console.error("Embedding generation failed:", error);
//             throw error;
//         }
//     });
// }

// // Save new content with embeddings
// async function saveContent (title, content, userId, type = 'note') {
//     try {
//         // Generate embedding for the content
//         const embedding = await generateEmbedding(`${title} ${content}`);

//         // Save to MongoDB
//         const newObject = await Object.create({
//             title,
//             content,
//             type,
//             user: userId,
//             createdAt: new Date()
//         });

//         // Save to Pinecone
//         await pineconeIndex.upsert([{
//             id: newObject._id.toString(),
//             values: embedding,
//             metadata: {
//                 title,
//                 content,
//                 type,
//                 userId: userId.toString(),
//                 createdAt: new Date().toISOString()
//             }
//         }]);

//         return newObject;
//     } catch (error) {
//         console.error("Failed to save content:", error);
//         throw error;
//     }
// }

// // Search and retrieve relevant content
// async function searchContent (query, userId, options = { limit: 5 }) {
//     try {
//         const queryEmbedding = await generateEmbedding(query);

//         const searchResults = await pineconeIndex.query({
//             vector: queryEmbedding,
//             topK: options.limit,
//             filter: {
//                 userId: userId.toString()
//             },
//             includeMetadata: true
//         });

//         return searchResults.matches.map(match => ({
//             ...match.metadata,
//             score: match.score
//         }));
//     } catch (error) {
//         console.error("Search failed:", error);
//         throw error;
//     }
// }

// // Format content for AI response
// function formatContextForAI (relevantContent) {
//     return relevantContent.map(item => {
//         return `CONTENT(type=${item.type}, relevance=${item.score.toFixed(2)}):
// Title: ${item.title}
// Content: ${item.content}
// ---`;
//     }).join('\n');
// }

// // Generate AI response with fallback
// async function generateAIResponse (prompt, hasContext = true) {
//     return withRetry(async () => {
//         try {
//             if (!hasContext) {
//                 const introPrompt = `The user has asked: "${prompt}"
//                 Please respond according to your introduction protocol, explaining your capabilities as March Assistant
//                 and how you can help them manage their information. Be engaging but concise.`;

//                 const result = await chatModel.generateContent(introPrompt);
//                 return result.response.text();
//             }

//             const result = await chatModel.generateContent(prompt);
//             return result.response.text();
//         } catch (error) {
//             if (error.message.includes('503') || error.message.includes('overloaded')) {
//                 if (!hasContext) {
//                     return `Hi! I'm March Assistant, your personal knowledge manager. I can help you store and retrieve information, manage tasks, and answer questions based on your stored content. Would you like to start by saving some information or learning more about how I can help?`;
//                 }

//                 const relevantPieces = prompt.split('Question:')[0]
//                     .split('CONTENT')
//                     .filter(piece => piece.includes('relevance'))
//                     .sort((a, b) => {
//                         const scoreA = parseFloat(a.match(/relevance=(\d+\.\d+)/)?.[1] || 0);
//                         const scoreB = parseFloat(b.match(/relevance=(\d+\.\d+)/)?.[1] || 0);
//                         return scoreB - scoreA;
//                     });

//                 if (relevantPieces.length > 0) {
//                     return `Based on the most relevant stored information: ${relevantPieces[0].split('Content:')[1].split('---')[0].trim()}`;
//                 }
//             }
//             throw error;
//         }
//     });
// }

// // API Routes
// router.post("/content", async (req, res) => {
//     try {
//         const { title, content, type } = req.body;
//         const userId = req.user._id;

//         const savedContent = await saveContent(title, content, userId, type);
//         res.json(savedContent);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.get("/ask", async (req, res) => {
//     try {
//         const { query } = req.query;
//         const userId = req.user._id;

//         if (!query?.trim()) {
//             return res.status(400).json({ error: "Query is required" });
//         }

//         // Search for relevant content
//         const relevantContent = await searchContent(query, userId, { limit: 5 });

//         let answer;
//         if (relevantContent.length === 0) {
//             // Generate response without context
//             answer = await generateAIResponse(query, false);

//             return res.json({
//                 answer,
//                 suggestion: "Try saving some information first using the /content endpoint",
//                 hasStoredContent: false
//             });
//         }

//         // Format context for AI
//         const context = formatContextForAI(relevantContent);

//         // Generate AI response with context
//         const prompt = `Based on the following information from the user's stored content:

// ${context}

// Question: "${query}"

// Please provide a helpful response that directly answers the question using the available information.`;

//         answer = await generateAIResponse(prompt, true);

//         res.json({
//             answer,
//             hasStoredContent: true,
//             relevantContent: relevantContent.map(({ title, type, score }) => ({
//                 title,
//                 type,
//                 relevance: score
//             }))
//         });
//     } catch (error) {
//         console.error("Error processing question:", error);
//         res.status(500).json({
//             error: "An error occurred while processing your request. Please try again later.",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// });

// export default router;

// new one
import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Object } from "../../models/lib/object.model.js";
import NodeCache from "node-cache";

const router = Router();

// Configuration constants
const TIMEOUT_MS = 5000;
const CACHE_TTL = 3600; // 1 hour
const MAX_RETRIES = 3;

// Initialize caching
const cache = new NodeCache({
    stdTTL: CACHE_TTL,
    checkperiod: 120 // Check for expired entries every 2 minutes
});

// Initialize Pinecone with correct configuration
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    maxRetries: MAX_RETRIES,
    additionalHeaders: {
        'request-timeout': TIMEOUT_MS.toString()
    }
});

const pineconeIndex = pinecone.index("my-ai-index");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// System prompt for the AI
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

// Initialize AI models
const embeddingModel = genAI.getGenerativeModel({
    model: "embedding-001",
    generationConfig: {
        maxOutputTokens: 2048
    }
});

const chatModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048
    },
    systemInstruction: SYSTEM_PROMPT
});

// Retry logic for AI operations
async function withRetry (operation, maxRetries = MAX_RETRIES, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Operation timeout')), TIMEOUT_MS);
            });

            return await Promise.race([operation(), timeoutPromise]);
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

// Generate embeddings with caching
async function generateEmbedding (text) {
    const cacheKey = `emb_${Buffer.from(text).toString('base64')}`;
    const cachedEmbedding = cache.get(cacheKey);

    if (cachedEmbedding) {
        return cachedEmbedding;
    }

    try {
        const result = await withRetry(async () => {
            const embedResult = await embeddingModel.embedContent(text);
            const embedding = embedResult.embedding.values;

            if (!embedding || embedding.length === 0) {
                throw new Error("Empty embedding generated");
            }

            return embedding;
        });

        cache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Embedding generation failed:", error);
        throw error;
    }
}

// Save content with proper error handling
async function saveContent (title, content, userId, type = 'note') {
    try {
        const [embedding, newObject] = await Promise.all([
            generateEmbedding(`${title} ${content}`),
            Object.create({
                title,
                content,
                type,
                user: userId,
                createdAt: new Date()
            })
        ]);

        await withRetry(async () => {
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
        });

        return newObject;
    } catch (error) {
        console.error("Failed to save content:", error);
        throw error;
    }
}

// Search content with optimizations
async function searchContent (query, userId, options = { limit: 5 }) {
    try {
        const queryEmbedding = await generateEmbedding(query);

        const searchResults = await withRetry(async () => {
            return await pineconeIndex.query({
                vector: queryEmbedding,
                topK: options.limit,
                filter: {
                    userId: userId.toString()
                },
                includeMetadata: true
            });
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

// Format content for AI
function formatContextForAI (relevantContent) {
    return relevantContent.map(item => {
        return `CONTENT(type=${item.type}, relevance=${item.score.toFixed(2)}):
Title: ${item.title}
Content: ${item.content}
---`;
    }).join('\n');
}

// Stream AI response
async function * streamAIResponse (prompt, hasContext = true) {
    try {
        if (!hasContext) {
            const introPrompt = `The user has asked: "${prompt}"
            Please respond according to your introduction protocol as March Assistant.`;

            const result = await chatModel.generateContentStream(introPrompt);
            for await (const chunk of result.stream) {
                yield chunk.text();
            }
            return;
        }

        const result = await chatModel.generateContentStream(prompt);
        for await (const chunk of result.stream) {
            yield chunk.text();
        }
    } catch (error) {
        if (error.message.includes('503') || error.message.includes('overloaded')) {
            yield "I apologize, but I'm experiencing high load right now. Please try again in a moment.";
        }
        throw error;
    }
}

// API Routes
router.post("/content", async (req, res) => {
    try {
        const { title, content, type } = req.body;
        const userId = req.user._id;

        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const savedContent = await saveContent(title, content, userId, type);
        res.json(savedContent);
    } catch (error) {
        console.error("Error saving content:", error);
        res.status(500).json({
            error: "Failed to save content",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get("/ask", async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user._id;

        if (!query?.trim()) {
            return res.status(400).json({ error: "Query is required" });
        }

        // Set up streaming headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Search for relevant content
        const relevantContent = await searchContent(query, userId, { limit: 5 });

        if (relevantContent.length === 0) {
            // Stream introduction response
            const stream = streamAIResponse(query, false);
            for await (const chunk of stream) {
                res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
            }
            res.write(`data: ${JSON.stringify({
                done: true,
                hasStoredContent: false,
                suggestion: "Try saving some information first using the /content endpoint"
            })}\n\n`);
            res.end();
            return;
        }

        // Format context and stream response
        const context = formatContextForAI(relevantContent);
        const prompt = `Based on the following information:\n${context}\nQuestion: "${query}"\nPlease provide a helpful response.`;

        const stream = streamAIResponse(prompt, true);
        for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify({
                chunk
                // relevantContent: relevantContent.map(({ title, type, score }) => ({
                //     title,
                //     type,
                //     relevance: score
                // }))
            })}\n\n`);
        }

        res.write(`data: ${JSON.stringify({ done: true, hasStoredContent: true })}\n\n`);
        res.end();
    } catch (error) {
        console.error("Error processing question:", error);
        res.write(`data: ${JSON.stringify({
            error: "An error occurred while processing your request",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        })}\n\n`);
        res.end();
    }
});

export default router;





// testing

// import { Router } from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { Object } from "../../models/lib/object.model.js";
// import NodeCache from "node-cache";

// const router = Router();

// // Configuration constants
// const TIMEOUT_MS = 5000;
// const CACHE_TTL = 3600; // 1 hour
// const MAX_RETRIES = 3;

// // Initialize caching
// const cache = new NodeCache({
//     stdTTL: CACHE_TTL,
//     checkperiod: 120
// });

// // Initialize Pinecone
// const pinecone = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY,
//     maxRetries: MAX_RETRIES
// });

// const pineconeIndex = pinecone.index("my-ai-index");
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// // System prompt definition
// const systemPrompt = `You are March Assistant, an AI helper that manages and retrieves information from personal todos and notes. Your responses should be concise and directly address user queries.

// When provided with context (todos/notes), each with a normalized relevance score (1-100):
// - Focus on the most relevant items (higher scores)
// - Prioritize recent or upcoming items for todos
// - Consider status, due dates, and completion state
// - Format responses using markdown for clarity

// For todos:
// - Highlight status and due dates
// - Group by completion state when relevant
// - Include labels and arrays if specified

// For notes:
// - Focus on the most relevant content
// - Include titles and key points
// - Link related items when available

// If no context is provided:
// - Introduce yourself as March Assistant
// - Explain that you can help manage todos and notes
// - Mention you can search and summarize saved content

// Keep responses focused and concise. For "tell me about X" queries, summarize key points. For specific questions, provide direct answers.

// Use markdown formatting (bold, italics, lists) to highlight important information.

// Provide reasoning in <justification> tags only when confidence scores vary significantly.`;

// // Initialize AI models
// const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
// const chatModel = genAI.getGenerativeModel({
//     model: "gemini-1.5-pro",
//     generationConfig: {
//         temperature: 0.7,
//         topK: 40,
//         maxOutputTokens: 2048
//     }
// });

// const template = ({ contexts, question }) => {
//     const contextParts = contexts
//         .map(({ context, normalizedScore }) => {
//             // Safely handle context being undefined
//             const safeContext = context || {};
//             return `
// <context>
// Type: ${safeContext.type || 'Unknown'}
// Title: ${safeContext.title || 'No Title'}
// Status: ${safeContext.status || 'Not Set'}
// Due Date: ${safeContext.dueDate || 'Not set'}
// Description: ${safeContext.description || 'No Description'}
// Completed: ${safeContext.isCompleted ?? 'Unknown'}
// Labels: ${safeContext.labels?.join(', ') || 'None'}
// </context>
// <context_score>${normalizedScore}</context_score>`;
//         }).join('\n');

//     return `
// Question for March Assistant:
// ${contextParts}

// <question>
// ${question}
// </question>`.trim();
// };

// // Retry wrapper
// async function withRetry(operation, maxRetries = MAX_RETRIES) {
//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//             return await Promise.race([
//                 operation(),
//                 new Promise((_, reject) => 
//                     setTimeout(() => reject(new Error('Operation timeout')), TIMEOUT_MS)
//                 )
//             ]);
//         } catch (error) {
//             if (attempt === maxRetries) throw error;
//             await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
//         }
//     }
// }

// // Generate embeddings with caching
// async function generateEmbedding(text) {
//     const cacheKey = `emb_${Buffer.from(text).toString('base64')}`;
//     const cached = cache.get(cacheKey);
//     if (cached) return cached;

//     const result = await withRetry(async () => {
//         const embedResult = await embeddingModel.embedContent(text);
//         return embedResult.embedding.values;
//     });

//     cache.set(cacheKey, result);
//     return result;
// }

// // Search content with vector similarity
// async function searchContent (query, userId, options = { limit: 5 }) {
//     const queryEmbedding = await generateEmbedding(query);

//     const searchResults = await withRetry(async () => {
//         return await pineconeIndex.query({
//             vector: queryEmbedding,
//             topK: options.limit,
//             filter: { userId: userId.toString() },
//             includeMetadata: true
//         });
//     });

//     // Normalize scores
//     const scores = searchResults.matches.map(m => m.score);
//     const minScore = Math.min(...scores);
//     const maxScore = Math.max(...scores);

//     return searchResults.matches.map(match => ({
//         ...match.metadata,
//         normalizedScore: maxScore === minScore ? 50 :
//             1 + ((match.score - minScore) / (maxScore - minScore)) * 98
//     }));
// }

// async function streamResponse (prompt) {
//     const result = await chatModel.generateContentStream({
//         contents: [{
//             role: "user",
//             parts: [{ text: prompt }]
//         }]
//     });

//     return {
//         async * toTextStreamResponse () {
//             for await (const chunk of result.stream) {
//                 yield chunk.text; // Changed from chunk.text() to chunk.text
//             }
//         }
//     };
// }

// Main chat endpoint
// router.post("/chat", async (req, res) => {
//     try {
//         const { query } = req.query;
//         const userId = req.user._id;

//         if (!query?.trim()) {
//             return res.status(400).json({ error: "Query is required" });
//         }

//         // Set streaming headers
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');

//         // Search for relevant content
//         const relevantContent = await searchContent(query, userId);

//         if (relevantContent.length === 0) {
//             // Stream introduction if no content found
//             const introPrompt = `The user has asked: "${query}"
// Please introduce yourself as March Assistant and explain how you can help.`;

//             const response = await streamResponse(introPrompt);
//             const stream = response.toTextStreamResponse();

//             for await (const chunk of stream) {
//                 res.write(`data: ${JSON.stringify({ chunk: chunk.text() })}\n\n`);
//             }

//             res.end();
//             return;
//         }

//         // Format context and generate response
//         const prompt = template({
//             contexts: relevantContent,
//             question: query
//         });

//         const response = await streamResponse(prompt);
//         const stream = response.toTextStreamResponse();

//         // Update the chat endpoint response handling:
//         for await (const chunk of stream) {
//             res.write(`data: ${JSON.stringify({
//                 chunk, // Changed from chunk.text()
//                 contexts: relevantContent.map(({ title, type, normalizedScore }) => ({
//                     title,
//                     type,
//                     relevance: normalizedScore
//                 }))
//             })}\n\n`);
//         }

//         res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
//         res.end();
//     } catch (error) {
//         console.error("Chat error:", error);
//         res.write(`data: ${JSON.stringify({
//             error: "An error occurred",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         })}\n\n`);
//         res.end();
//     }
// });

// router.post("/chat", async (req, res) => {
//     try {
//         const { query } = req.query;
//         const userId = req.user._id;

//         console.log("Chat Request Details:", {
//             query,
//             userId: userId.toString(),
//             timestamp: new Date().toISOString()
//         });

//         if (!query?.trim()) {
//             return res.status(400).json({ error: "Query is required" });
//         }

//         // Set streaming headers
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');

//         // Search for relevant content
//         const relevantContent = await searchContent(query, userId);

//         console.log("Relevant Content Found:", {
//             contentCount: relevantContent.length,
//             contentDetails: relevantContent.map(c => ({
//                 title: c.title,
//                 type: c.type,
//                 score: c.normalizedScore
//             }))
//         });

//         // Prepare the full prompt with system context
//         const fullPrompt = `${systemPrompt}

// ${relevantContent.length > 0 
//     ? template({ contexts: relevantContent, question: query }) 
//     : `User query: ${query}`
// }`;

//         console.log("Full Prompt Generated:", {
//             promptLength: fullPrompt.length,
//             containsContexts: relevantContent.length > 0
//         });

//         // Generate response with system prompt and user query
//         const chatResponse = await chatModel.generateContentStream({
//             contents: [
//                 { role: "user", parts: [{ text: fullPrompt }] }
//             ]
//         });

//         // Stream the response
//         let fullResponse = '';
//         for await (const response of chatResponse.stream) {
//             const chunk = response.text;
//             if (chunk) {
//                 fullResponse += chunk;
//                 res.write(`data: ${JSON.stringify({ 
//                     chunk,
//                     contexts: relevantContent.map(({ title, type, normalizedScore }) => ({
//                         title,
//                         type,
//                         relevance: normalizedScore
//                     }))
//                 })}\n\n`);
//             }
//         }

//         console.log("Response Streaming Complete:", {
//             totalResponseLength: fullResponse.length
//         });

//         res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
//         res.end();

//     } catch (error) {
//         console.error("Detailed Chat Error:", {
//             errorMessage: error.message,
//             errorStack: error.stack,
//             timestamp: new Date().toISOString()
//         });

//         res.status(500).write(`data: ${JSON.stringify({
//             error: "An error occurred",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         })}\n\n`);
//         res.end();
//     }
// });

// router.post("/chat", async (req, res) => {
//     console.log("Chat Request Received:")
//     try {
//         const { query } = req.query;
//         const userId = req.user._id;

//         if (!query?.trim()) {
//             return res.status(400).json({ error: "Query is required" });
//         }

//         // Set streaming headers
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');

//         // Special handling for introduction queries
//         const introQueries = ['who are you', 'introduce yourself', 'what can you do'];
//         const isIntroQuery = introQueries.some(q => 
//             query.toLowerCase().includes(q)
//         );

//         if (isIntroQuery) {
//             const introResponse = `Hi there! I'm March Assistant, your personal AI helper for managing todos and notes. 

// **Key Capabilities:**
// - Retrieve and summarize your personal todos and notes
// - Search through your content with natural language queries
// - Provide context-aware assistance based on your existing items
// - Help you organize and understand your personal information

// I can help you by:
// - Finding specific todos or notes
// - Summarizing your tasks and notes
// - Answering questions about your personal content
// - Providing insights into your todos and notes

// Feel free to ask me anything about your todos, notes, or how I can assist you!`;

//             // Stream the introduction
//             for (const chunk of introResponse.split(' ')) {
//                 res.write(`data: ${JSON.stringify({ chunk: chunk + ' ' })}\n\n`);
//             }

//             res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
//             res.end();
//             return;
//         }

//         // Rest of the existing code remains the same...
//         // (Previous search and response generation logic)

//     } catch (error) {
//         console.error("Chat Error:", error);
//         res.status(500).write(`data: ${JSON.stringify({
//             error: "An error occurred",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         })}\n\n`);
//         res.end();
//     }
// });

// Function to clean metadata before saving
// function cleanMetadata (object) {
//     return {
//         title: object.title || "",
//         description: object.description || "",
//         type: object.type || "",
//         status: object.status || "",
//         dueDate: object.dueDate ?? "", // Convert null to an empty string
//         isCompleted: object.isCompleted ?? false, // Convert null to false
//         userId: object.user.toString()
//     };
// }

// Save content to vector store
// async function saveContent (object) {
//     const embedding = await generateEmbedding(
//         `${object.title} ${object.description} ${object.type}`
//     );

//     const metadata = cleanMetadata(object); // Ensure no null values

//     await withRetry(async () => {
//         await pineconeIndex.upsert([{
//             id: object._id.toString(),
//             values: embedding,
//             metadata: metadata
//         }]);
//     });
// }

// // Sync endpoint to update vector store
// router.post("/sync", async (req, res) => {
//     console.log("Syncing content...");
//     try {
//         const userId = req.user._id;
//         const objects = await Object.find({ 
//             user: userId,
//             isDeleted: false 
//         });

//         console.log("Objects to sync:", objects.length);

//         await Promise.all(objects.map(saveContent));

//         res.json({ message: "Sync completed", count: objects.length });
//     } catch (error) {
//         console.error("Sync error:", error);
//         res.status(500).json({ 
//             error: "Failed to sync content",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// });

// export default router;
