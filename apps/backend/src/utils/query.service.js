import { extractMetadata } from "../utils/helper.service.js"
const INTENTS = {
    SEARCH: 'search',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    LIST: 'list',
    QUERY: 'query'
};
// Entity types that can be extracted from queries
const ENTITY_TYPES = {
    SOURCE: 'source', // e.g., github, linear, notion
    TYPE: 'type', // e.g., todo, note, reminder
    STATUS: 'status', // e.g., completed, pending
    TIME_RANGE: 'time', // e.g., today, this week
    LABEL: 'label', // e.g., important, work
    PRIORITY: 'priority' // e.g., high, medium, low
};

export class QueryUnderstanding {
    constructor (chatModel) {
        this.chatModel = chatModel;
    }

    async analyzeQuery (query, userId) {
        console.log("Analyzing query:", query);
        try {
            const analysisPrompt = `
            Analyze this user query: "${query}"
            
            Return only a JSON object (no markdown, no code blocks) with this structure:
            {
              "intent": {
                "primary": "One of: search, create, update, delete, list, query",
                "confidence": "Number between 0-1",
                "action": "Specific action being requested"
              },
              "entities": {
                "source": ["detected sources like github, linear"],
                "type": ["detected types like todo, note"],
                "status": ["detected status"],
                "timeRange": ["detected time references"],
                "labels": ["detected labels"],
                "priority": "detected priority level"
              },
              "parameters": {
                "filters": {},
                "sortBy": "", 
                "limit": null 
              },
              "context": {
                "isTimeSpecific": boolean,
                "requiresSourceContext": boolean,
                "needsDisambiguation": boolean
              }
            }`;

            const result = await this.chatModel.generateContent(analysisPrompt);
            // console.log("Analysis result:", result.response.text());
            const responseText = result.response.text();

            // Clean the response text by removing markdown code blocks
            const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
            // console.log("Cleaned JSON:", cleanJson);

            try {
                const analysis = JSON.parse(cleanJson);
                // console.log("Parsed analysis:", analysis);
                return this.processAnalysis(analysis, query, userId);
            } catch (parseError) {
                // If still can't parse, try to extract JSON using regex
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const analysis = JSON.parse(jsonMatch[0]);
                    return this.processAnalysis(analysis, query, userId);
                }
                throw parseError;
            }
        } catch (error) {
            console.error("Error analyzing query:", error);
            throw error;
        }
    }

    async processAnalysis (analysis, originalQuery, userId) {
        const queryContext = {
            intent: analysis.intent,
            originalQuery,
            userId,
            timestamp: new Date()
        };
        console.log("Processing analysis:", queryContext);
        switch (analysis.intent.primary) {
        case INTENTS.CREATE:
            return this.handleCreationIntent(analysis, queryContext);

        case INTENTS.SEARCH:
        case INTENTS.LIST:
            return this.handleSearchIntent(analysis, queryContext);

        case INTENTS.UPDATE:
            return this.handleUpdateIntent(analysis, queryContext); // TODO: Implement update handler

        case INTENTS.QUERY:
            return this.handleGeneralQuery(analysis, queryContext);

        default:
            return {
                type: 'clarification_needed',
                message: "I'm not sure what you'd like to do. Could you please rephrase your request?",
                suggestedActions: this.getSuggestedActions(analysis)
            };
        }
    }

    async handleGeneralQuery (analysis, context) {
        const conversationPrompt = `
          Based on user query: "${context.originalQuery}"
          Provide a brief, direct response. Keep it short and natural.
          If the query is a greeting or simple acknowledgment, respond casually and briefly.
          If it's a question, provide a clear, concise answer.`;

        const result = await this.chatModel.generateContent(conversationPrompt);

        return {
            type: 'conversation',
            response: result.response.text(),
            metadata: {
                confidence: analysis.intent.confidence
            }
        };
    }

    async handleCreationIntent (analysis, context) {
        const creationPrompt = `
      Based on this analysis: ${JSON.stringify(analysis)}
      Create a structured object for: "${context.originalQuery}"
      
      Return a JSON object with these fields from the metadata:
      ${Object.keys(extractMetadata({})).join(', ')}
      
      Include any detected:
      - Time references
      - Source specifications
      - Labels or categories
      - Priority levels
      - Status indicators`;

        const result = await this.chatModel.generateContent(creationPrompt);
        const objectData = JSON.parse(result.response.text());

        return {
            type: 'creation',
            data: objectData,
            source: analysis.entities.source[0] || 'default',
            metadata: {
                confidence: analysis.intent.confidence,
                needsConfirmation: analysis.context.needsDisambiguation
            }
        };
    }

    async handleSearchIntent (analysis, context) {
        // Build search parameters based on entities and context
        const searchParams = {
            filters: {
                ...this.buildSourceFilters(analysis.entities.source),
                ...this.buildTypeFilters(analysis.entities.type),
                ...this.buildStatusFilters(analysis.entities.status),
                ...this.buildTimeFilters(analysis.entities.timeRange)
            },
            userId: context.userId,
            sortBy: analysis.parameters.sortBy || 'createdAt',
            limit: analysis.parameters.limit || 10
        };

        return {
            type: 'search',
            parameters: searchParams,
            metadata: {
                confidence: analysis.intent.confidence,
                requiresSourceContext: analysis.context.requiresSourceContext
            }
        };
    }

    buildSourceFilters (sources) {
        if (!sources || sources.length === 0) return {};

        return {
            source: { $in: sources }
        };
    }

    buildTypeFilters (types) {
        if (!types || types.length === 0) return {};

        return {
            type: { $in: types }
        };
    }

    buildStatusFilters (statuses) {
        if (!statuses || statuses.length === 0) return {};

        return {
            status: { $in: statuses }
        };
    }

    buildTimeFilters (timeRange) {
        if (!timeRange || timeRange.length === 0) return {};

        // Convert natural language time ranges to actual date filters
        const timeFilters = {};
        const now = new Date();

        timeRange.forEach(range => {
            switch (range.toLowerCase()) {
            case 'today':
                timeFilters.createdAt = {
                    $gte: new Date(now.setHours(0, 0, 0, 0)),
                    $lt: new Date(now.setHours(23, 59, 59, 999))
                };
                break;
            case 'this week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                timeFilters.createdAt = {
                    $gte: startOfWeek,
                    $lt: new Date(now.setHours(23, 59, 59, 999))
                };
                break;
            // Add more time range cases as needed
            }
        });

        return timeFilters;
    }

    getSuggestedActions (analysis) {
        // Provide contextual suggestions based on the analysis
        return {
            primaryAction: {
                type: analysis.intent.primary,
                confidence: analysis.intent.confidence,
                suggestion: `Did you want to ${analysis.intent.action}?`
            },
            alternatives: this.generateAlternatives(analysis)
        };
    }

    generateAlternatives (analysis) {
        // Generate alternative interpretations based on the analysis
        const alternatives = [];

        if (analysis.entities.source.length > 0) {
            alternatives.push({
                action: 'search',
                description: `Search in ${analysis.entities.source.join(', ')}`
            });
        }

        if (analysis.entities.type.length > 0) {
            alternatives.push({
                action: 'create',
                description: `Create a new ${analysis.entities.type[0]}`
            });
        }

        return alternatives;
    }
}
