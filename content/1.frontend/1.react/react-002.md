---
title: Day 2 組件傳參
description: 學習 React 框架
icon: 'lucide:angry'
gitTalk: false
date: 2023-04-18 23:31:13
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> 學習React框架 - 002 Day 組件生成與參數傳遞

## 組件

組件這個詞彙，在前端以往的開發歷程中，通常以頁面區分，但不同的頁面上有相同的功能或顯示區塊時，我們可能會重複的寫著相同的程式碼，或是直接 copy & past.
> 隨著框架思維的日益成熟，「組件」這個想法出現，在 React Basic 一文中，希望 React 具有可變性、抽象性、組合性、及狀態保持，以幫助開發者分攤日益複雜的需求及邏輯。

希望有一個思維模型能包含這些概念，而在歷史中，Js 的代碼遷移由傳統的 OOP 開發模型，轉換到了Fn的函式開發架構，React 組件也經歷過這些過程，Version16 以前由 oop 的模式為主，Version18 後，受到了函式的洗禮，所以組件也的型態也簡化成了 Fn 的樣態。也就是前一天的範例，我們宣告了一個 function，讓 React 透過編譯器 babel 生成我們想要的頁面區塊。

那 React 跟 Babel 又是透過那些方式將這些組件，注入到頁面上呢?

## 組件組合及生成

```js [app.jsx] icon=lucide:code-xml line-numbers
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

::alert{type="warning" icon="lucide:eraser"}
組件的名稱必須以大寫字母開頭
::

可以看到我們定義了兩個函式組件，Gallery 中又調用了 Profile，來形成頁面架構。
React組件經[編譯](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABABQE52DANgUwBQCUiA3gFCKKo5QipJ7kWIA8MAtgOaNOIDOqEALwAiABZQoAB14AuAPRyYAOnYdaSiHDZyAsgGkAzDgDqBgIK8lAK0kdh3JgEMsUEXsdRROVDDA5EAFJwomC8CPY8cgB8jAQA3KQAvqSkOAAeknCoUIgAJjjAjiAuiKCQsAiIAOLOuKgAnoQkjFQ0dIgMPMy8ONDwYDE8FMyiAIxRZmyOAF6-HHwQMDhgsLxQvMxyY4NDzGgY2P7RDsP7mLiIx0MsZ4eXO8NyPX0IO_FJQA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=env%2Creact%2Cstage-0%2Cflow&prettier=true&targets=&version=7.21.4&externalPlugins=&assumptions=%7B%7D)，最後會轉換成下方代碼注入到頁面上。

```javascript
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>;
```

### React.createElement

JSX 組件在編譯的過程中透過 createElement methods，創建出了[**虛擬DOM**抽象](https://codepen.io/eepson123tw/pen/XWxjXGj?editors=1111)。
簡單來說就是每個組件函式都是一層封裝，其實底層還是 js 的型態。我們會透過 Render 轉換成真正的 Dom 並注入[DOM樹](/view/frontend/dom.md)中。

### React.Render

用於將虛擬 DOM 渲染到實際的 DOM 上。

ReactDOM.render() 方法有兩個參數：

第一個參數是需要渲染的虛擬 DOM 元素。
第二個參數是一個 DOM 元素，表示要將虛擬 DOM 渲染到哪個容器中。
例如，以下代碼將一個包含文本「Hello, world!」的 h1 元素渲染到具有 id 屬性為 root 的 DOM 元素中：

```javascript
// element只是抽象結構
const element = {
  type: 'h1',
  props: {
    title: 'foo',
    children: 'Hello',
  },
};
ReactDOM.render(element, document.getElementById('root'));
```

當代碼執行到 ReactDOM.render() 方法時，React 會將虛擬 DOM 轉換為實際的 DOM，並將其插入到 root 元素中。
參考[hello2](https://codepen.io/eepson123tw/pen/XWxjXGj?editors=1111)

> **render簡化版本如下**

```javascript
function render(element, container) {
  // 我們將createElement 的 虛擬dom object結構傳下來,若為非文本結構就創造節點
  const dom = element.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(element.type);

  // 將虛擬dom屬性重現
  const isProperty = key => key !== 'children';
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  // 輸入點(root)創建出節點
  container.appendChild(dom);

  // 若還有虛擬DOM上還有下一層子結構，則遞迴的調用Render本身，達到層級渲染的DOM
  if (element.props.children) {
    element.props.children.forEach((child) => {
      render(child, dom);
    });
  }
}
// 再封裝一層抽象 將 root 隱式的封裝在 render中
function ReactDOMRender(element, container) {
  const root = {
    dom: container,
    children: []
  };
  render(element, container);
}

ReactDOM.render = ReactDOMRender;
```

### 虛擬DOM

虛擬 DOM（Virtual DOM）是一個程式概念，它將整個網頁以樹狀結構的物件表示，每個節點對應著網頁上的一個 DOM 元素。React 廣泛地使用虛擬 DOM，它可以快速計算出需要更新的部分，只更新這些部分，而不需要重新渲染整個頁面，從而提高性能和效率。

## 參數傳遞 Props

就如我們可以傳遞參數進入函式一般，組件也接受參數傳遞至內部，但必須透過嚴謹的方式傳遞，每個父組件都可以通過 props 將一些信息傳遞給它的子組件。 Props 可傳遞任何 JavaScript 值，包括物件、數組和函數。

[範例](https://codepen.io/eepson123tw/pen/JjmNPvR)

範例中我們可以透過解構將傳遞的props物件中的屬性給全部解構出來。但必須注意這種使用方式，這會傳遞所有的值。

::alert{type="warning" icon="lucide:accessibility"}

- Props.children 是一個特殊的屬性，並非我們定義的由父層傳遞下來的屬性，可視為具有可由其父組件填充的佔位符.
- 當組件需要更改其 props 時，必須傳遞新的值，因為必須維持不可變性!不要在組件中改變props，以免發生不可預期的錯誤!!
::

## 結論

我們理解了組件是如何生成，並且透過那些方法實現並渲染在頁面上，如何傳遞參數給下一層的組件，**我們必須維持參數的不可變性**，以免發生錯誤。
發現還有 children 屬性，可以更方便的建構出頁面，並且能使用解構的方式，將複雜的物件結構傳遞至下方組件，但必須清楚的明白為何使用，而不是單方面的為了偷懶...

## 參考資料

- [可視化的理解React](https://react.gg/visualized#history-of-the-web)
- [React官方文件](https://react.dev/)
- [React Basic](https://github.com/reactjs/react-basic)
- [Build your own React](https://pomb.us/build-your-own-react/)
