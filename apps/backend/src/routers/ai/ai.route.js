import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Object } from "../../models/lib/object.model.js";
import { SYSTEM_PROMPT } from "../../prompts/system.prompt.js";
import { saveContent, searchContent } from "../../utils/helper.service.js";
import { QueryUnderstanding } from "../../utils/query.service.js";

const router = Router();

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Configure chat model with specific parameters
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
const queryUnderstanding = new QueryUnderstanding(chatModel);

async function createObjectFromAI (content, userId) {
    try {
        if (!content?.title || !userId) {
            throw new Error("Invalid content or userId");
        }

        const object = await Object.create({ ...content });

        await saveContent(object);
        return object;
    } catch (error) {
        console.error("Error creating object from AI:", error);
        throw error;
    }
}

// router.get("/ask", async (req, res) => {
//     try {
//         const { query } = req.query;
//         const userId = req.user._id;

//         if (!query?.trim()) {
//             return res.status(400).json({ error: "Query is required" });
//         }

//         // Set SSE headers only once at the beginning
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');

//         // Prevent multiple responses by tracking if we've ended the response
//         let hasEnded = false;
//         // Handle client disconnect
//         req.on('close', () => {
//             hasEnded = true;
//         });

//         const relevantContent = await searchContent(query, userId, { limit: 5 });

//         if (hasEnded) return;

//         const sendChunk = (data) => {
//             if (!hasEnded) {
//                 res.write(`data: ${JSON.stringify(data)}\n\n`);
//             }
//         };

//         if (relevantContent.length === 0) {
//             const stream = streamAIResponse(query, false, userId);
//             try {
//                 for await (const chunk of stream) {
//                     if (hasEnded) break;
//                     sendChunk({ chunk });
//                 }

//                 if (!hasEnded) {
//                     sendChunk({
//                         done: true,
//                         hasStoredContent: false,
//                         suggestion: "Try saving some information or creating new tasks to get started"
//                     });
//                 }
//             } catch (streamError) {
//                 console.error("Stream error:", streamError);
//                 if (!hasEnded) {
//                     sendChunk({ error: "Stream processing error" });
//                 }
//             }
//         } else {
//             const context = formatContextForAI(relevantContent);
//             const prompt = `Based on the following information:\n${context}\nQuestion: "${query}"\nPlease provide a helpful response.`;

//             const stream = streamAIResponse(prompt, true, userId);
//             try {
//                 for await (const chunk of stream) {
//                     if (hasEnded) break;
//                     sendChunk({ chunk });
//                 }

//                 if (!hasEnded) {
//                     sendChunk({
//                         done: true,
//                         hasStoredContent: true,
//                         relevantContent: relevantContent.map(({ title, type, score }) => ({
//                             title,
//                             type,
//                             relevance: score
//                         }))
//                     });
//                 }
//             } catch (streamError) {
//                 console.error("Stream error:", streamError);
//                 if (!hasEnded) {
//                     sendChunk({ error: "Stream processing error" });
//                 }
//             }
//         }

//         if (!hasEnded) {
//             res.end();
//         }
//     } catch (error) {
//         console.error("Error in /ask route:", error);
//         if (!res.headersSent) {
//             res.setHeader('Content-Type', 'text/event-stream');
//         }
//         res.write(`data: ${JSON.stringify({
//             error: "An error occurred while processing your request",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         })}\n\n`);
//         res.end();
//     }
// });

// router.get("/ask", async (req, res) => {
//     try {
//         const { query } = req.query;
//         const userId = req.user._id;

//         res.setHeader("Content-Type", "application/json");
//         res.setHeader("Transfer-Encoding", "chunked");
//         res.write(JSON.stringify({ status: "processing", message: "Analyzing query..." }) + "\n");

//         // Analyze the query first
//         const queryAnalysis = await queryUnderstanding.analyzeQuery(query, userId);

//         // Handle the response based on the analysis
//         console.log("queryAnalysis: ", queryAnalysis);
//         switch (queryAnalysis.type) {
//         case 'creation':
//             // Handle object creation
//             const createdObject = await createObjectFromAI(queryAnalysis.data, userId);
//             // Stream response...
//             console.log("Created Object:", createdObject);
//             break;

