import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import SpeechServer from './backend/server.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function readConfig() {
	const p = path.resolve(__dirname, 'config', 'config.json')
	const raw = fs.readFileSync(p, 'utf-8')
	return JSON.parse(raw)
}

function buildAppUrl(config) {
	return `http://localhost:${config.port}/app/`
}

function resolveRunCommand(browserCfg, platformKey) {
	const rc = browserCfg?.runCommand
	if (!rc) return null
	if (typeof rc === 'string') return rc
	if (typeof rc === 'object') {
		return rc?.[platformKey] || rc?.windows || rc?.linux || rc?.mac || null
	}
	return null
}

function runBrowser(config, url) {
	const platformKey = (config?.platform || 'windows').toLowerCase()
	const browserKey = (config?.browser || 'edge').toLowerCase()
	const cmd = resolveRunCommand(config?.browsers?.[browserKey], platformKey)
		|| resolveRunCommand(config?.browsers?.edge, platformKey)
		|| resolveRunCommand(config?.browsers?.chrome, platformKey)
	if (!cmd) return

	const finalCmd = cmd.includes('{url}') ? cmd.replace('{url}', url) : `${cmd} ${url}`
	spawn(finalCmd, {
		shell: true,
		detached: true,
		stdio: 'ignore'
	}).unref()
}

async function main() {
	const config = readConfig()
	const server = new SpeechServer({ config })
	await server.start()

	const url = buildAppUrl(config)
	runBrowser(config, url)
}

main().catch((e) => {
	console.error(e)
	process.exitCode = 1
})
