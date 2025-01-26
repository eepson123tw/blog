---
title: ESM 模組原理
description: ESM 模組化開發
icon: 'lucide:code'
---

ESM 模組是一種在 JavaScript 中進行模組化開發的標準。它允許開發者將程式碼分割成多個模組，並且可以在需要的地方引入這些模組。ESM 模組使用 `import` 和 `export` 關鍵字來定義和使用模組。

ESM 模組的重點：

- 可组合性與隔離性:提供了更好的程式碼組織和管理方式
- 重用性:支援模組的重複使用和共享
- 支援模組的動態加載和異步載入

## Commonjs 原理

我們可以透過 Webpack 來理解 Commonjs 是如何封裝的，簡單的來說每個模組都是一個物件

::code-group

```js [index.js]
console.log('start require');
let module = require('./module');
console.log('end require', module);
// module.js 知識點1
console.log(module.tencent);

// module.js 知識點2
module.additional = 'test';
```

```js [module.js]
console.log('this is a module');

exports.app = { hello: 'haha' };

exports.tencent = function () {
  console.log('good');
};

// 知識點1：對module.exports賦值，exports物件就不再是外部require所得到的結果了。
// 我在視頻中採用的說法是「覆蓋exports」其實不算非常嚴謹。
// 因為exports變數本身還是存在的
module.exports = function () {
  console.log('hello app');
};

// 知識點2：外部取得require呼叫的結果和這裡的exports物件是同一個引用
setTimeout(() => {
  // 驗證index.js裡加的additional屬性是否生效
  // 用於確定外部require到的物件和此處的exports是否是同一個屬性
  console.log(exports);
}, 2000);
```

```js [webpack.js]
/******/ (() => {
  // webpackBootstrap
  /******/ let __webpack_modules__ = {
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
  /******/ let __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ let cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ let module = (__webpack_module_cache__[moduleId] = {
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
  let __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    /*! ******************!*\
  !*** ./index.js ***!
  \******************/
    console.log('start require');
    let module = __webpack_require__(/*! ./module */ './module.js');
    console.log('end require', module);
    console.log(module.tencent);
    module.additional = 'test';
  })();

  /******/
})();
```

::

## ESM 原理

ESM（ECMAScript 模組）是一種在 JavaScript 中用於模組化程式碼的標準。

主要有以下步驟：

1. 構造 - 查找、下載並解析所有文件，並將它們記錄在一個模塊記錄表(module map)中。
2. 實例化 - 在內存中找到一塊區域來存儲所有導出的變量，並建立導出屬性的依賴關係。然後將 export 和 import 都指向這些內存塊。這個過程稱為鏈接(linking)。
3. 賦值 - 執行代碼，將真實的值添加到內存塊中。

### 構造

1. 模塊解析
2. 獲取文件(URL、filesystem load)
3. 將文件解析成紀錄

::alert{type="success" icon="lucide:lightbulb"}
此部分會巢狀的解析相依的模組文件，一層一層的找下去。若文件相依的模組過多，那 main thread 勢必會被加載阻塞。
::

ES 模組規範將遞歸查找算法分為多個階段。並將構造過程單獨分離出來，使得瀏覽器在執行同步的初始化過程前可以自行下載文件並建立自己對於模組圖的路徑。

不過，需要注意一件事——這兩個圖中的任何模組都將共用一個模組實例。這是因為載入器快取了模組實例。對於特定全域範圍內的每個模組，只有一個模組實例。

[dynamic_import_graph](https://hacks.mozilla.org/files/2018/03/14dynamic_import_graph.png)

透過 module map 緩存路徑，若有重複的模組需要被載入時，瀏覽器就可以知道並跳過此載入流程><!

#### 解析

在瀏覽器環境中，可以透過添加 'type=module' 來告知瀏覽器此引入為 module，而在 node 環境中可以透過加入 .mjs 拓展，或是在 package.json 中加入 type 告知並通知加載器。

[module_record](https://hacks.mozilla.org/files/2018/03/05_module_record.png)

### 實例化

使用深度優先後序遍歷（depth first post-order traversal）將模組連接到記憶體中，建構模組環境記錄(實例化)。
模組環境記錄管理著模組記錄對應的變數。同時，它為所有的導出變數分配內存空間。模組環境記錄會追蹤不同內存區域與不同導出變數之間的關聯關係。
這些內存區域在此階段還沒有被賦值。`只有在求值之後，它們才會獲得真正的值`。需要注意的是，任何導出的函數聲明都在此階段初始化，這使得求值過程更加容易。

### 賦值

1. 模塊初始化：JavaScript 引擎首先將代碼中的變量和函數分配記憶體空間。
2. 代碼評估：評估代碼可能引起副作用，例如發送網絡請求。模塊只被評估一次，以避免重複引起副作用。
3. 模塊映射：通過模塊的標準URL進行緩存，保證每個模塊只執行一次。
4. 處理循環依賴：ES 模塊設計支持循環依賴。即使在循環依賴中，模塊也能正確地讀取到最終的變量值，使用 `live binding`。

## 總結

::alert{type="success" icon="lucide:lightbulb"}
require 會同步解析，而 import 會在執行程式碼之前就會有預解析，可以更方便的執行 tree-shacking 及 分析載入點 .etc
::

CommonJS 模組同步加載，這意味著它們會阻止程式碼的執行，直到模組完全加載並執行。
而 ESM 加載分了好幾個步驟，加載模組，然後深度優先遍歷生成 export、import、加載模組 URL 等資訊形成的一個模組表，最後返回模組的值。而這些步驟之間是異步進行的，

## 參考資料

- [Node.js - 高级篇](https://www.yuque.com/haixueyewupingtaibuqianduanchengchangjihua/tk9sk4/myx1nzzfwhd8nb6w#wuSdV)
- [es-modules-a-cartoon-deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
- [module-map](https://html.spec.whatwg.org/multipage/webappapis.html#module-map)