//         case 'search':
//             console.log("serching content");
//             // Handle search with the provided parameters
//             const relevantContent = await searchContent(query, userId, queryAnalysis.parameters);
//             // Stream response...
//             console.log("Relevant Content:", relevantContent);
//             break;

//         case 'conversation':
//             // Stream clarification response with suggestions
//             console.log("clhm", queryAnalysis.response);
//             streamAIResponse(queryAnalysis.response, false, userId);
//             break;
//         }
//         // ... rest of your existing code
//     } catch (error) {
//         // ... error handling
//     }
// });

router.get("/ask", async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user._id;

        // Set response headers for streaming
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Transfer-Encoding", "chunked");

        // Analyze the query
        const queryAnalysis = await queryUnderstanding.analyzeQuery(query, userId);

        // Stream response based on the analysis type
        console.log("Query Analysis:", queryAnalysis);
        switch (queryAnalysis.type) {
        case 'creation':
            // res.write(JSON.stringify({ status: "processing", message: "Creating object..." }) + "\n");
            const createdObject = await createObjectFromAI(queryAnalysis.data, userId);
            res.write(JSON.stringify({ status: "completed", data: createdObject }) + "\n");
            break;

        case 'search':
            // res.write(JSON.stringify({ status: "processing", message: "Fetching relevant content..." }) + "\n");
            const relevantContent = await searchContent(query, userId, queryAnalysis.parameters);
            res.write(JSON.stringify({ status: "search", data: relevantContent }) + "\n");
            break;

        case 'conversation':
            res.write(JSON.stringify({ status: "conversation", data: queryAnalysis.response }) + "\n");
            break;
        }

        // End the streaming response
        res.end();
    } catch (error) {
        res.write(JSON.stringify({ status: "error", message: error.message }) + "\n");
        res.end();
    }
});

async function * streamAIResponse (prompt, hasContext = true, userId) {
    try {
        console.log("Prompt: ", prompt);
        const finalPrompt = hasContext
            ? prompt
            : `The user has asked: "${prompt}"\nPlease respond as March`;

        const result = await chatModel.generateContentStream(finalPrompt);
        for await (const chunk of result.stream) {
            yield chunk.text();
        }
    } catch (error) {
        if (error.message.includes('503') || error.message.includes('overloaded')) {
            yield "I'm experiencing high load right now. Please try again in a moment.";
            return;
        }
        throw error;
    }
}

