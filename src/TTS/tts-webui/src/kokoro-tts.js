import { Client } from "@gradio/client";
import { saveToTemp, toJson } from "../../../../../shared/src/utils/utils";

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
        //console.log(this.apiConfig)

        text = 'hello my friend,'
        //console.log(text)

        const client = await Client.connect(this.baseUrl)
        const result = await client.predict(
            this.apiConfig.paths.speak.uri,
            {
                text: text,
                voice: "af_heart",
                speed: 1,
                use_gpu: true,
                model_name: "hexgrad/Kokoro-82M",
                seed: 2044339735,
            });
        saveToTemp(this.ctx, 'tts.json', toJson(result))
        //console.log('result:', result.data)
        const filepath = result.data[0].path
        await this.config.playSoundFunc(filepath)
    }

    async waitIdle(timeout) {
    }

    async shetUp() {
    }

    getPreferredVoices(preferredVoices) {
    }

    /* <---- ---- */
}
