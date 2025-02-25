const INTENTS = {
    SEARCH: 'search',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    LIST: 'list',
    QUERY: 'query'
};

const ENTITY_TYPES = {
    SOURCE: 'source',
    TYPE: 'type',
    STATUS: 'status',
    TIME_RANGE: 'time',
    DUE_DATE: 'dueDate',
    LABEL: 'label',
    PRIORITY: 'priority'
};

const TYPE_CHOICES = {
    NOTE: 'note',
    TODO: 'todo',
    MEETING: 'meeting',
    BOOKMARK: 'bookmark'
};

const STATUS_CHOICES = {
    NULL: 'null',
    TODO: 'todo',
    IN_PROGRESS: 'in progress',
    DONE: 'done',
    ARCHIVE: 'archive'
};

const SEARCH_PARAMS = {
    SORT_OPTIONS: {
        PRIORITY: 'priority',
        DUE_DATE: 'dueDate',
        CREATED: 'createdAt',
        UPDATED: 'updatedAt',
        RELEVANCE: 'relevance'
    },
    TIME_RANGES: {
        TODAY: 'today',
        YESTERDAY: 'yesterday',
        THIS_WEEK: 'this_week',
        LAST_WEEK: 'last_week',
        THIS_MONTH: 'this_month',
        NEXT_WEEK: 'next_week',
        NEXT_MONTH: 'next_month',
        OVERDUE: 'overdue'
    },
    PRIORITY_LEVELS: ['urgent', 'high', 'medium', 'low'],
    SOURCES: ['github', 'linear', 'gmail', 'twitter', 'march']
};

export class QueryUnderstanding {
    constructor (chatModel) {
        this.chatModel = chatModel;
        this.searchCache = new Map(); // Addeds caching for frequent searches
    }

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

    validatePriority (priority) {
        if (!priority) return null;
        console.log("hey")
        const normalizedPriority = priority?.toLowerCase();
        return SEARCH_PARAMS.PRIORITY_LEVELS.includes(normalizedPriority) ? normalizedPriority : null;
    }

    validateSource (source) {
        if (!source) return null;
        const normalizedSource = source.toLowerCase();
        return SEARCH_PARAMS.SOURCES.includes(normalizedSource) ? normalizedSource : null;
    }

    getCacheKey (query, userId) {
        return `${userId}:${query.toLowerCase().trim()}`;
    }