router.post("/content", async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).json({ error: "Content is required" });
        }
        const object = await Object.create({ user: req.user._id, ...data });
        const savedContent = await saveContent(object);
        res.status(201).json({ message: "Content saved successfully", savedContent, object });
    } catch (error) {
        console.error("Error saving content:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/sync", async (req, res) => {
    console.log("Syncing content...");
    try {
        const userId = req.user._id;
        const objects = await Object.find({
            user: userId,
            isDeleted: false
        });

        console.log("Objects to sync:", objects.length);

        await Promise.all(objects.map(saveContent));

        res.json({ message: "Sync completed", count: objects.length });
    } catch (error) {
        console.error("Sync error:", error);
        res.status(500).json({
            error: "Failed to sync content",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// async function * streamAIResponse (prompt, hasContext = true, userId) {
//     try {
//         if (isObjectCreationIntent(prompt)) {
//             console.log("Creating object from AI:", prompt);
//             const creationPrompt = `
//             Parse this request: "${prompt}"
//             Analyze the text for any date/time references including:
//             - Explicit dates (tomorrow, today, next week, next month)
//             - Time references (after school, this evening, tonight)
//             - Day references (on Monday, this Sunday)
//             - Relative dates (in 2 days, in a week)

//             Create a task with these details in JSON format:

//             {
//                 "title": "Clear, specific title",
//                 "description": "Detailed description of the task",
//                 "type": "todo",
//                 "status": "null",
//                 "dueDate": null // Format rules:
//                 // 1. For "today" -> current date in YYYY-MM-DD
//                 // 2. For "tomorrow" -> next day in YYYY-MM-DD
//                 // 3. For days of week -> next occurrence in YYYY-MM-DD
//                 // 4. For "after school" -> current date + default time 3:00 PM
//                 // 5. For relative dates -> calculated date in YYYY-MM-DD
//                 // 6. If no date mentioned -> null
//             }

//             Examples of date parsing:
//             Input: "buy milk after school" -> dueDate: "2024-02-06T15:00:00Z"
//             Input: "go to gym tomorrow" -> dueDate: "2024-02-07"
//             Input: "submit report next Monday" -> dueDate: "2024-02-12"
//             Input: "call mom in 3 days" -> dueDate: "2024-02-09"
//             Input: "do homework tonight" -> dueDate: "2024-02-06T19:00:00Z"
//             Input: "buy groceries" -> dueDate: null

//             Extract the task details and create a clear title and description. Set the dueDate based on the date/time references found in the text. Only respond with valid JSON, no other text.
//             `;

//             try {
//                 const result = await chatModel.generateContent(creationPrompt);
//                 const responseText = result.response.text();
//                 let objectData;
//                 try {
//                     objectData = JSON.parse(responseText.trim());
//                 } catch (parseError) {
//                     console.error("JSON Parse Error:", parseError);
//                     const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//                     if (jsonMatch) {
//                         objectData = JSON.parse(jsonMatch[0]);
//                     } else {
//                         throw parseError;
//                     }
//                 }

//                 // Create default object if parsing failed
//                 if (!objectData || !objectData.title) {
//                     objectData = {
//                         title: prompt.replace(/create\s+(a|an)\s+(task|note|todo)/i, '').trim(),
//                         description: "Task created from user request",
//                         type: "todo",
//                         status: "null"
//                     };
//                 }

//                 const createdObject = await createObjectFromAI({
//                     ...objectData,
//                     originalQuery: prompt
//                 }, userId);

//                 // Yield creation confirmation
//                 yield `✓ Created new task:\n\n`;
//                 yield `Title: ${createdObject.title}\n`;
//                 yield `Description: ${createdObject.description}\n`;
//                 if (createdObject.dueDate) {
//                     yield `Due Date: ${new Date(createdObject.dueDate).toLocaleDateString()}\n`;
//                 }
//                 yield `\nTask saved successfully. I can help you find or update it later.`;
//                 return;
//             } catch (error) {
//                 console.error("Error in object creation:", error);
//                 yield "I understood you wanted to create a task, but encountered an issue. Please try again with more details.";
//                 return;
//             }
//         }

//         const finalPrompt = hasContext
//             ? prompt
//             : `The user has asked: "${prompt}"\nPlease respond as March`;

//         const result = await chatModel.generateContentStream(finalPrompt);
//         for await (const chunk of result.stream) {
//             yield chunk.text();
//         }
//     } catch (error) {
//         if (error.message.includes('503') || error.message.includes('overloaded')) {
//             yield "I'm experiencing high load right now. Please try again in a moment.";
//             return;
//         }
//         throw error;
//     }
// }

// router.get("/ask", async (req, res) => {
//     try {
//         const { query } = req.query;
//         const userId = req.user._id;

//         if (!query?.trim()) {
//             return res.status(400).json({ error: "Query is required" });
//         }
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');

//         const relevantContent = await searchContent(query, userId, { limit: 5 });
//         console.log("Relevant Content Found:", relevantContent);

//         if (relevantContent.length === 0) {
//             const stream = streamAIResponse(query, false, userId);
//             for await (const chunk of stream) {
//                 console.log("hey saju: ", chunk);
//                 res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
//             }
//             res.write(`data: ${JSON.stringify({
//                 done: true,
//                 hasStoredContent: false,
//                 suggestion: "Try saving some information or creating new tasks to get started"
//             })}\n\n`);
//             return res.end();
//         }

//         const context = formatContextForAI(relevantContent);
//         const prompt = `Based on the following information:\n${context}\nQuestion: "${query}"\nPlease provide a helpful response.`;

//         const stream = streamAIResponse(prompt, true, userId);
//         console.log("stream in line number 1473, ", stream);
//         for await (const chunk of stream) {
//             res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
//         }

//         res.write(`data: ${JSON.stringify({
//             done: true,
//             hasStoredContent: true,
//             relevantContent: relevantContent.map(({ title, type, score }) => ({
//                 title,
//                 type,
//                 relevance: score
//             }))
//         })}\n\n`);

//         return res.end();
//     } catch (error) {
//         console.error("Error in /ask route:", error);
//         res.write(`data: ${JSON.stringify({
//             error: "An error occurred while processing your request",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         })}\n\n`);
//         return res.end();
//     }
// });

export default router;
