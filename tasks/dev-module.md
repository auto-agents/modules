# build an ingtegrable module for auto-agents/cli

## Overview

This document describes how to implement a new module that can be integrated by the CLI tool in `auto-agents/cli` according to the module model specification. Modules are dynamically loadable extenions by the CLI application.

## Module Structure

A module is defined by three main components:

1. **Module Definition** - Configuration in `config/config.js` in property `modules`
2. **Module Implementation** - JavaScript class in `modules/` directory
3. **Module Registration** - Automatic discovery by the command controller in `auto-agents/cli/source/controllers/module-controller.js`

## Implementation Steps

## Step 1 : Create the module specification

- A module is specified by `js properties` in the file `config/config.js` in the property `modules` 
- the module specification object is defined as follows:

Use existing models of command specifications from the file `auto-agents/cli/source/config/config.js` in property `cli.modules`

In this document, `ctx` and `this.ctx` refers to the content of the js object specified in `config.js` that is returned by the function `config(cli)`

Add your command definition to the `cli.modules` object in `module/config/config.js` as follows:

```js
modules: {
    moduleId: {        
        description: 'the description of the module',
        file: 'the file name that implements the module. by example: my-module.js',
        // indicates if the module is loaded internally at any time when the cli needs it (default is false)
        autoLoad: true,
        // indicates if the module must be loaded automatically or not at cli startup
        enabled: true,
        // indicates if the module has been loaded by the cli
        isLoaded: false,
        // indicates if the module can be loaded by user or not. if it is internal only the cli can load it depdendings on his needs
        internal: false,

        // here any property required for the module configuration
    }
}
```

### Step 2: Implement the Module Class

- a module file is stored in the `/modules` folder

Create a default export class that follows this structure:

**Class Naming Convention:**
- Remove `.js` extension from filename
- Remove hyphens (`-`)
- Capitalize the first letter after each removed hyphen
- Example: `my-module-module.js` → `MyModuleModule`

```js
export default class MyModule {

    constructor(ctx, config, outputContext, moduleSpec)
        this.moduleSpec = moduleSpec
        this.ctx = ctx
    }

    /**
     * module init
     */
    async init() {
        // depends on each module
    }

    /**
     * unload module
     * @param {Object} outputContext 
     */
    async unload(outputContext) {
        const oc = outputContext || this.outputContext
        const o = oc.output
        const margin = ' '.repeat(oc.margin + oc.marginBase)

        // include this comment as an implementation example for further devevelopment
        /*
        const stopSrv = async () => {
            this.ctx.components.module.AIAgent = null
        }

        o.newLine()
        const stopSrvAction = new ActionController(
            this.ctx,
            o,
            stopSrv,
            new SpinnerService(this.ctx, o)
                .newSpinner(margin + '- stopping module <module_name>: ' + this.moduleSpec.moduleId, cliSpinners.sand)
        )
        await stopSrvAction.run()        
        */
    }

```