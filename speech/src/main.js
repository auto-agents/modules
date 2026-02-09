import SpeechModule from './speech-module.js'

async function main() {
	const mod = SpeechModule.fromDefaultConfigFile()
	await mod.launchServer()
	await mod.openBrowser()
}

main().catch((e) => {
	console.error(e)
	process.exitCode = 1
})
