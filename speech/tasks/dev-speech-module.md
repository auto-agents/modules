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

### 4) fix errors

```shell
TypeError [ERR_IMPORT_ATTRIBUTE_MISSING]: Module "file:///E:/DEV/repos/auto-agents/modules/speech/src/config/config.json" needs an import attribute of "type: json"
    at validateAttributes (node:internal/modules/esm/assert:88:15)
    at defaultLoadSync (node:internal/modules/esm/load:164:3)
    at #loadAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:795:12)
    at #loadSync (node:internal/modules/esm/loader:815:49)
    at ModuleLoader.load (node:internal/modules/esm/loader:780:26)
    at ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:526:31)
    at #getOrCreateModuleJobAfterResolve (node:internal/modules/esm/loader:571:36)
    at afterResolve (node:internal/modules/esm/loader:624:52)
    at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:630:12)
    at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:649:32) {
  code: 'ERR_IMPORT_ATTRIBUTE_MISSING'
}
```

```shell
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from E:\DEV\repos\auto-agents\modules\speech\src\backend\server.js
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)
    at packageResolve (node:internal/modules/esm/resolve:768:81)
    at moduleResolve (node:internal/modules/esm/resolve:858:18)
    at defaultResolve (node:internal/modules/esm/resolve:990:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:718:20)
    at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:735:38)
    at ModuleLoader.resolveSync (node:internal/modules/esm/loader:764:52)
    at #resolve (node:internal/modules/esm/loader:700:17)
    at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:620:35)
    at ModuleJob.syncLink (node:internal/modules/esm/module_job:143:33) {
  code: 'ERR_MODULE_NOT_FOUND'
}
```

