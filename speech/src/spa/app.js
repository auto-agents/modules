const elWs = document.getElementById('ws')
const elStatus = document.getElementById('status')
const elActivity = document.getElementById('activity')
const elVoicesCount = document.getElementById('voicesCount')
const elLog = document.getElementById('log')

let maxLogLines = 15
const logLines = []

function log(line) {
	logLines.unshift(`${new Date().toISOString()} ${line}`)
	logLines.splice(maxLogLines)
	elLog.textContent = logLines.join('\n')
}

async function loadConfig() {
	try {
		const res = await fetch('/config')
		if (!res.ok) return
		const cfg = await res.json()
		const parsed = Number.parseInt(cfg?.maxLogLines, 10)
		if (Number.isFinite(parsed) && parsed > 0) maxLogLines = parsed
	} catch {
		// ignore
	}
}

function setBadge(el, text, ok) {
	el.textContent = text
	el.classList.toggle('ok', !!ok)
	el.classList.toggle('ko', ok === false)
}

function safeLang(v) {
	if (!v) return 'multilingual'
	return v
}

function getVoices() {
	const list = window.speechSynthesis?.getVoices?.() || []
	return list.map(v => ({ name: v.name, lang: safeLang(v.lang || (v.localService ? v.lang : v.lang) || 'multilingual') }))
}

function pickVoiceByNameOrPreferred(voices, voiceName, preferredVoices) {
	if (voiceName) {
		const match = voices.find(v => v.name === voiceName)
		if (match) return match
	}
	if (Array.isArray(preferredVoices)) {
		for (const name of preferredVoices) {
			const match = voices.find(v => v.name === name)
			if (match) return match
		}
	}
	return voices[0] || null
}

function send(ws, obj) {
	ws.send(JSON.stringify(obj))
}

let currentUtterance = null

function stopSpeaking() {
	try {
		window.speechSynthesis.cancel()
	} catch {
		// ignore
	}
	currentUtterance = null
	setBadge(elStatus, 'idle', true)
	elActivity.textContent = '-'
}

function speakSentence(sentence, voiceName, preferredVoices, ws) {
	const synth = window.speechSynthesis
	if (!synth) {
		log('Web Speech API not available')
		send(ws, { type: 'ERROR', message: 'Web Speech API not available' })
		return
	}

	synth.cancel()

	const voices = synth.getVoices()
	const selected = pickVoiceByNameOrPreferred(voices, voiceName, preferredVoices)
	const utt = new SpeechSynthesisUtterance(sentence)
	if (selected) utt.voice = selected

	currentUtterance = utt
	setBadge(elStatus, 'speaking', true)
	elActivity.textContent = `${sentence}${selected ? ` (${selected.name})` : ''}`
	log(`speak: ${sentence}`)

	send(ws, { type: 'STATUS', runningStatus: 'speaking' })

	utt.onend = () => {
		currentUtterance = null
		setBadge(elStatus, 'idle', true)
		elActivity.textContent = '-'
		send(ws, { type: 'STATUS', runningStatus: 'idle' })
	}
	utt.onerror = (e) => {
		currentUtterance = null
		setBadge(elStatus, 'idle', false)
		elActivity.textContent = '-'
		log(`error: ${e.error || 'unknown'}`)
		send(ws, { type: 'ERROR', message: e.error || 'speech synthesis error' })
		send(ws, { type: 'STATUS', runningStatus: 'idle' })
	}

	synth.speak(utt)
}

function connect() {
	const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`
	const ws = new WebSocket(wsUrl)

	ws.onopen = () => {
		setBadge(elWs, 'connected', true)
		log('ws connected')

		const pushCaps = () => {
			const voiceList = getVoices()
			elVoicesCount.textContent = String(voiceList.length)
			send(ws, { type: 'CAPABILITIES', voiceList })
		}

		pushCaps()
		window.speechSynthesis?.addEventListener?.('voiceschanged', pushCaps)

		send(ws, { type: 'STATUS', runningStatus: 'idle' })
		setBadge(elStatus, 'idle', true)
	}

	ws.onclose = () => {
		setBadge(elWs, 'disconnected', false)
		log('ws disconnected')
		stopSpeaking()
		setTimeout(connect, 1000)
	}

	ws.onerror = () => {
		setBadge(elWs, 'error', false)
	}

	ws.onmessage = (ev) => {
		let msg
		try {
			msg = JSON.parse(ev.data)
		} catch {
			return
		}

		if (msg.type === 'SPEAK') {
			speakSentence(msg.sentence, msg.voice, msg.preferredVoices, ws)
		}
		if (msg.type === 'STOP') {
			stopSpeaking()
			send(ws, { type: 'STATUS', runningStatus: 'idle' })
		}
	}
}

await loadConfig()
connect()
