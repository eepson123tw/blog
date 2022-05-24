---
title: 我們真的了解DOM嗎?
date: 2022-05-23 00:24:28
tags: [javascript,document]
categories: [javascript]
---
Dom到底是甚麼呢?
其實Dom是一個[定義](https://www.w3.org/TR/WebIDL/)，是由W3C WebIDL 所規定，宿主瀏覽器應用程式按此定義實現(底層為C++)，
並且是一種資料結構，存在於[WebKit][1]的記憶體中。
---
## 瀏覽器如何實現Dom

之前提到DOM是存在於Webkit記憶體中的，而具體操作可以簡略成下圖
![內部關係圖](/images/dom/內部關係圖.png)


## 映射物件和V8binding

而瀏覽器透過內部引擎與WebKit(dom)進行綁定(v8 binding)，建立出一個可以在記憶體中訪問到的 **映射物件(wrapper object)** 。

![binding](/images/dom/bindingV8.png)

v8與dom的[詳細實現](https://www.jianshu.com/p/53de5e4deb43)，而我們日常開發中在devtools看到畫面並不是dom，而是**渲染樹**，是DOM和CSSOM的組合。

```javascript
// 前兩行執行後， v8 dom wrapper 與 c++ DOM 的綁定關係就完成
var div = document.createElement('div')
div.innerHTML = '<p><span>foo</span></p>'
// 測試下面程式碼
div.xxx = 123
document.body.appendChild(div)
div = null
document.body.lastChild.xxx // 123
```
透過生成Dom的api會**建立出映射**，並存放在記憶體中，讓我們能夠進行操作，且不會被**GC回收**。

![記憶體布局](/images/dom/DOM記憶體關係圖.png)

由此圖我們可以瞭解，只要建造出映射，就算我們取消記憶體位置指向，映射仍會存在，DOM仍然可以訪問，***若要取消映射，只能透過DOM api remove***。
>DOM是JS操作頁面的介面，但是JS不能直接對DOM增刪改查只能透過宿主提供DOM API間接操作。
>> 1.JS 夠過與 DOM 的映射關係操作頁面
>> 2.頁面內容的控制
>> 3.表格、表單資料事件
>> 4.監聽各種使用者互動
>> 5.懶加載其他資源
>> 6.組件化、工程化開發複雜的應用
---
### 那有哪些可以創建元素，建立映射的方法呢?

```javascript

1. Element.innerHTML
2. DOMParser
var parser = new DOMParser();
const htmlString = "<strong>Beware of the leopard</strong>";
const doc3 = parser.parseFromString(htmlString, "text/html");
3. Document.createElementNS
document.createElementNS('p','endition')
-><endition>​</endition>​
4. Document.createElement
5. Document.write
6. Document.createDocumentFragment
DocumentFragments 是 DOM 節點(Nodes)。他們不會成為 DOM主幹的一部份，需要append加入 DOM 樹。
7. Document.createTextNode
建立文字節點
...

```
---
## Dom的組成

標準定義的DOM由三大部分構成:
1.節點
2.事件
3.選擇區域(Range AP)

### 節點(Node)

**標籤**是HTML的基本單位，如:p、div、h1、input等。
**節點**是DOM的基本單位，一個具有標準結構化模型的文件，有Element、Text、註解等,共有 12 種節點[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node)。

其中Element <=> HTML標籤，是互相對應的關係。

```HTML
<h2>hello world!<h2>
```

h2是標籤，在DOM內部會生成兩個節點。

- Element Node:h2

- Text Node:"hello world!"

> Document 文件
> **指任何一個結構化的文件**：
> XML Document - 一個 XML 標準模型的文件
> HTML Document - 一個 HTML 標準模型的文件
> JSON Document - 一個 JSON 標準模型的文件
>> **瀏覽器的 document 對象是一個 DOM wrapper object 綁定整顆 DOM 的根**，並掛載於 Global Object 上(如記憶體布局圖)，它們[互相繼承][2](document -> HTMLDocument.prototype -> Document.prototype -> Node.prototype)，並可以往上回溯至object.prototype。
---
### Element 元素
屬於程式語言中的語義，在HTML中叫 Tag、在CSS的表現中稱作 盒 Box。
所謂的操作 DOM 就是對 節點 Node 做 增刪改查、監聽、綁事件。

***Element.prototype***  所有元素的共同方法。
> 若使用創建元素，建立映射的方法，則該元素的__proto__會指向此原型方法，裡面有各種元素操作函數，標籤各自的特別屬性、不同標籤預設的行為樣式等等。
---
***Document.prototype*** 是document的共同方法。
> 是一份xml文件的根、總稱，掛載了許多Dom公共函數，還有瀏覽器的一些訊息(網址、跟引擎相關的load ready)，html標籤集合(document.all)等等，它的語義涵蓋html、dom、文件，因為總總歷史因素，裡面有需多方法跟資料。
---

## DOM Tree

描述 DOM 的一種稱呼，與DOM一樣，指 WebKit 記憶體內部的 Object，只不過講DOM Tree時，重點是**在樹形結構**，而若是講DOM時，則是在對比JS中的**Wrapper object**。

![DOM Tree](/images/dom/DomTree.png)

---
###  Element Node 與 Text Node

- NodeList 靜態/動態集合，包含所有的 Node 節點 Element、Text、屬性、註解，等 12 種節點(getElement系列)
- HTMLCollection 動態集合，只有 Element 1種節點 (querySelector系列)
---
## 重排與重繪 

![Repaint ReFlow](/images/dom/webkit_render.png)


頁面生成過程：
1. HTML被 HTML 解析器解析成 DOM 樹
2. CSS 被 CSS 解析器解析成 CSSOM 樹
3. DOM 樹 + CSSOM 樹，生成一棵渲染樹(Render Tree)
4. 生成佈局 (flow)瀏覽器在屏幕上畫出所有節點
5. 將佈局繪製(paint)在屏幕上，顯示出整個頁面
6. 第四步和第五步是最耗時的部分 這兩步合起來，就是我們通常所說的渲染

**重排/回流（Reflow）**：當 DOM 的變化影響了元素的幾何信息，瀏覽器需要重新計算元素大小寬高等屬性，將其安排在正確的位置，就叫重排，為重新生成布局，重新排列。
**重繪(Repaint)**: 當一元素的外觀產生變化，但没有改變布局,重新把元素外觀繪製出来的過程，叫做重繪。
***任何改變渲染樹的操作都會導致重排或重繪,重排必定重繪***
- [css重繪](https://csstriggers.com/)

---
## Dom 與 VDom

直接進行DOM操作的會何會影響性能?
- 頻繁的DOM操作會導致重排、重繪，會讓瀏覽器在 v8 與 WebKit 兩個 thread 之間來回切換(只能擇一)， 
- 兩個引擎 thread 來回切換就會造成 **「性能損耗」** 。
- 因此現代框架，為了避免頻繁的操作DOM的，自然而然就有了虛擬DOM的概念。

vDOM 的設計
- 用 JS object 模擬 DOM 就是 vdom (Vue Vnode)
- 當頁面的數據變動時，產生新的 vdom(vue 副作用effect時，響應式產生，Diff比對)
- 比較兩個 vdom 的差異(Vue Diff演算，雙端Diff，快速Diff)
- 差異的部分透過 DOM API 映射到真實 DOM上(Vue renderer)

## 分類整理API

## 參考資料及引用

- [What, exactly, is the DOM?](https://bitsofco.de/what-exactly-is-the-dom/)
- [Virtual DOM](https://www.gushiciku.cn/pl/gFY6/zh-tw)
- [前端为什么操作 DOM 是最耗性能的呢？](https://www.zhihu.com/question/324992717/answer/707044362)
- [v8](https://www.jianshu.com/p/53de5e4deb43)
- [document与element上的函数为什么不是一个?](https://www.zhihu.com/question/269333790/answer/350467595)
- [HTML標籤週期表](https://html5.tool.webfrontend.dev/)
- [渲染過程](https://www.cnblogs.com/111testing/p/11186335.html)
- [chorme BindingDesign](https://chromium.googlesource.com/chromium/src.git/+/62.0.3178.1/third_party/WebKit/Source/bindings/core/v8/V8BindingDesign.md)

[1]: <https://zh.m.wikipedia.org/zh-tw/WebKit> (Webkit)

[2]: <https://www.796t.com/post/YjJ2dWc=.html> (dom繼承)
