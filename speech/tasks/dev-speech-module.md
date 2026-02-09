# Develop speech module

## base implementation

### 1) check specification

```text
describe an implementation of the speech module
```

### 2) implement the module

```text
implements the speech module in folder `modules/speech/` according to the specifications and guidelines in the files `modules/speech/specifications/speech-module-model.md` and `modules/speech/doc/implementation.md`
```

### 3) iterations: specification and implementation fixes

```text
i have fixed the specification file `modules/speech/specifications/speech-module-model.md` according to your guidelines in `modules/speech/doc/implementation.md`. fix the guidelines in `modules/speech/doc/implementation.md` to match the specification file.

Add in config.json a 'browser' parameter (default edge) and update code to choose runCommand/preferredVoices based on it. fix the specification and the guidelines accordingly

Add a test program in `modules/speech/src/test.js` that launch the module and call the web api to speak the sentence 'hello world'

test test.js must first get the available voices list and select the first one to pass as a parameter to the speak web api call
```


*👉 this task should requires using model **GPT-2.5 low reasoning***

step 1) is  saved into doc/implementation.md
