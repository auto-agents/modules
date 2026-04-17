export default class PupeteerPlugin {

    // host plugin (puppeteer)
    plugin = null

    constructor(ctx, plugin, config, outputContext) {
        this.ctx = ctx
        this.plugin = plugin
        this.config = config
        this.outputContext = outputContext
    }
}
