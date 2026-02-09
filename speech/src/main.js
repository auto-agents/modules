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

function runBrowser(config, url) {
	const browserKey = (config?.browser || 'edge').toLowerCase()
	const cmd = config?.browsers?.[browserKey]?.runCommand
		|| config?.browsers?.edge?.runCommand
		|| config?.browsers?.chrome?.runCommand
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
