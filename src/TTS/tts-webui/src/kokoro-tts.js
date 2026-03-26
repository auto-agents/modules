import { Client } from "@gradio/client";
import { saveToTemp, toJson } from "../../../../../shared/src/utils/utils";
import SpeakerError from "../../../../../shared/src/data/speaker-error";
import { splitSentence } from "../../../../../shared/src/utils/text";
import { FifoStack, task } from "../../../../../shared/src/utils/fifo-stack";

export default class KokoroTTSBridge {

    stackRunning = false

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
        this.speakStack = new FifoStack('kokoro tts stack', ctx, [], false)
    }

    /* ---- TTS module interface impl ---- */

    async speak(text, voice = null) {

        if (!this.stackRunning) {
            const runStack = async () => {
                await this.speakStack.processTaskes()
            }
            setTimeout(
                runStack,
                100)
            this.stackRunning = true
            console.log(this.apiConfig)
        }

        try {
            const t = splitSentence(this.ctx, text)
            for (var i = 0; i < t.length; i++) {

                const tx = t[i]
                if (this.ctx.dialoger.sentenceSpliter.dumpSplits)
                    console.log(tx)

                const client = await Client.connect(this.baseUrl)
                const result = await client.predict(
                    this.apiConfig.paths.speak.uri,
                    {
                        text: tx,
                        voice: "af_heart",
                        speed: 1,
                        use_gpu: true,
                        model_name: "hexgrad/Kokoro-82M",
                        seed: 2044339735,
                    });
                saveToTemp(this.ctx, 'tts.json', toJson(result))
                const filepath = result.data[0].path

                this.speakStack.addTask(
                    task(
                        'kokoro-tts: speak',
                        async () => await this.config.playSoundFunc(filepath)
                    ))
            }
        } catch (err) {
            throw SpeakerError.fromErr('speak fail', err)
        }
    }

    async waitIdle(timeout) {
    }

    async shetUp() {
    }

    getPreferredVoices(preferredVoices) {
    }

    /* <---- ---- */
}
