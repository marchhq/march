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
    SOURCE: 'source',
    TYPE: 'type',
    STATUS: 'status',
    TIME_RANGE: 'time',
    LABEL: 'label',
    PRIORITY: 'priority'
};
const TYPE_CHOICES = {
    NOTE: 'note',
    TODO: 'todo',
    MEETING: 'meeting'
};

const STATUS_CHOICES = {
    NULL: 'null',
    TODO: 'todo',
    IN_PROGRESS: 'in progress',
    DONE: 'done',
    ARCHIVE: 'archive'
};

export class QueryUnderstanding {
    // constructor (chatModel) {
    //     this.chatModel = chatModel;
    // }
    constructor (chatModel) {
        this.chatModel = chatModel;
        // Cache the metadata keys
        // this.metadataKeys = Object.keys(extractMetadata({}));
    }

    // Helper to validate and get correct type
    validateType (type) {
        const normalizedType = type?.toLowerCase();
        return TYPE_CHOICES[normalizedType] ||
            Object.values(TYPE_CHOICES).includes(normalizedType)
            ? normalizedType : TYPE_CHOICES.TODO;
    }

    validateStatus (status) {
        const normalizedStatus = status?.toLowerCase();
        return STATUS_CHOICES[normalizedStatus] ||
               Object.values(STATUS_CHOICES).includes(normalizedStatus)
            ? normalizedStatus : STATUS_CHOICES.NULL;
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
        console.log("Processing analysis:", analysis);
        const queryContext = {
            intent: analysis.intent,
            originalQuery,
            userId,
            timestamp: new Date()
        };
        console.log("Processing analysis: sajda", queryContext);
        switch (analysis.intent.primary) {
        case INTENTS.CREATE:
            // console.log("Create intent detected");
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

    async generateTitle (query, analysis) {
        const titlePrompt = `
        Given this user request: "${query}"
        Context: ${JSON.stringify(analysis.entities)}
        
        Generate a clear, concise title for this ${analysis.entities.type[0] || 'task'}.
        
        Requirements:
        - Keep it under meaningfull and easy to understand
        - Make it descriptive and specific
        - Don't include words like "TODO" or "BUG" unless they're part of the actual title
        - Return ONLY the title text, nothing else
        
        Example outputs:
        - "Website Navigation Menu Broken"
        - "Update User Profile Page"
        - "Fix Payment Gateway Error"`;

        try {
            const result = await this.chatModel.generateContent(titlePrompt);

            return result.response.text()
                .trim()
                .replace(/^["']|["']$/g, '')
                .replace(/```/g, '')
                .replace(/\n/g, '');
        } catch (error) {
            console.warn("Title generation failed:", error);
            // Fallback to a basic title extraction
            return query
                .replace(/^(create|add|make)\s+(a|an)?\s*/i, '')
                .replace(/\s*(in|on|at|for)\s+(linear|notion|github)\s*/i, '')
                .replace(/\s*(as|like|type)\s+(a|an)?\s*(bug|todo|note|task)\s*/i, '') ||
                'Untitled';
        }
    }

    async handleCreationIntent (analysis, context) {
        // Generate title using AI
        const title = await this.generateTitle(context.originalQuery, analysis);

        // Create the base object with the AI-generated title
        const baseObject = {
            title,
            type: analysis.entities.type[0]?.toLowerCase() || 'todo',
            source: analysis.entities.source[0] || 'march',
            status: 'todo',
            isCompleted: false,
            isArchived: false,
            isFavorite: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: context.userId,
            labels: analysis.entities.labels || []
        };

        // Add description based on context
        if (analysis.entities.labels?.length > 0) {
            baseObject.description = `Issue related to ${analysis.entities.labels.join(', ')}`;
        }
        return {
            type: 'creation',
            data: baseObject,
            source: analysis.entities.source[0] || 'march',
            metadata: {
                confidence: analysis.intent.confidence,
                needsConfirmation: false
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
