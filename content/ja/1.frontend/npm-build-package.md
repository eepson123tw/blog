---
title: 發布一個 npm 組件
description: NPM、Vue、Package publish
icon: 'lucide:package'
gitTalk: false
date: 2024-08-03 13:09:00
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> 發布一個 npm [組件](https://www.npmjs.com/package/@eepson123tw/canvas-meme)

一直希望能做公有組件並考慮上傳 npm ，

想了一個一直想做而且頗鬧的題目來實作😂

上傳圖片後可以轉化成文字顯示畫上 Canvas。

![npm](/images/npm/image.webp)

## 設立目標

想實作的方式，列下幾種必須達到的 Goal

- 必須透過 Vue3 Typescript 實作
- 必需使用自動化流程版號
- package.json 的各項值設定
- 簡單好玩的程式實作

## 遇到挑戰

實際上實作時卻發現...

### Typescript 環境設定

- 起初不熟悉 Typescript 各種 .json 的後綴檔案代表的意義，熟悉了一陣子，後來才理解 tsconfig.app.json 「app」 為代表管理的環境，app 為應用、node 為後端建構等等。並統一在 tsconfig.json 中參考，以便 Ts 編譯器可以知道使用的環境。

::code-group

```json [tsconfig.json]
{
  "references": [
    {
      "path": "./tsconfig.app.json" // [!code focus] 應用程式的 TypeScript 配置
    },
    {
      "path": "./tsconfig.node.json" // Node.js 環境的 TypeScript 配置
    },
    {
      "path": "./tsconfig.config.json" // 特定配置的 TypeScript 配置
    }
  ],
  "compilerOptions": {
    "allowSyntheticDefaultImports": true, // 允許合成默認導入
    "baseUrl": "./", // 基本路徑設置
    "declaration": true, // 生成宣告文件
    "declarationDir": "./dist/types", // 宣告文件的輸出目錄
    "esModuleInterop": true, // 允許 ES 模組互操作性
    "experimentalDecorators": true, // 啟用實驗性的裝飾器功能
    "importHelpers": true, // 引入幫助函數
    "isolatedModules": true, // 每個文件作為一個單獨的模組處理
    "jsx": "preserve", // 保留 JSX 語法
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"], // 使用的 TypeScript 標準庫
    "module": "esnext", // 模組格式
    "target": "esnext", // 編譯目標
    "moduleResolution": "node", // 模組解析策略
    "noUnusedLocals": true, // 不允許未使用的本地變量
    "noUnusedParameters": true, // 不允許未使用的參數
    "outDir": "dist", // 輸出目錄
    "paths": {
      "@/*": ["src/*"] // 路徑別名設置
    },
    "resolveJsonModule": true, // 允許導入 JSON 模組
    "sourceMap": true, // 生成 source map
    "strict": true, // 啟用所有嚴格的類型檢查選項
    "types": ["node", "vue"], // 包含的類型定義
    "useDefineForClassFields": true // 使用 `define` 關鍵字定義類字段
  },
  "exclude": [
    "node_modules", // 排除 node_modules 目錄
    "dist" // 排除 dist 目錄
  ]
}
```

```json [tsconfig.app.json]
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*", "src/**/*.vue"]
}
```

```json [tsconfig.node.json]
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

::

有些雷真的是踩過才知道😭

### bundler 的設定及輸出

本來以為打包只需要設定好輸出就好了吧，照著網路上的教學及文件，應該能簡單的上線😊，結果自己還是太年輕了。
要設定 package.json vite.config，有一個很重要的提醒

::alert{type="info"}
"author": "一定要是本人且正確", <== publish 快一小時懷疑人生的時候，發現改這個就過了👼
::

::code-group

```json [package.json]
{
  // 以上略
  "main": "dist/canvas-image.umd.js", // 主入口文件，使用 UMD 格式
  "module": "dist/canvas-image.es.js", // ES 模塊格式的入口文件
  "exports": { // 當用不同引入方式時文件的指向，做了這個之後才真的知道 npm 真的幫忙做了很多
    ".": {
      "import": "./dist/canvas-image.es.js", // 當使用 import 時的入口文件
      "require": "./dist/canvas-image.umd.js", // 當使用 require 時的入口文件
      "types": "./dist/types/index.d.ts" // 型別定義文件
    },
    "./dist/style.css": "./dist/style.css" // 對應 CSS 文件的路徑
  },
  "types": "./vue3-canvas-image.d.ts" // 預設型別定義文件的入口
}
```

```typescript [vite.config.ts]
export default defineConfig({
  plugins: [
    vue(), // Vue 插件，用於處理 Vue 文件
    dts({
      clearPureImport: true, // 清除純導入
    }),
  ],
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname, // 設置路徑別名，指向 src 目錄
    },
  },
  build: {
    cssCodeSplit: true, // 啟用 CSS 代碼分割
    sourcemap: true, // 生成 source map 文件
    emptyOutDir: true, // 構建時清空輸出目錄
    target: 'esnext', // 目標環境設置為 ESNext
    outDir: './dist', // 輸出目錄
    lib: {
      // 入口文件，可以是多個入口點的字典或數組
      entry: resolve(dirname(fileURLToPath(import.meta.url)), 'src/index.ts'),
      name: 'canvas-image', // 庫的全局名稱
      // 生成的文件名，根據格式附加相應的擴展名
      fileName: fileName => `${'canvas-image'}.${fileName}.js`,
    },
    rollupOptions: {
      // 確保將不應該打包進庫的依賴設置為外部化
      external: ['vue'],
      output: {
        // 為外部化的依賴提供全局變量，在 UMD 構建中使用
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
```

::

### npm 上版失敗

這真的是這次實作最痛最哭的部分，因為網路上的資源都寫 npm publish 就好，但實際是若啟用 auth 認證，就必須實作 git action 的 secrets token，然後要複製 .npmrc 指向路徑，並且要把 org 設置好，不然就會上板上到歪頭。

### release 版號問題

release 自動化也是，我猜考了 vue/core 的上版流程，使用 .husky pre-commit pre-push 作用如名，在 commit push 之前先去做我寫好的指令。

- pre-commit 檢查 commit 是否有按照規則
- pre-push 執行 auto update release version

### github actions yml 的撰寫

因為之前就有在寫類似的 pipeline 倒是簡單的參考一下別下的 CI/CD，

## 學習結論

實際走過一次流程後發現，做自己的第三方插件好像也沒那麼難，而且看到下載量真的有點嚇到的感覺，想說只是跑個流程的專案居然有 500 下載量，但星星倒是沒人按哈哈哈哈哈，
之後會真的想想實際的需求後再繼續我的插件之旅～寫個後端相關的好像也可以👍
