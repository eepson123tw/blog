---
title: ESM Module Principles
description: ESM modular development
icon: 'lucide:code'
gitTalk: false
date: 2024-03-14 12:25:00
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

ESM modules are a standard for modular development in JavaScript. They allow developers to split code into multiple modules and import these modules where needed. ESM modules use the `import` and `export` keywords to define and use modules.

Key features of ESM modules:

- Composability and isolation: Provides better code organization and management
- Reusability: Supports module reuse and sharing
- Supports dynamic loading and asynchronous loading of modules

## CommonJS Principles

We can understand how CommonJS is encapsulated through Webpack. Simply put, each module is an object.

::code-group

```js [index.js]
console.log('start require');
const module = require('./module');
console.log('end require', module);
// module.js knowledge point 1
console.log(module.tencent);

// module.js knowledge point 2
module.additional = 'test';
```

```js [module.js]
console.log('this is a module');

exports.app = { hello: 'haha' };

exports.tencent = function () {
  console.log('good');
};

// Knowledge point 1: When assigning to module.exports, the exports object is no longer the result obtained by external require.
// The explanation I used in the video as "overriding exports" is not entirely precise.
// Because the exports variable itself still exists
module.exports = function () {
  console.log('hello app');
};

// Knowledge point 2: The external require call result and the exports object here are the same reference
setTimeout(() => {
  // Verify whether the additional property added in index.js takes effect
  // Used to determine whether the object required externally and the exports here are the same property
  console.log(exports);
}, 2000);
```

```js [webpack.js]
/******/ (() => {
  // webpackBootstrap
  /******/ const __webpack_modules__ = {
    /***/ './module.js':
    /*! ****************!*\
  !*** ./module.js ***!
  \****************/
    /***/ (module, exports) => {
      console.log('this is module');
      exports.app = { hello: 'haha' };
      exports.tencent = function () {
        console.log('good');
      };
      module.exports = function () {
        console.log('hello app');
      };
      setTimeout(() => {
        console.log(exports);
      }, 2000);

      /***/
    },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ const __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ const cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ const module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  const __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    /*! ******************!*\
  !*** ./index.js ***!
  \******************/
    console.log('start require');
    const module = __webpack_require__(/*! ./module */ './module.js');
    console.log('end require', module);
    console.log(module.tencent);
    module.additional = 'test';
  })();

  /******/
})();
```

::

## ESM Principles

ESM (ECMAScript Modules) is a standard for modularizing code in JavaScript.

There are three main steps:

1. Construction - Find, download, and parse all files, recording them in a module map.
2. Instantiation - Find memory areas to store all exported variables and establish dependency relationships for exported properties. Then point both exports and imports to these memory blocks. This process is called linking.
3. Evaluation - Execute code and add actual values to the memory blocks.

### Construction

1. Module resolution
2. File fetching (URL, filesystem load)
3. Parsing files into records

::alert{type="success" icon="lucide:lightbulb"}
This part will recursively parse dependent module files, searching layer by layer. If a file depends on too many modules, the main thread will inevitably be blocked by loading.
::

The ES module specification separates the recursive search algorithm into multiple phases. It separates the construction process so that browsers can download files and build their own paths to the module graph before executing the synchronous initialization process.

However, one thing to note is that any modules in both graphs will share the same module instance. This is because the loader caches module instances. For each module within a specific global scope, there is only one module instance.

[dynamic_import_graph](https://hacks.mozilla.org/files/2018/03/14dynamic_import_graph.png)

Through module map caching paths, when duplicate modules need to be loaded, the browser can know and skip this loading process!

#### Parsing

In browser environments, you can tell the browser that this import is a module by adding 'type=module'. In Node environments, you can add .mjs extension or add type in package.json to notify the loader.

[module_record](https://hacks.mozilla.org/files/2018/03/05_module_record.png)

### Instantiation

Uses depth-first post-order traversal to link modules to memory and construct module environment records (instantiation).
The module environment record manages variables corresponding to module records. At the same time, it allocates memory space for all exported variables. The module environment record tracks the association between different memory areas and different exported variables.
These memory areas are not yet assigned values at this stage. `They only get actual values after evaluation`. Note that any exported function declarations are initialized at this stage, making the evaluation process easier.

### Evaluation

1. Module initialization: The JavaScript engine first allocates memory space for variables and functions in the code.
2. Code evaluation: Evaluating code may cause side effects, such as sending network requests. Modules are only evaluated once to avoid repeated side effects.
3. Module mapping: Cached through the module's canonical URL, ensuring each module executes only once.
4. Handling circular dependencies: ES modules are designed to support circular dependencies. Even in circular dependencies, modules can correctly read the final variable values using `live binding`.

## Summary

::alert{type="success" icon="lucide:lightbulb"}
require synchronously resolves, while import has pre-parsing before executing code, making it easier to perform tree-shaking and analyze loading points, etc.
::

CommonJS modules load synchronously, meaning they block code execution until the module is fully loaded and executed.
ESM loading is divided into several steps: loading modules, then depth-first traversal to generate export, import, module URL and other information forming a module table, and finally returning module values. These steps are performed asynchronously.

## References

- [Node.js - Advanced](https://www.yuque.com/haixueyewupingtaibuqianduanchengchangjihua/tk9sk4/myx1nzzfwhd8nb6w#wuSdV)
- [ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
- [Module Map](https://html.spec.whatwg.org/multipage/webappapis.html#module-map)
