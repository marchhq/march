import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Initialize services with API keys
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

export const pineconeIndex = pinecone.index("my-ai-index");

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

export const saveContent = async (object) => {
    if (!object?._id) {
        throw new Error("Invalid object: missing _id");
    }

    const context = {
        type: object.type,
        source: object.source,
        status: object.status,
        dueDate: object.dueDate,
        priority: object.metadata?.priority || 'medium',
        labels: object.labels?.map(label => label.toString()),
        isCompleted: object.isCompleted,
        completedAt: object.completedAt || 'null',
        isArchived: object.isArchived,
        relatedTasks: object.arrays?.map(id => id.toString())
    };

    const embedding = await generateEnhancedEmbedding(
        `${object.title} ${object.description}`,
        context
    );
    const enhancedMetadata = extractMetadata(object);

    // save to Pinecone with retry
    await withRetry(async () => {
        await pineconeIndex.upsert([{
            id: object._id.toString(),
            values: embedding,
            metadata: enhancedMetadata
        }]);
    });

    return object;
}

// need to improve
// Search for relevant content using vector similarity
// export async function searchContent (query, userId, options = { limit: 8 }) {
//     try {
//         const sourcePattern = /(linear|github|march)/i;
//         const match = query.match(sourcePattern);
//         const sourceFilter = match ? match[0].toLowerCase() : null;

//         const queryEmbedding = await generateEmbedding(query);

//         const filter = {
//             userId: userId.toString(),
//             ...(sourceFilter && { source: sourceFilter })
//         };

//         const searchResults = await pineconeIndex.query({
//             vector: queryEmbedding,
//             topK: options.limit,
//             filter: filter,
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

const SEARCH_PARAMS = {
    SORT_OPTIONS: {
        PRIORITY: 'priority',
        DUE_DATE: 'dueDate',
        CREATED: 'createdAt',
        UPDATED: 'updatedAt'
    },
    TIME_RANGES: {
        TODAY: 'today',
        YESTERDAY: 'yesterday',
        THIS_WEEK: 'this_week',
        LAST_WEEK: 'last_week',
        THIS_MONTH: 'this_month',
        OVERDUE: 'overdue'
    },
    PRIORITY_LEVELS: ['high', 'medium', 'low']
};

export class SearchHandler {
    constructor (pineconeIndex) {
        this.pineconeIndex = pineconeIndex;
    }

    async searchContent (query, userId, parameters) {
        const baseFilter = {
            userId: userId
        };

        // Apply source filters
        if (parameters.filters.source) {
            baseFilter.source = parameters.filters.source;
        }

        // Apply type filters
        if (parameters.filters.type) {
            baseFilter.type = parameters.filters.type;
        }

        // Apply status filters
        if (parameters.filters.status) {
            baseFilter.status = parameters.filters.status;
        }

        // Apply time-based filters
        if (parameters.filters.timeRange) {
            Object.assign(baseFilter, this.buildTimeFilter(parameters.filters.timeRange));
        }

        // Apply priority filter if specified
        if (parameters.filters.priority) {
            baseFilter.priority = parameters.filters.priority;
        }

        // Generate embedding for semantic search
        const queryEmbedding = await generateEnhancedEmbedding(query, {
            userId,
            ...parameters.filters
        });

        // Perform vector search with metadata filtering
        const searchResults = await this.pineconeIndex.query({
            vector: queryEmbedding,
            filter: baseFilter,
            topK: parameters.limit || 10,
            includeMetadata: true
        });

        // Post-process and sort results
        return this.processSearchResults(searchResults, parameters.sortBy);
    }

    buildTimeFilter (timeRange) {
        const now = new Date();
        const filter = {};

        switch (timeRange) {
        case SEARCH_PARAMS.TIME_RANGES.TODAY:
            filter.dueDate = {
                $gte: new Date(now.setHours(0, 0, 0, 0)).toISOString()
            };
            break;

        case SEARCH_PARAMS.TIME_RANGES.THIS_WEEK:
            // eslint-disable-next-line no-case-declarations
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            filter.dueDate = {
                $gte: weekStart.toISOString()
            };
            break;

        case SEARCH_PARAMS.TIME_RANGES.OVERDUE:
            filter.dueDate = {
                $lt: now.toISOString()
            };
            filter.isCompleted = false;
            break;
        }

        return filter;
    }

    processSearchResults (results, sortBy) {
        // eslint-disable-next-line prefer-const
        let processedResults = results.matches.map(match => ({
            ...match.metadata,
            score: match.score
        }));

        // Apply sorting
        switch (sortBy) {
        case SEARCH_PARAMS.SORT_OPTIONS.PRIORITY:
            processedResults.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
            break;

        case SEARCH_PARAMS.SORT_OPTIONS.DUE_DATE:
            processedResults.sort((a, b) =>
                new Date(a.dueDate) - new Date(b.dueDate)
            );
            break;

        default:
            // Default to relevance score
            processedResults.sort((a, b) => b.score - a.score);
        }

        return processedResults;
    }
}
