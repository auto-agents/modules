# Speech module model

## definitions

The speech module is a stand-alone service accessible throught a `HTTP` interface. It provides speech-to-text capabilities. It can be used by any agent and by the cli tool to convert speech to text.

## implementation

The speech functionalities is provided by any browser that implements the Web Speech API.

The module first runs an http server running a web api that listen to http requests, according to the interface REST specifications. The module is based on the NodeJS runtime environment and javascsript. The http server is implemented by the `express` framework. Once the server is ready, the module opens a browser window that runs a web application that provides speech-to-text capabilities. The web application is implemented by the `web speech api`. The web application contains a single page (SPA) that provides a simple interface to the user to shows the speech-to-text api, running status and current activity. The running status is one of the follwing:
```json
{
    "runningStatus": "idle" | "speaking"
}
```
Where:
- **idle** : the module is not speaking and is waiting for a new command through the web api
- **speaking** : the module is speaking until it has finished the given sentence to be speaked or if it has an error or if it received a `stop` command through the web api or if it receive a new `speak' command through the web api

The web api REST interface is defined as below:
- possible commands are:
    - POST /speak : speak the given sentence with payload:
    ```json
    {
        "sentence": "the sentence to be speaked",
        "voice": "name of the voice to be used by the web speecj api",
        "apiKey": "the api key that must match the one defined in the module configuration"
    }
    ```
    - POST /stop : stop the current speek if any and go back to idle state, else stay in the idle state
    - GET /status : get the current running status. returns a JSON object like structured like below:
    ```json
    {
        "runningStatus": "idle" | "speaking"
    }
    ```
    - GET /capabilities : returns informations about the availables voices that are provided by the web speech api implemented by the running browser. returns a JSON object structured like below:
    ```json
    {
        "voiceList": [ /* array of voiceDescription objects */]
    }
    ```
    the `voiceDescription` object is defined as below:
    ```json
    {
        "name": "the name of the voice",
        "lang": "the language of the voice using ISO 639-2 language code or ISO 639-1 language code or the string 'multilingual' if the voice support multiple languages"
    }
    ```

    ## configuration

    Any module configuration is stored in a json file. The module configuration file is defined in the file `src/config/config.json`. It has at least the properties as described below:
    ```json
    {
        "apiKey": "the api key that must match the one defined in the module configuration",        
        "port": "the port on which the http server runs",
        "browsers": {
            /* json objects for each configured browser */
            "chrome": {
                "runCommand": "the sell command that runs the browser and opens the web application",
                "preferredVoices": [ /* array of names of preferred voices the user want to be used when no voice is specified */ ]        
            },
            "edge": {
                "runCommand": "the sell command that runs the browser and opens the web application",
                "preferredVoices": [ /* array of names of preferred voices the user want to be used when no voice is specified */ ]
            }
        
    }
    ```

    
