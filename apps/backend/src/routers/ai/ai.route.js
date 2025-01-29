// import { Router } from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { environment } from "../../loaders/environment.loader.js";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { Object } from "../../models/lib/object.model.js";

// const router = Router();

// const pinecone = new Pinecone({
//     apiKey: environment.PINECONE_API_KEY
// });

// export const pineconeIndex = pinecone.index("my-ai-index");

// const genAI = new GoogleGenerativeAI(environment.GOOGLE_AI_API_KEY);
// const embmodel = genAI.getGenerativeModel({ model: "embedding-001" });

// export async function generateEmbedding (text) {
//     try {
//         const result = await embmodel.embedContent(text);
//         return result.embedding.values; // Returns the embedding array
//     } catch (error) {
//         console.error("Embedding generation failed:", error.message);
//         return null;
//     }
// }

// export async function createObject (title, description, userId) {
//     // 1️⃣ Generate embedding from title + description
//     const embedding = await generateEmbedding(`${title} ${description}`);

//     // 2️⃣ Save metadata in MongoDB
//     const newObject = await Object.create({ title, description, user: userId });

//     // 3️⃣ Store embedding in Pinecone
//     await pineconeIndex.upsert([
//         {
//             id: newObject._id.toString(),
//             values: embedding,
//             metadata: { title, description, userId: userId.toString() }
//         }
//     ]);

//     return newObject;
// }

// export const systemPrompt = `You are an AI assistant called emptyarray that acts as a "Second Brain" by answering questions based on provided context. Your goal is to directly address the question concisely and to the point, without excessive elaboration.
// Multiple pieces of context, each with an associated relevance score, will be provided. Each context piece and its score will be enclosed within the following tags: <context> and <context_score>. The question you need to answer will be enclosed within the <question> tags.
// To generate your answer:
// - Carefully analyze the question and identify the key information needed to address it
// - Locate the specific parts of each context that contain this key information
// - Compare the relevance scores of the provided contexts
// - Concisely summarize the relevant information from the higher-scoring context(s) in your own words
// - Provide a direct answer to the question
// - Use markdown formatting in your answer, including bold, italics, and bullet points as appropriate to improve readability and highlight key points
// - Give detailed and accurate responses for things like 'write a blog' or long-form questions.
// - The normalisedScore is a value in which the scores are 'balanced' to give a better representation of the relevance of the context, between 1 and 100, out of the top 10 results
// - provide your justification in the end, in a <justification> </justification> tag
// If no context is provided, introduce yourself and explain that the user can save content which will allow you to answer questions about that content in the future. Do not provide an answer if no context is provided.`;

// // const genAI = new GoogleGenerativeAI(environment.GOOGLE_AI_API_KEY);
// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     // systemInstruction: "You are a cat. Your name is march_cat."
//     systemInstruction: systemPrompt
// });

// router.get("/ask", async (req, res) => {
//     try {
//         const query = req.query.query;
//         const user = req.user._id;
//         if (!query) {
//             return res.status(400).json({ error: "Missing 'query' parameter" });
//         }
//         const userData = await Object.find({ user });
//         // console.log("User data:", userData);
//         // 1️⃣ Generate embedding for user query
//         const queryEmbedding = await generateEmbedding(query);

//         // 2️⃣ Search Pinecone for similar items
//         const pineconeEmbedding = await generateEmbedding(userData.map(item => `${item.title} ${item.description}`).join(' '));
//         // Optionally, you can loop over `userData` and upsert it to Pinecone
//         await pineconeIndex.upsert(
//             userData.map(item => ({
//                 id: item._id.toString(),
//                 values: pineconeEmbedding,
//                 metadata: {
//                     title: item.title,
//                     description: item.description,
//                     userId: item.user.toString()
//                 }
//             }))
//         );
//         const pineconeResponse = await pineconeIndex.query({
//             vector: queryEmbedding,
//             topK: 5, // Get top 5 similar items
//             includeMetadata: true // Include title & description
//         });

//         const relevantData = pineconeResponse.matches.map(match => match.metadata);

//         // 3️⃣ Convert retrieved data into a format Gemini understands
//         const context = relevantData.map(item => `- ${item.title}: ${item.description}`).join("\n");
//         console.log('context Response:', context);

//         // 4️⃣ Ask Gemini with relevant data
//         const prompt = `
// You are an AI assistant with the following context:

// ${context}

// User question: "${query}"

// Based on the above context, please provide a concise answer to the user's question.
// `;
//         const result = await model.generateContent(prompt);
//         console.log('result Response:', result.response.text());
//         res.json({ result: result.response.text() });
//     } catch (error) {
//         console.error("Error:", error.message);
//         res.status(500).json({ error: "Failed to process request" });
//     }
// });

// export default router;

// // router.get("/ask", async (req, res) => {
// //     try {
// //         // Validate query parameter
// //         const query = req.query.query;
// //         if (!query) {
// //             return res.status(400).json({ error: "Missing 'query' parameter" });
// //         }

// //         const result = await model.generateContent(query);
// //         console.log(result.response.text());

// //         res.json({ result: result.response.text() });
// //     } catch (error) {
// //         console.error("Error calling Gemini:", error.message, error.response?.data);
// //         res.status(500).json({ error: "Failed to process request" });
// //     }
// // });
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
