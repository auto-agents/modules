import { readFileSync } from 'fs'
import { join } from 'path'

export default class PupeteerPlugin {

    // host plugin (puppeteer)
    plugin = null

    // path where the plugin class is
    pluginPath = null

    constructor(ctx, plugin, config, outputContext, pluginPath) {
        this.ctx = ctx
        this.plugin = plugin
        this.config = config
        this.outputContext = outputContext
        this.pluginPath = pluginPath
    }

    getScriptWithTransform(name, transformsFunc, path) {
        const scriptsPath = path || join(
            this.pluginPath,
            this.config.scriptsPath
        )
        var content = readFileSync(
            join(scriptsPath, name)
        ).toString()

        // subst global vars
        for (const [key, value] of Object.entries(this.plugin.config.vars)) {
            content = content.replaceAll('{' + key + '}', value)
        }

        return !transformsFunc ? content :
            transformsFunc(content)
    }

    async importScripts(page) {

        const scriptsPath = join(
            this.plugin.specification.file,
            '..',
            this.plugin.config.paths.scripts
        )
        // imports []
        if (this.config.imports && this.config.imports.length > 0)
            this.config.imports.forEach(async imp => {
                try {
                    const text = this.getScriptWithTransform(
                        imp,
                        null,
                        scriptsPath
                    )
                    await page.addScriptTag({
                        content: text
                    })
                } catch (err) {
                    const t = 'failed to add script to page: '
                    console.error(t + err.message)
                }
            });

        // includes []
        if (this.config.includes && this.config.includes.length > 0)
            this.config.includes.forEach(async imp => {
                var n = null
                try {
                    var text = this.getScriptWithTransform(
                        imp,
                        null,
                        scriptsPath
                    )
                    n = imp.toUpperCase().replaceAll('.', '_')
                    this.plugin.config.vars[n] = text
                } catch (err) {
                    const t = 'failed to set script variable: ' + n
                    console.error(t + err.message)
                }
            });
    }
}
