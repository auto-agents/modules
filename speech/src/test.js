import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms))
}

function readConfig() {
	const p = path.resolve(__dirname, 'config', 'config.json')
	const raw = fs.readFileSync(p, 'utf-8')
	return JSON.parse(raw)
}

async function httpJson(url, { method = 'GET', body } = {}) {
	const headers = { 'content-type': 'application/json' }
	const res = await fetch(url, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined
	})
	const text = await res.text()
	let json
	try {
		json = text ? JSON.parse(text) : null
	} catch {
		json = null
	}
	return { ok: res.ok, status: res.status, json, text }
}

async function waitForServer(baseUrl, timeoutMs = 15000) {
	const start = Date.now()
	while (Date.now() - start < timeoutMs) {
		try {
			const r = await httpJson(`${baseUrl}/status`)
			if (r.ok) return
		} catch {
			// ignore
		}
		await sleep(250)
	}
	throw new Error('timeout waiting for speech module server')
}

async function waitForVoices(baseUrl, timeoutMs = 30000) {
	const start = Date.now()
	while (Date.now() - start < timeoutMs) {
		try {
			const r = await httpJson(`${baseUrl}/capabilities`)
			const voiceList = r?.json?.voiceList
			if (r.ok && Array.isArray(voiceList) && voiceList.length > 0) return voiceList
		} catch {
			// ignore
		}
		await sleep(500)
	}
	throw new Error(`timeout waiting for voice capabilities (is the browser SPA connected?) open ${baseUrl}/app/ and check that it shows 'connected'`)
}

async function main() {
	const moduleRoot = path.resolve(__dirname, '..')

	const config = readConfig()
	const baseUrl = `http://localhost:${config.port}`
	console.log(`speech module test: platform=${config.platform || 'windows'} browser=${config.browser || 'edge'}`)
	console.log(`speech module test: spa url: ${baseUrl}/app/`)

	const child = spawn(process.execPath, ['src/main.js'], {
		cwd: moduleRoot,
		stdio: 'inherit'
	})

	const shutdown = async () => {
		if (child.exitCode != null) return
		child.kill('SIGINT')
		await sleep(1000)
		if (child.exitCode == null) child.kill('SIGKILL')
	}

	process.on('SIGINT', async () => {
		await shutdown()
		process.exit(130)
	})

	try {
		await waitForServer(baseUrl)
		const voiceList = await waitForVoices(baseUrl)
		const voice = voiceList[0]?.name
		if (!voice) throw new Error('no voice name available in capabilities response')

		const speakRes = await httpJson(`${baseUrl}/speak`, {
			method: 'POST',
			body: {
				sentence: 'hello world',
				voice,
				apiKey: config.apiKey
			}
		})

		if (!speakRes.ok) {
			throw new Error(`POST /speak failed: ${speakRes.status} ${speakRes.text}`)
		}

		await sleep(3000)
	} finally {
		await shutdown()
	}
}

main().catch((e) => {
	console.error(e)
	process.exitCode = 1
})
