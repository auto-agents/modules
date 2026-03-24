import cliSpinners from 'cli-spinners';
import { existsSync } from "fs";
import { join, dirname } from 'path';
import ActionController from "../controllers/action-controller.js";
import SpinnerService from "../services/spinner-service.js";
import Status from '../../../shared/src/utils/status.js'
import utils, { addServer, removeServer, toJson } from '../../../shared/src/utils/utils.js'
import Server from '../../../shared/src/data/server.js';
import SpeakerError from '../../../shared/src/data/speaker-error.js';

export default class TTSWebUI {

	desc = 'TTS-WebUI module'

	constructor(ctx, config, outputContext, moduleSpec) {
		this.config = config
		this.specification = moduleSpec
		this.ctx = ctx
		this.outputContext = outputContext
		this.api = this.config.api
	}

	/**
	 * module init
	 */
	async init() {
		const o = this.outputContext.output
		const margin = ' '.repeat(this.outputContext.margin + this.outputContext.marginBase)
		const margin2 = ' '.repeat(margin.length + this.outputContext.marginBase)

		o.newLine()
		o.appendLine(margin + `~ loading ${this.desc} API bridge for: "${this.config.api}"`)

		if (!this.config.api)
			throw new Error('api is not defined')
		const apiConfig = this.specification.config.apis[this.config.api]
		if (!apiConfig)
			throw new Error('api not found: ' + this.config.api)
		const apiBridgeFilename = apiConfig.bridgeFile
		if (!apiBridgeFilename)
			throw new Error('api bridge file not defined')

		const apiBridgePath = join(
			process.cwd(),
			dirname(this.specification.file),
			'..',
			'..',
			'src',
			apiBridgeFilename
		)

		// load bridge
	}

	/**
	 * unload module
	 * @param {Object} outputContext
	 */
	async unload(outputContext) {
		const { oc, o, margin } = this.#getOutput(outputContext)
	}

	/* ---- TTS module interface impl ---- */

	async speak(text, voice = null) {
	}

	async waitIdle(timeout) {
	}

	async shetUp() {
	}

	/* <---- ---- */

	#getOutput(outputContext) {
		const oc = outputContext || this.outputContext
		return {
			oc: oc,
			o: oc.output,
			margin: ' '.repeat(oc.margin + oc.marginBase)
		}
	}
}
