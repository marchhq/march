import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Model for converting text to vectors
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

export const readTemplateFile = async (name, data) => {
    const content = fs
        .readFileSync(path.resolve("src", "templates", `${name}.hbs`))
        .toString("utf8");
    const template = handlebars.compile(content, {
        noEscape: true
    });
    return template(data);
};

// metadata extraction for vector storage
export const extractMetadata = (object) => {
    return {
        objectId: object._id?.toString() || "",
        title: object.title || "",
        description: object.description || "",
        type: object.type || "",
        source: object.source || "",
        status: object.status || "",
        isCompleted: Boolean(object.isCompleted),
        isArchived: Boolean(object.isArchived),
        isFavorite: Boolean(object.isFavorite),
        completedAt: object.completedAt ? new Date(object.completedAt).toISOString() : "",
        dueDate: object.dueDate ? new Date(object.dueDate).toISOString() : "",
        createdAt: object.createdAt ? new Date(object.createdAt).toISOString() : "",
        updatedAt: object.updatedAt ? new Date(object.updatedAt).toISOString() : "",
        cycleStart: object.cycle?.startsAt ? new Date(object.cycle.startsAt).toISOString() : "",
        cycleEnd: object.cycle?.endsAt ? new Date(object.cycle.endsAt).toISOString() : "",
        userId: object.user ? object.user.toString() : "",
        parentId: object.parent ? object.parent.toString() : "",
        labelIds: Array.isArray(object.labels) ? object.labels.map(id => id.toString()) : [],
        arrayIds: Array.isArray(object.arrays) ? object.arrays.map(id => id.toString()) : []
    };
};

// Retry failed operations with exponential backoff
export const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (attempt === maxRetries) break;

            const shouldRetry = error.message.includes('503') ||
                              error.message.includes('overloaded') ||
                              error.message.includes('timeout');

            if (!shouldRetry) throw error;

            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
        }
    }
    throw lastError;
}

// Convert text to vector representation for semantic search
export const generateEmbedding = async (text) => {
    return withRetry(async () => {
        try {
            const result = await embeddingModel.embedContent(text);
            const embedding = result.embedding.values;

            if (!embedding?.length) {
                throw new Error("Invalid embedding generated");
            }

            return embedding;
        } catch (error) {
            console.error("Embedding generation failed:", error);
            throw error;
        }
    });
}

export const generateEnhancedEmbedding = async (text, context = {}) => {
    //  a rich contextual string by combining the text with relevant context
    const contextualText = [
        text,
        context.type && `type:${context.type}`,
        context.source && `platform:${context.source}`,
        context.status && `status:${context.status}`,
        context.dueDate && `due:${new Date(context.dueDate).toISOString()}`,
        context.priority && `priority:${context.priority}`,
        context.labels?.length && `labels:${context.labels.join(',')}`,
        context.isCompleted && 'state:completed',
        context.isArchived && 'state:archived',
        context.relatedTasks?.map(task => `related:${task}`).join(' ')
    ]
        .filter(Boolean)
        .join(' ');

    return await generateEmbedding(contextualText);
}
