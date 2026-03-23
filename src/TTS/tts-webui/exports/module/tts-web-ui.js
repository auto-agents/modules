export default class TTSWebUI {

	constructor(ctx, config, outputContext, moduleSpec) {
		this.config = config
		this.specification = moduleSpec
		this.ctx = ctx
		this.outputContext = outputContext
	}

	/**
	 * module init
	 */
	async init() {
		const { oc, o, margin } = this.#getOutput(outputContext)
	}

	/**
	 * unload module
	 * @param {Object} outputContext
	 */
	async unload(outputContext) {
		const { oc, o, margin } = this.#getOutput(outputContext)
	}

	#getOutput(outputContext) {
		const oc = outputContext || this.outputContext
		return {
			oc: oc,
			o: oc.output,
			margin: ' '.repeat(oc.margin + oc.marginBase)
		}
	}
}
