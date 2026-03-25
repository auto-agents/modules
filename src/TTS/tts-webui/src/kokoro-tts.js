export default class KokoroTTSBridge {

    /**
     * new instance
     * @param {Object} ctx context
     * @param {Object} config module config
     * @param {Object} apiConfig api config
     * @param {String} baseUrl base url
     */
    constructor(ctx, config, apiConfig, baseUrl) {
        this.ctx = ctx
        this.config = config
        this.apiConfig = apiConfig
        this.baseUrl = baseUrl
    }

    /* ---- TTS module interface impl ---- */

    async speak(text, voice = null) {
    }

    async waitIdle(timeout) {
    }

    async shetUp() {
    }

    getPreferredVoices(preferredVoices) {
    }

    /* <---- ---- */
}
