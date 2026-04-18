import AITool from "../../../../../../shared/src/components/ai-tools/ai-tool"

export default class WebSearchTool extends AITool {

    constructor(ctx, config) {
        super(ctx, config)
    }

    specification() {
        return {
            name: 'web_search',
            description: 'search on internet using an online search engine',
            parameters: {
                type: "object",
                properties: {
                    "query": {
                        "type": "string"
                    },
                    "engine": {
                        "type": "string",
                        "default": "google"
                    }
                }
            },
            required: ["query"]
        }
    }

    async run(args) {

    }
}
