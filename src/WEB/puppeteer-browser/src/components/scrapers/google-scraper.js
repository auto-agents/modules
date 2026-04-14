import puppeteer from 'puppeteer'

const querystring = require('node:querystring');

export default class GoogleScraper {

    constructor(ctx, plugin, config) {
        this.ctx = ctx
        this.config = plugin.config.scrappers.google
        if (config)
            this.config = {
                ...this.config
                , ...config
            }
        this.plugin = plugin
    }

    async run(query) {
        const url = this.config.queryUrl.replace(
            '{search_query}',
            querystring.escape(query))

        // 1. open the search home page
        const page = await this.plugin.openPage(url)

        // 2. launch the search query
        await page.evaluate('console.log("ici")')
    }
} 