    async analyzeQuery (query, userId) {
        console.log("Analyzing query:", query);
        // Check cache first
        const cacheKey = this.getCacheKey(query, userId);
        if (this.searchCache.has(cacheKey)) {
            return this.searchCache.get(cacheKey);
        }

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
                "source": ["detected sources like github, linear, gmail, twitter, march"],
                "type": ["detected types like todo, note, meeting, bookmark"],
                "status": ["detected status like todo, in progress, done, archive"],
                "timeRange": ["detected time references like today, this_week, next_week, overdue"],
                "dueDate": "specific due date if mentioned",
                "labels": ["detected labels"],
                "priority": "detected priority level (urgent, high, medium, low)"
              },
              "parameters": {
                "filters": {},
                "sortBy": "One of: priority, dueDate, createdAt, updatedAt, relevance", 
                "limit": null,
                "searchMode": "One of: exact, fuzzy, semantic"
              },
              "context": {
                "isTimeSpecific": boolean,
                "requiresSourceContext": boolean,
                "needsDisambiguation": boolean
              }
            }

            Example queries to understand:
            - "show high priority tasks" -> priority: "high"
            - "find urgent todos" -> priority: "high", type: ["todo"]
            - "show tasks due this week" -> timeRange: ["this_week"]
            - "find overdue items" -> timeRange: ["overdue"]
            - "show github issues" -> source: ["github"]
            - "whats new on linear" -> source: ["linear], timeRange: ["today"]
            - "show high priority tasks from github due this week" -> priority: "high", source: ["github"], timeRange: ["this_week"]
            - "find overdue items sorted by priority" -> timeRange: ["overdue"], sortBy: "priority"
            - "show pending pr assigned to me" -> source:["github"]
            `;

            const result = await this.chatModel.generateContent(analysisPrompt);
            const responseText = result.response.text();

            // Clean the response text by removing markdown code blocks....
            const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();

            try {
                const analysis = JSON.parse(cleanJson);
                const processedResult = await this.processAnalysis(analysis, query, userId);

                // Cache result for 5 minutes
                this.searchCache.set(cacheKey, processedResult);
                setTimeout(() => this.searchCache.delete(cacheKey), 5 * 60 * 1000);

                return processedResult;
            } catch (parseError) {
                // If still can't parse, try to extract JSON using regex...
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

        switch (analysis.intent.primary) {
        case INTENTS.CREATE:
            return this.handleCreationIntent(analysis, queryContext);

        case INTENTS.SEARCH:
        case INTENTS.LIST:
            return this.handleSearchIntent(analysis, queryContext);

        case INTENTS.UPDATE:
            // TODO: Implement update handler
            return this.handleUpdateIntent(analysis, queryContext);

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

    // async handleSearchIntent (analysis, context) {
    //     const searchParams = {
    //         filters: {
    //             ...this.buildSourceFilters(analysis.entities.source),
    //             ...this.buildTypeFilters(analysis.entities.type),
    //             ...this.buildStatusFilters(analysis.entities.status),
    //             ...this.buildTimeFilters(analysis.entities.timeRange),
    //             ...this.buildDueDateFilter(analysis.entities.dueDate),
    //             ...this.buildPriorityFilter(analysis.entities.priority),
    //             ...this.buildLabelFilters(analysis.entities.labels)
    //         },
    //         userId: context.userId,
    //         sortBy: analysis.parameters.sortBy || SEARCH_PARAMS.SORT_OPTIONS.RELEVANCE,
    //         limit: analysis.parameters.limit || 10,
    //         searchMode: analysis.parameters.searchMode || 'semantic'
    //     };

    //     return {
    //         type: 'search',
    //         parameters: searchParams,
    //         metadata: {
    //             confidence: analysis.intent.confidence,
    //             requiresSourceContext: analysis.context.requiresSourceContext,
    //             originalQuery: context.originalQuery
    //         }
    //     };
    // }
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

        // Validate all sources
        const validSources = sources
            .map(source => this.validateSource(source))
            .filter(source => source !== null);

        if (validSources.length === 0) return {};

        return {
            source: { $in: validSources }
        };
    }

    buildTypeFilters (types) {
        if (!types || types.length === 0) return {};

        // Validate all types
        const validTypes = types
            .map(type => this.validateType(type))
            .filter(type => type !== null);

        if (validTypes.length === 0) return {};

        return {
            type: { $in: validTypes }
        };
    }

    buildStatusFilters (statuses) {
        if (!statuses || statuses.length === 0) return {};

        // Validate all statuses
        const validStatuses = statuses
            .map(status => this.validateStatus(status))
            .filter(status => status !== null);

        if (validStatuses.length === 0) return {};

        return {
            status: { $in: validStatuses }
        };
    }

    buildPriorityFilter (priority) {
        if (!priority) return {};

        const validPriority = this.validatePriority(priority);
        if (!validPriority) return {};

        return { priority: validPriority };
    }

    // TODO: Need improvment
    buildLabelFilters (labels) {
        if (!labels || labels.length === 0) return {};

        return { labels: { $in: labels } };
    }

    buildDueDateFilter (dueDate) {
        if (!dueDate) return {};

        // Handle specific due date (assuming ISO format)
        try {
            const date = new Date(dueDate);
            if (!isNaN(date.getTime())) {
                const startOfDay = new Date(date.setHours(0, 0, 0, 0));
                const endOfDay = new Date(date.setHours(23, 59, 59, 999));

                return {
                    dueDate: {
                        $gte: startOfDay.toISOString(),
                        $lte: endOfDay.toISOString()
                    }
                };
            }
        } catch (e) {
            console.warn("Invalid due date format:", dueDate);
        }

        return {};
    }

    buildTimeFilters (timeRanges) {
        if (!timeRanges || timeRanges.length === 0) return {};

        const now = new Date();
        const timeFilters = { $or: [] };

        timeRanges.forEach(range => {
            const filter = {};

            switch (range.toLowerCase()) {
            case SEARCH_PARAMS.TIME_RANGES.TODAY:
                // eslint-disable-next-line no-case-declarations
                const todayStart = new Date(now);
                todayStart.setHours(0, 0, 0, 0);
                // eslint-disable-next-line no-case-declarations
                const todayEnd = new Date(now);
                todayEnd.setHours(23, 59, 59, 999);

                filter.dueDate = {
                    $gte: todayStart.toISOString(),
                    $lte: todayEnd.toISOString()
                };
                break;
            case SEARCH_PARAMS.TIME_RANGES.YESTERDAY:
                // eslint-disable-next-line no-case-declarations
                const yesterdayStart = new Date(now);
                yesterdayStart.setDate(now.getDate() - 1);
                yesterdayStart.setHours(0, 0, 0, 0);
                // eslint-disable-next-line no-case-declarations
                const yesterdayEnd = new Date(now);
                yesterdayEnd.setDate(now.getDate() - 1);
                yesterdayEnd.setHours(23, 59, 59, 999);

                filter.dueDate = {
                    $gte: yesterdayStart.toISOString(),
                    $lte: yesterdayEnd.toISOString()
                };
                break;

            case SEARCH_PARAMS.TIME_RANGES.THIS_WEEK:
                // eslint-disable-next-line no-case-declarations
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                weekStart.setHours(0, 0, 0, 0);
                // eslint-disable-next-line no-case-declarations
                const weekEnd = new Date(now);
                weekEnd.setDate(weekStart.getDate() + 6);
                weekEnd.setHours(23, 59, 59, 999);

                filter.dueDate = {
                    $gte: weekStart.toISOString(),
                    $lte: weekEnd.toISOString()
                };
                break;

            case SEARCH_PARAMS.TIME_RANGES.NEXT_WEEK:
                // eslint-disable-next-line no-case-declarations
                const nextWeekStart = new Date(now);
                nextWeekStart.setDate(now.getDate() - now.getDay() + 7);
                nextWeekStart.setHours(0, 0, 0, 0);
                // eslint-disable-next-line no-case-declarations
                const nextWeekEnd = new Date(now);
                nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
                nextWeekEnd.setHours(23, 59, 59, 999);

                filter.dueDate = {
                    $gte: nextWeekStart.toISOString(),
                    $lte: nextWeekEnd.toISOString()
                };
                break;

            case SEARCH_PARAMS.TIME_RANGES.THIS_MONTH:
                // eslint-disable-next-line no-case-declarations
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                // eslint-disable-next-line no-case-declarations
                const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

                filter.dueDate = {
                    $gte: monthStart.toISOString(),
                    $lte: monthEnd.toISOString()
                };
                break;

            case SEARCH_PARAMS.TIME_RANGES.NEXT_MONTH:
                // eslint-disable-next-line no-case-declarations
                const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                // eslint-disable-next-line no-case-declarations
                const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);

                filter.dueDate = {
                    $gte: nextMonthStart.toISOString(),
                    $lte: nextMonthEnd.toISOString()
                };
                break;

            case SEARCH_PARAMS.TIME_RANGES.OVERDUE:
                filter.dueDate = { $lt: now.toISOString() };
                filter.isCompleted = false;
                break;
            }

            if (Object.keys(filter).length > 0) {
                timeFilters.$or.push(filter);
            }
        });

        // If no valid time ranges were found, return empty object
        return timeFilters.$or.length > 0 ? timeFilters : {};
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
        - Keep it meaningful and easy to understand
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
        const title = await this.generateTitle(context.originalQuery, analysis);

        // Create the base object with the AI-generated title...
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

        // Add priority if specified
        if (analysis.entities.priority) {
            baseObject.priority = this.validatePriority(analysis.entities.priority) || 'medium';
        }

        // Add due date if specified
        if (analysis.entities.dueDate) {
            try {
                baseObject.dueDate = new Date(analysis.entities.dueDate).toISOString();
            } catch (e) {
                console.warn("Invalid due date format:", analysis.entities.dueDate);
            }
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

    getSuggestedActions (analysis) {
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
        const alternatives = [];

        if (analysis.entities.source && analysis.entities.source.length > 0) {
            alternatives.push({
                action: 'search',
                description: `Search in ${analysis.entities.source.join(', ')}`
            });
        }

        if (analysis.entities.type && analysis.entities.type.length > 0) {
            alternatives.push({
                action: 'create',
                description: `Create a new ${analysis.entities.type[0]}`
            });
        }

        if (analysis.entities.timeRange && analysis.entities.timeRange.length > 0) {
            alternatives.push({
                action: 'search',
                description: `Show items due ${analysis.entities.timeRange[0]}`
            });
        }

        if (analysis.entities.priority) {
            alternatives.push({
                action: 'search',
                description: `Show ${analysis.entities.priority} priority items`
            });
        }

        return alternatives;
    }
}


// const INTENTS = {
//     SEARCH: 'search',
//     CREATE: 'create',
//     UPDATE: 'update',
//     DELETE: 'delete',
//     LIST: 'list',
//     QUERY: 'query'
// };
// // Entity types that can be extracted from queries
// const ENTITY_TYPES = {
//     SOURCE: 'source',
//     TYPE: 'type',
//     STATUS: 'status',
//     TIME_RANGE: 'time',
//     LABEL: 'label',
//     PRIORITY: 'priority'
// };
// const TYPE_CHOICES = {
//     NOTE: 'note',
//     TODO: 'todo',
//     MEETING: 'meeting'
// };

// const STATUS_CHOICES = {
//     NULL: 'null',
//     TODO: 'todo',
//     IN_PROGRESS: 'in progress',
//     DONE: 'done',
//     ARCHIVE: 'archive'
// };

// export class QueryUnderstanding {
//     // constructor (chatModel) {
//     //     this.chatModel = chatModel;
//     // }
//     constructor (chatModel) {
//         this.chatModel = chatModel;
//         // Cache the metadata keys
//         // this.metadataKeys = Object.keys(extractMetadata({}));
//     }

//     // Helper to validate and get correct type
//     validateType (type) {
//         const normalizedType = type?.toLowerCase();
//         return TYPE_CHOICES[normalizedType] ||
//             Object.values(TYPE_CHOICES).includes(normalizedType)
//             ? normalizedType : TYPE_CHOICES.TODO;
//     }

//     validateStatus (status) {
//         const normalizedStatus = status?.toLowerCase();
//         return STATUS_CHOICES[normalizedStatus] ||
//                Object.values(STATUS_CHOICES).includes(normalizedStatus)
//             ? normalizedStatus : STATUS_CHOICES.NULL;
//     }

//     async analyzeQuery (query, userId) {
//         console.log("Analyzing query:", query);
//         try {
//             const analysisPrompt = `
//             Analyze this user query: "${query}"
            
//             Return only a JSON object (no markdown, no code blocks) with this structure:
//             {
//               "intent": {
//                 "primary": "One of: search, create, update, delete, list, query",
//                 "confidence": "Number between 0-1",
//                 "action": "Specific action being requested"
//               },
//               "entities": {
//                 "source": ["detected sources like github, linear"],
//                 "type": ["detected types like todo, note"],
//                 "status": ["detected status"],
//                 "timeRange": ["detected time references"],
//                 "labels": ["detected labels"],
//                 "priority": "detected priority level"
//               },
//               "parameters": {
//                 "filters": {},
//                 "sortBy": "", 
//                 "limit": null 
//               },
//               "context": {
//                 "isTimeSpecific": boolean,
//                 "requiresSourceContext": boolean,
//                 "needsDisambiguation": boolean
//               }
//             }`;

//             const result = await this.chatModel.generateContent(analysisPrompt);
//             // console.log("Analysis result:", result.response.text());
//             const responseText = result.response.text();

//             // Clean the response text by removing markdown code blocks
//             const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
//             // console.log("Cleaned JSON:", cleanJson);

//             try {
//                 const analysis = JSON.parse(cleanJson);
//                 // console.log("Parsed analysis:", analysis);
//                 return this.processAnalysis(analysis, query, userId);
//             } catch (parseError) {
//                 // If still can't parse, try to extract JSON using regex
//                 const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//                 if (jsonMatch) {
//                     const analysis = JSON.parse(jsonMatch[0]);
//                     return this.processAnalysis(analysis, query, userId);
//                 }
//                 throw parseError;
//             }
//         } catch (error) {
//             console.error("Error analyzing query:", error);
//             throw error;
//         }
//     }

//     async processAnalysis (analysis, originalQuery, userId) {
//         console.log("Processing analysis:", analysis);
//         const queryContext = {
//             intent: analysis.intent,
//             originalQuery,
//             userId,
//             timestamp: new Date()
//         };
//         console.log("Processing analysis: sajda", queryContext);
//         switch (analysis.intent.primary) {
//         case INTENTS.CREATE:
//             // console.log("Create intent detected");
//             return this.handleCreationIntent(analysis, queryContext);

//         case INTENTS.SEARCH:
//         case INTENTS.LIST:
//             return this.handleSearchIntent(analysis, queryContext);

//         case INTENTS.UPDATE:
//             return this.handleUpdateIntent(analysis, queryContext); // TODO: Implement update handler

//         case INTENTS.QUERY:
//             return this.handleGeneralQuery(analysis, queryContext);

//         default:
//             return {
//                 type: 'clarification_needed',
//                 message: "I'm not sure what you'd like to do. Could you please rephrase your request?",
//                 suggestedActions: this.getSuggestedActions(analysis)
//             };
//         }
//     }

//     async handleGeneralQuery (analysis, context) {
//         const conversationPrompt = `
//           Based on user query: "${context.originalQuery}"
//           Provide a brief, direct response. Keep it short and natural.
//           If the query is a greeting or simple acknowledgment, respond casually and briefly.
//           If it's a question, provide a clear, concise answer.`;

//         const result = await this.chatModel.generateContent(conversationPrompt);

//         return {
//             type: 'conversation',
//             response: result.response.text(),
//             metadata: {
//                 confidence: analysis.intent.confidence
//             }
//         };
//     }

//     async generateTitle (query, analysis) {
//         const titlePrompt = `
//         Given this user request: "${query}"
//         Context: ${JSON.stringify(analysis.entities)}
        
//         Generate a clear, concise title for this ${analysis.entities.type[0] || 'task'}.
        
//         Requirements:
//         - Keep it under meaningfull and easy to understand
//         - Make it descriptive and specific
//         - Don't include words like "TODO" or "BUG" unless they're part of the actual title
//         - Return ONLY the title text, nothing else
        
//         Example outputs:
//         - "Website Navigation Menu Broken"
//         - "Update User Profile Page"
//         - "Fix Payment Gateway Error"`;

//         try {
//             const result = await this.chatModel.generateContent(titlePrompt);

//             return result.response.text()
//                 .trim()
//                 .replace(/^["']|["']$/g, '')
//                 .replace(/```/g, '')
//                 .replace(/\n/g, '');
//         } catch (error) {
//             console.warn("Title generation failed:", error);
//             // Fallback to a basic title extraction
//             return query
//                 .replace(/^(create|add|make)\s+(a|an)?\s*/i, '')
//                 .replace(/\s*(in|on|at|for)\s+(linear|notion|github)\s*/i, '')
//                 .replace(/\s*(as|like|type)\s+(a|an)?\s*(bug|todo|note|task)\s*/i, '') ||
//                 'Untitled';
//         }
//     }

//     async handleCreationIntent (analysis, context) {
//         // Generate title using AI
//         const title = await this.generateTitle(context.originalQuery, analysis);

//         // Create the base object with the AI-generated title
//         const baseObject = {
//             title,
//             type: analysis.entities.type[0]?.toLowerCase() || 'todo',
//             source: analysis.entities.source[0] || 'march',
//             status: 'todo',
//             isCompleted: false,
//             isArchived: false,
//             isFavorite: false,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             userId: context.userId,
//             labels: analysis.entities.labels || []
//         };

//         // Add description based on context
//         if (analysis.entities.labels?.length > 0) {
//             baseObject.description = `Issue related to ${analysis.entities.labels.join(', ')}`;
//         }
//         return {
//             type: 'creation',
//             data: baseObject,
//             source: analysis.entities.source[0] || 'march',
//             metadata: {
//                 confidence: analysis.intent.confidence,
//                 needsConfirmation: false
//             }
//         };
//     }

//     async handleSearchIntent (analysis, context) {
//         // Build search parameters based on entities and context
//         const searchParams = {
//             filters: {
//                 ...this.buildSourceFilters(analysis.entities.source),
//                 ...this.buildTypeFilters(analysis.entities.type),
//                 ...this.buildStatusFilters(analysis.entities.status),
//                 ...this.buildTimeFilters(analysis.entities.timeRange)
//             },
//             userId: context.userId,
//             sortBy: analysis.parameters.sortBy || 'createdAt',
//             limit: analysis.parameters.limit || 10
//         };

//         return {
//             type: 'search',
//             parameters: searchParams,
//             metadata: {
//                 confidence: analysis.intent.confidence,
//                 requiresSourceContext: analysis.context.requiresSourceContext
//             }
//         };
//     }

//     buildSourceFilters (sources) {
//         if (!sources || sources.length === 0) return {};

//         return {
//             source: { $in: sources }
//         };
//     }

//     buildTypeFilters (types) {
//         if (!types || types.length === 0) return {};

//         return {
//             type: { $in: types }
//         };
//     }

//     buildStatusFilters (statuses) {
//         if (!statuses || statuses.length === 0) return {};

//         return {
//             status: { $in: statuses }
//         };
//     }

//     buildTimeFilters (timeRange) {
//         if (!timeRange || timeRange.length === 0) return {};

//         // Convert natural language time ranges to actual date filters
//         const timeFilters = {};
//         const now = new Date();

//         timeRange.forEach(range => {
//             switch (range.toLowerCase()) {
//             case 'today':
//                 timeFilters.createdAt = {
//                     $gte: new Date(now.setHours(0, 0, 0, 0)),
//                     $lt: new Date(now.setHours(23, 59, 59, 999))
//                 };
//                 break;
//             case 'this week':
//                 const startOfWeek = new Date(now);
//                 startOfWeek.setDate(now.getDate() - now.getDay());
//                 timeFilters.createdAt = {
//                     $gte: startOfWeek,
//                     $lt: new Date(now.setHours(23, 59, 59, 999))
//                 };
//                 break;
//             // Add more time range cases as needed
//             }
//         });

//         return timeFilters;
//     }

//     getSuggestedActions (analysis) {
//         // Provide contextual suggestions based on the analysis
//         return {
//             primaryAction: {
//                 type: analysis.intent.primary,
//                 confidence: analysis.intent.confidence,
//                 suggestion: `Did you want to ${analysis.intent.action}?`
//             },
//             alternatives: this.generateAlternatives(analysis)
//         };
//     }

//     generateAlternatives (analysis) {
//         // Generate alternative interpretations based on the analysis
//         const alternatives = [];

//         if (analysis.entities.source.length > 0) {
//             alternatives.push({
//                 action: 'search',
//                 description: `Search in ${analysis.entities.source.join(', ')}`
//             });
//         }

//         if (analysis.entities.type.length > 0) {
//             alternatives.push({
//                 action: 'create',
//                 description: `Create a new ${analysis.entities.type[0]}`
//             });
//         }

//         return alternatives;
//     }
// }
