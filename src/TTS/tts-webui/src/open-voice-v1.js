import BridgeTTSBase from "./bridge-tts-base";

export default class OpenVoiceV1Bridge extends BridgeTTSBase {

    referenceAudioPath = null
    referenceAudio = null

    /**
     * new instance
     * @param {Object} ctx context
     * @param {Object} config module config
     * @param {Object} apiConfig api config
     * @param {String} baseUrl base url
     */
    constructor(ctx, config, apiConfig, baseUrl) {
        super(ctx, config, apiConfig, baseUrl)
    }

    /* ---- TTS module interface impl ---- */

    async speak(text, voice = null) {
        await super.speak(text, voice)
    }

    getSpeakParameters(tx, agentPars, pars, voice) {
        return {
            text: tx,
            voice:
                this.getPreferredVoices(
                    this.config.agent.speak.preferredVoices)
                || pars.voice.default,
            style:
                agentPars.style
                || pars.style.default,
            reference_audio: '',
            seed:
                agentPars.seed
                || pars.seed.default,
            api_name: pars.api_name
        };
    }

    async waitIdle(timeout) {
    }

    async shetUp() {
    }

    /* <---- ---- */
}
