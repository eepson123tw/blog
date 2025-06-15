---
title: Day 1 啟程
description: 學習 React 框架
icon: 'lucide:anchor'
gitTalk: false
date: 2023-04-17 22:54:13
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> 學習React框架 - 001 Day 啟程

::alert{type="example" icon="lucide:lightbulb"}

大部分資料擷取至網路及筆者參加的一些現下聚會的節錄,將透過 Vue 的一些共通框架理念去理解 React 框架,若有理解錯誤的點,請盡量指點我XD

::

## React 為何而生

前端的歷史進程,不斷膨脹的web服務及複雜的業務邏輯,若使用 jQuery 及原生 js 開發,將使得工程師們不堪重負,維護到後面往往都在寫世界奇觀,我們需要更簡化的方式,降低心智負擔及程式撰寫複雜度,而 React 就是在這個環境下誕生。

## React核心思考

藉由資料來描述狀態,將視圖成為應用程序狀態的函數。(React 的核心前提是 UI 只是將數據投影為不同形式的數據。**相同的輸入給出相同的輸出**。一個簡單的純函數。)

```js
v = f(s);
```

開發者們只需注意狀態的變化,而其他交給 React 處理.

## 關注點的分離

傳統開發上,開發者將 HTML+CSS+JS 組合並開發出網頁服務,但每個部分都是個別獨立的,有可能有些人會說,HTML 會引入 CSS 及 JS,怎麼能說他們獨立呢?
>但你總不會在 CSS 裡面寫 JS 語法吧@@

而在 React 中,任何對渲染視圖有關的事情——無論是狀態、UI,在某些情況下,甚至是樣式,都是它關注的一部分。所以 React 的組件中,常常可以看見,一個文檔中有 HTML+JS 的組合,因為關注點不同。但該如何去實現這種多樣的類型組合呢?

## 用 JSX 來建構組件

React 使用了一種有趣的實現,通過編譯器來將一個文檔結合 HTML+JS,將業務邏輯(JS)及頁面骨架(HTML)組合起來。

```jsx
import ReactDOM from 'https://esm.sh/react-dom@18';
import React from 'https://esm.sh/react@18';

function App() {
  return (
    <div className="box">
      <h1>The React 001</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
```

[React 001 範例](https://codepen.io/eepson123tw/pen/VwEjMrR)

範例中可以簡單了解到,我們在 HTML 中只提供了進入點,而 React 卻能透過函式長出我們需要的其餘部分。

::alert{type="success" icon="lucide:lightbulb"}
JSX 是 JavaScript 的語法擴展,可在 JavaScript 文件中編寫類似 HTML 的標記。儘管還有其他方式來編寫組件,但大多數 React 開發人員更喜歡 JSX 的簡潔性,並且大多數代碼庫都使用它。
--- 擷取至官網

而這樣子的組件是React應用程序的基本構建塊,可以看作是一個獨立的代碼單元,具有特定的功能和表現形式。而小塊的組件之間可以相互嵌套,形成複雜的UI結構。
::

## Babel( React 背後的好夥伴)

為什麼 React 可以透過一個 jsx 就能長出我們想要的頁面格式呢?Babel 就是幕後的大大了~

Babel 作為一個 JavaScript 編譯器,可以將新版本的 JavaScript 代碼轉換並向後兼容舊版本的語法,以確保代碼可以在不同環境下(瀏覽器的實現進程不同,你可能會遇到神奇的錯誤XD)可以順利運行。

> <span style="color:red"> React 的 JSX 語法,正是透過Babel將JSX轉為普通 JavaScript 的方式。通過 Babel 的 plugin,React 可使用最新的 JavaScript 語法,同時確保這些代碼可以在不同環境中正常工作。</span>

可以看到透過 Babel,我們的[React JSX](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=MYewdgzgLgBAggBwTAvDAFASlQPhgbwCgYYAnAUygFdSwNiSYAeAEwEsA3GYAGwEMIEAHJ8AtuRQAiAEYgAHpJwNGzABYBGHABVV5GACVyfYLAAMp9UwD0GpSuvsOdmJgDchAL6ugA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-0%2Cstage-2&prettier=false&targets=&version=7.21.4&externalPlugins=&assumptions=%7B%7D)被編譯成了一個JS文件。

## 結論

第一天了解 React 框架的背景、核心思想、JSX語法與Babel編譯器的協作關係後,我們將更深入地了解 React 框架的一些關鍵概念。React 是一個基於組件的框架,組件是應用程序的基本構建塊。在 React 中,我們需要了解組件之間如何傳遞參數以及如何實例化組件。參數傳遞通常使用 props（屬性）進行,實例化可以使用 React.createElement() 函數或 JSX 語法。掌握這些基本概念可以讓我們更好地開發高質量、高效的 React 應用程序。

## 參考資料

- [可視化的理解React](https://react.gg/visualized#history-of-the-web)
- [React官方文件](https://react.dev/)
- [React Basic](https://github.com/reactjs/react-basic)
- [Build your own React](https://pomb.us/build-your-own-react/)
