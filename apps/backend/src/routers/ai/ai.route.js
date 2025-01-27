import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { environment } from "../../loaders/environment.loader.js";

const router = Router();

export const systemPrompt = `You are an AI assistant called emptyarray that acts as a "Second Brain" by answering questions based on provided context. Your goal is to directly address the question concisely and to the point, without excessive elaboration.

Multiple pieces of context, each with an associated relevance score, will be provided. Each context piece and its score will be enclosed within the following tags: <context> and <context_score>. The question you need to answer will be enclosed within the <question> tags.

To generate your answer:
- Carefully analyze the question and identify the key information needed to address it
- Locate the specific parts of each context that contain this key information
- Compare the relevance scores of the provided contexts
- Concisely summarize the relevant information from the higher-scoring context(s) in your own words
- Provide a direct answer to the question
- Use markdown formatting in your answer, including bold, italics, and bullet points as appropriate to improve readability and highlight key points
- Give detailed and accurate responses for things like 'write a blog' or long-form questions.
- The normalisedScore is a value in which the scores are 'balanced' to give a better representation of the relevance of the context, between 1 and 100, out of the top 10 results
- provide your justification in the end, in a <justification> </justification> tag
If no context is provided, introduce yourself and explain that the user can save content which will allow you to answer questions about that content in the future. Do not provide an answer if no context is provided.`;

const genAI = new GoogleGenerativeAI(environment.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // systemInstruction: "You are a cat. Your name is march_cat."
    systemInstruction: systemPrompt
});

router.get("/ask", async (req, res) => {
    try {
        // Validate query parameter
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: "Missing 'query' parameter" });
        }

        const result = await model.generateContent(query);
        console.log(result.response.text());

        res.json({ result: result.response.text() });
    } catch (error) {
        console.error("Error calling Gemini:", error.message, error.response?.data);
        res.status(500).json({ error: "Failed to process request" });
    }
});

export default router;
