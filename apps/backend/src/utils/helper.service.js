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
        this.cacheEnabled = true;
        this.cache = new Map();
        this.cacheTTL = 5 * 60 * 1000; // 5 minutes cache lifetime
    }

    /**
     * Search content based on query and parameters
     * @param {string} query - User query string
     * @param {string} userId - User ID for filtering
     * @param {Object} parameters - Search parameters from QueryUnderstanding
     * @returns {Promise<Array>} - Processed search results
     */
    async searchContent (query, userId, parameters) {
        // Check cache for identical searches
        const cacheKey = this.getCacheKey(query, userId, parameters);
        if (this.cacheEnabled && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Use filters directly from QueryUnderstanding without rebuilding them
        const rawFilter = { userId, ...parameters.filters };
        const filter = this.preprocessFilters(rawFilter);
        // const filter = { userId, ...parameters.filters };

        try {
            // Generate embedding for semantic search
            const queryEmbedding = await generateEnhancedEmbedding(query, {
                userId,
                ...parameters.filters
            });

            // Perform vector search with metadata filtering...
            const searchResults = await this.pineconeIndex.query({
                vector: queryEmbedding,
                filter,
                topK: parameters.limit || 10,
                includeMetadata: true
            });

            // Apply post-processing and sorting
            const processedResults = this.processSearchResults(
                searchResults,
                parameters.sortBy || SEARCH_PARAMS.SORT_OPTIONS.RELEVANCE
            );

            // Cache results
            if (this.cacheEnabled) {
                this.cache.set(cacheKey, processedResults);
                setTimeout(() => this.cache.delete(cacheKey), this.cacheTTL);
            }

            return processedResults;
        } catch (error) {
            console.error("Search error:", error);
            throw new Error(`Search failed: ${error.message}`);
        }
    }

    /**
     * Generate cache key for query caching
     */
    getCacheKey (query, userId, parameters) {
        const filterString = JSON.stringify(parameters.filters || {});
        const sortBy = parameters.sortBy || 'relevance';
        const limit = parameters.limit || 10;
        return `${userId}:${query.toLowerCase().trim()}:${filterString}:${sortBy}:${limit}`;
    }

    preprocessFilters (filters) {
        const processedFilters = JSON.parse(JSON.stringify(filters));

        // Process date fields in filters
        const processObject = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    processObject(obj[key]);
                } else if (
                // Check if value looks like a date string...
                    typeof obj[key] === 'string' &&
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj[key])
                ) {
                    obj[key] = new Date(obj[key]).getTime();
                }
            }
        };

        processObject(processedFilters);
        return processedFilters;
    }

    /**
     * Process and sort search results
     */
    processSearchResults (results, sortBy) {
        if (!results.matches || results.matches.length === 0) {
            return [];
        }

        // Extract metadata and scores
        const processedResults = results.matches.map(match => ({
            ...match.metadata,
            score: match.score,
            id: match.id
        }));

        // Apply sorting based on sortBy parameter
        switch (sortBy) {
        case SEARCH_PARAMS.SORT_OPTIONS.PRIORITY:
            return this.sortByPriority(processedResults);

        case SEARCH_PARAMS.SORT_OPTIONS.DUE_DATE:
            return this.sortByDueDate(processedResults);

        case SEARCH_PARAMS.SORT_OPTIONS.CREATED:
            return processedResults.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

        case SEARCH_PARAMS.SORT_OPTIONS.UPDATED:
            return processedResults.sort((a, b) =>
                new Date(b.updatedAt) - new Date(a.updatedAt)
            );

        case SEARCH_PARAMS.SORT_OPTIONS.RELEVANCE:
        default:
            // Default to relevance (vector similarity score)
            return processedResults.sort((a, b) => b.score - a.score);
        }
    }

    /**
     * Sort results by priority
     */
    sortByPriority (results) {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return results.sort((a, b) => {
            // First sort by priority
            const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
            if (priorityDiff !== 0) return priorityDiff;

            // Then by score as tiebreaker
            return b.score - a.score;
        });
    }

    /**
     * Sort results by due date
     */
    sortByDueDate (results) {
        return results.sort((a, b) => {
            // Handle items without due dates
            if (!a.dueDate && !b.dueDate) return b.score - a.score;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;

            // Sort by due date, earliest first
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }
}
