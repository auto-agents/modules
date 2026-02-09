import SpeechModule from './speech-module.js'

async function main() {
	const mod = SpeechModule.fromDefaultConfigFile()
	console.log(`speech module test: platform=${mod.config.platform || 'windows'} browser=${mod.config.browser || 'edge'}`)
	console.log(`speech module test: spa url: ${mod.spaUrl()}`)

	process.on('SIGINT', async () => {
		await mod.stopServer()
		process.exit(130)
	})

	let exitCode = 0
	try {
		await mod.launchServer()
		await mod.openBrowser()
		const voiceList = await mod.waitForVoices()
		const voice = voiceList[0]?.name
		if (!voice) throw new Error('no voice name available in capabilities response')
		await mod.speak({ sentence: 'hello world', voice, apiKey: mod.config.apiKey })
	} catch (e) {
		exitCode = 1
		throw e
	} finally {
		await mod.stopServer()
		process.exit(exitCode)
	}
}

main().catch((e) => {
	console.error(e)
	process.exitCode = 1
})
