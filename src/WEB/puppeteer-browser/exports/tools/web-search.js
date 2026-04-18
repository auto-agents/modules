import AITool from "../../../../../../shared/src/components/ai-tools/ai-tool"
import { cmd } from "../../../../../../shared/src/utils/utils"

export default class WebSearchTool extends AITool {

    constructor(ctx, config) {
        super(ctx, config)
    }

    specification() {
        return {
            name: 'web_search',
            description: 'search information on internet using an online search engine',
            parameters: {
                type: "object",
                properties: {
                    "query": {
                        "type": "string",
                        "description": "the query to provide to the search engine"
                    },
                    "engine": {
                        "description": "the search engine that must be used",
                        "type": "string",
                        "enum": ["google"],
                        "default": "google"
                    }
                }
            },
            required: ["query"]
        }
    }

    async run(args) {
        const id = args.engine || 'google'
        var query = args.query

        // /pup search {id} {query} -g default -d
        query = query.replaceAll('"', '')
        const res = await cmd(this.ctx,
            'puppeteer', 'search', id,
            '"' + query + '"', '-g', 'default', '-d')

        if (res instanceof Error) {
            // search error
            return this.jsonPlainResult(
                {
                    error: res.message || res.toString() || res
                }
            )
        }

        const r = res["1"]

        return this.jsonPlainResult({
            query_result: r.aiContent
        })
    }
}
