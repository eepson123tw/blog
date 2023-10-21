---
layout: doc
date: 2022-10-28 23:45:03
description: DOM的底層
title: DOM到底是什麼呢?
---

<PageInfo/>

# DOM 到底是什麼呢?

其實 DOM 是一個[定義](https://www.w3.org/TR/WebIDL/)，是由 W3C WebIDL 所規定，宿主瀏覽器應用程式按此定義實現(底層為 C++)，
並且是一種資料結構，存在於[WebKit][1]的記憶體中。

## 瀏覽器如何實現 DOM

之前提到 DOM 是存在於 Webkit 記憶體中的，而具體操作可以簡略成下圖
![內部關係圖](/assets/images/dom/內部關係圖.png)

## 映射物件和 V8binding

而瀏覽器透過內部引擎與 WebKit(dom)進行綁定(v8 binding)，建立出一個可以在記憶體中訪問到的 **映射物件(wrapper object)** 。

![binding](/assets/images/dom/bindingV8.png)

v8 與 dom 的[詳細實現](https://www.jianshu.com/p/53de5e4deb43)，而我們日常開發中在 devtools 看到畫面並不是 dom，而是**渲染樹**，是 DOM 和 CSSOM 的組合。

```javascript
// 前兩行執行後， v8 dom wrapper 與 c++ DOM 的綁定關係就完成
var div = document.createElement("div");
div.innerHTML = "<p><span>foo</span></p>";
// 測試下面程式碼
div.xxx = 123;
document.body.appendChild(div);
div = null;
document.body.lastChild.xxx; // 123
```

透過生成 DOM 的 api 會**建立出映射**，並存放在記憶體中，讓我們能夠進行操作，且不會被**GC 回收**。

![記憶體布局](/assets/images/dom/DOM記憶體關係圖.png)

由此圖我們可以瞭解，只要建造出映射，就算我們取消記憶體位置指向，映射仍會存在，DOM 仍然可以訪問，**_若要取消映射，只能透過 DOM api remove_**。

> DOM 是 JS 操作頁面的介面，但是 JS 不能直接對 DOM 增刪改查只能透過宿主提供 DOM API 間接操作。
>
> > 1.JS 夠過與 DOM 的映射關係操作頁面 2.頁面內容的控制 3.表格、表單資料事件 4.監聽各種使用者互動 5.懶加載其他資源 6.組件化、工程化開發複雜的應用

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

## DOM 的組成

標準定義的 DOM 由三大部分構成: 1.節點 2.事件 3.選擇區域(Range AP)

### 節點(Node)

**標籤**是 HTML 的基本單位，如:p、div、h1、input 等。
**節點**是 DOM 的基本單位，一個具有標準結構化模型的文件，有 Element、Text、註解等,共有 12 種節點[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node)。

其中 Element <=> HTML 標籤，是互相對應的關係。

```HTML
<h2>hello world!<h2>
```

h2 是標籤，在 DOM 內部會生成兩個節點。

- Element Node:h2

- Text Node:"hello world!"

> Document 文件
> **指任何一個結構化的文件**：
> XML Document - 一個 XML 標準模型的文件
> HTML Document - 一個 HTML 標準模型的文件
> JSON Document - 一個 JSON 標準模型的文件
>
> > **瀏覽器的 document 對象是一個 DOM wrapper object 綁定整顆 DOM 的根**，並掛載於 Global Object 上(如記憶體布局圖)，它們[互相繼承][2](document -> HTMLDocument.prototype -> Document.prototype -> Node.prototype)，並可以往上回溯至 object.prototype。

---

### Element 元素

屬於程式語言中的語義，在 HTML 中叫 Tag、在 CSS 的表現中稱作 盒 Box。
所謂的操作 DOM 就是對 節點 Node 做 增刪改查、監聽、綁事件。

**_Element.prototype_** 所有元素的共同方法。

> 若使用創建元素，建立映射的方法，則該元素的**proto**會指向此原型方法，裡面有各種元素操作函數，標籤各自的特別屬性、不同標籤預設的行為樣式等等。

---

**_Document.prototype_** 是 document 的共同方法。

> 是一份 xml 文件的根、總稱，掛載了許多 DOM 公共函數，還有瀏覽器的一些訊息(網址、跟引擎相關的 load ready)，html 標籤集合(document.all)等等，它的語義涵蓋 html、dom、文件，因為總總歷史因素，裡面有需多方法跟資料。

---

## DOM Tree

描述 DOM 的一種稱呼，與 DOM 一樣，指 WebKit 記憶體內部的 Object，只不過講 DOM Tree 時，重點是**在樹形結構**，而若是講 DOM 時，則是在對比 JS 中的**Wrapper object**。

![DOM Tree](/assets/images/dom/DOMTree.png)

---

### NodeList 與 HTMLCollection

- NodeList 靜態/動態集合，包含所有的 Node 節點 Element、Text、屬性、註解，等 12 種節點(querySelector 系列)
- HTMLCollection 動態集合，只有 Element 1 種節點 (getElement 系列)

---

## 重排與重繪

![Repaint ReFlow](/assets/images/dom/webkit_render.png)

頁面生成過程：

1. HTML 被 HTML 解析器解析成 DOM 樹
2. CSS 被 CSS 解析器解析成 CSSOM 樹
3. DOM 樹 + CSSOM 樹，生成一棵渲染樹(Render Tree)
4. 生成佈局 (flow)瀏覽器在屏幕上畫出所有節點
5. 將佈局繪製(paint)在屏幕上，顯示出整個頁面
6. 第四步和第五步是最耗時的部分 這兩步合起來，就是我們通常所說的渲染

**重排/回流（Reflow）**：當 DOM 的變化影響了元素的幾何信息，瀏覽器需要重新計算元素大小寬高等屬性，將其安排在正確的位置，就叫重排，為重新生成布局，重新排列。
**重繪(Repaint)**: 當一元素的外觀產生變化，但没有改變布局,重新把元素外觀繪製出来的過程，叫做重繪。
**_任何改變渲染樹的操作都會導致重排或重繪,重排必定重繪_**

- [css 重繪](https://csstriggers.com/)

---

## DOM 與 VDOM

直接進行 DOM 操作的會何會影響性能?

- 頻繁的 DOM 操作會導致重排、重繪，會讓瀏覽器在 v8 與 WebKit 兩個 thread 之間來回切換(只能擇一)，
- 兩個引擎 thread 來回切換就會造成 **「性能損耗」** 。
- 因此現代框架，為了避免頻繁的操作 DOM 的，自然而然就有了虛擬 DOM 的概念。

vDOM 的設計

- 用 JS object 模擬 DOM 就是 vdom (Vue Vnode)
- 當頁面的數據變動時，產生新的 vdom(vue 副作用 effect 時，響應式產生，Diff 比對)
- 比較兩個 vdom 的差異(Vue Diff 演算，雙端 Diff，快速 Diff)
- 差異的部分透過 DOM API 映射到真實 DOM 上(Vue renderer)

## 分類整理 API

來源 MDN

```javascript

{

---查驗文檔

Document.readyState
  -  屬性描述文件的讀取狀態

Document.title
  - 文檔標題

Document.visibilityState
  - 返回document的可见性, 即当前可见元素的上下文环境. 由此可以知道当前文档(即为页面)是在背后, 或是不可见的隐藏的标签

----



---寫文檔
Document.write()
  - document.write(markup);
  - 方法将一个文本字符串写入一个由 document.open() 打开的文档流（document stream）。
---

--- 全頻相關
Document.webkitFullscreenEnabled
  - 全屏啟用”屬性指示全屏模式是否可用。
Document.webkitIsFullScreen
  - 是否在全屏模式。
Document.exitFullscreen()
  - 用于让当前文档退出全屏模式

document.fullscreenElement //返回当前文档中正在以全屏模式显示的Element节点,如果没有使用全屏模式,则返回null.
document.fullscreenEnabled //返回一个布尔值,表明浏览器是否支持全屏模式.
---




--- Range 物件

Document.createRange()
  -  Range 物件。(可用來當富文本切割)
  - var range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);

Document.caretRangeFromPoint()
  - var range = document.caretRangeFromPoint(float x, float y);
  - 返回一个 Range 对象（指定坐标的文档片段）。
---




--- 創建類(DOM/元素/comment/event)
Document.createAttribute()
  - attribute = document.createAttribute(name)
  - 创建并返回一个新的属性节点

Document.createElement()
  - document.createElement(tagName[, options]);
  - 创建一个由标签名称 tagName 指定的 HTML 元素。如果用户代理无法识别 tagName，则会生成一个未知 HTML 元素 HTMLUnknownElement。

Document.createDocumentFragment()
  - let fragment = document.createDocumentFragment();
  - 创建一个新的空白的文档片段，文档片段存在于内存中，并不在DOM树中，
  - 所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。
---



--- 獲取元素資訊

Node.nodeType  //唯讀屬性表示了節點物件的類型。
  -  document.nodeType 9 (Node.DOCUMENT_NODE)

Node.previousSibling //返回当前节点的前一个兄弟节点
Element.nextElementSibling // 返回当前元素在其父元素的子元素节点中的后一个元素节点,如果该元素已经是最后一个元素节点,则返回null
Element.previousElementSibling  //返回当前元素在其父元素的子元素节点中的前一个元素节点,如果该元素已经是第一个元素节点,则返回null
Element.classList //唯讀屬性代表了該元素所擁有之類別屬性（Class Attribute）的即時更新集－DOMTokenList。
Element.className  // 获取或设置指定元素的class属性的值。

Element.innerHTML // 屬性獲取或設置元素中包含的HTML或XML標記


Element.getBoundingClientRect()
  - 返回元素的大小及其相对于视口的位置。
  - 如果是标准盒子模型，元素的尺寸等于width/height + padding + border-width的总和。
  - 如果box-sizing: border-box，元素的的尺寸等于 width/height。


Element.querySelector()
  - baseElement.querySelector(selectors)
  - 返回与指定的选择器组匹配的元素的后代的第一个元素。

Element.querySelectorAll()
  - 返回一个non-live的NodeList, 它包含所有元素的非活动节点，该元素来自与其匹配指定的CSS选择器组的元素。
  - baseElement.querySelectorAll(selectors);

Node.cloneNode()
 - var dupNode = node.cloneNode(deep{true||false}); //如果为true,则该节点的所有后代节点也都会被克隆
  - fn 回傳一個呼叫此方法之節點物件的拷貝
Node.contains()
  - document.body.contains(node) ex. document.body.contains(document.querySelector('body') //true
  - 返回的是一个布尔值，来表示传入的节点是否为该节点的后代节点


Document.getElementById()
  - document.getElementById(id);
  - 返回一个匹配特定 ID的元素.

Document.getElementsByClassName()
  - document.getElementsByClassName(names);
  - 返回一个包含了所有指定类名的子元素的类数组对象。

Document.getElementsByName()
  -  document.getElementsByName(name)
  - 返回一个在 (X)HTML document的节点列表集合。

Document.getElementsByTagName()
  -  document.getElementsByTagName(name);
  - 返回一个包括所有给定标签名称的元素的HTML集合HTMLCollection。


Element.getAttribute()
  - align = div1.getAttribute("align");
  - 函式會回傳該網頁元素的屬性。 如果該屬性不存在，其回傳值會是null或 "" (空字串);
Element.getAttributeNS()
  - 命名空间仅在 XML 文档中受支持
  - 返回具有指定命名空间和名称的属性的字符串值。如果命名属性不存在，则返回值将为 null 或 "" （空字符串）
Element.getAttributeNames()
  - let attributeNames = element.getAttributeNames();
  - 返回一个Array，该数组包含指定元素（Element）的所有属性名称，如果该元素不包含任何属性，则返回一个空数组。

Element.hasAttribute()
  - element.hasAttribute(attName);
  - 返回一个布尔值，指示该元素是否包含有指定的属性（attribute）

---


--- 設定元素

Element.attributes //把特定節點裡所有的屬性變成一個集合,然後回傳出來 // NamedNodeMap 並非一個陣列.attributes 是一個鍵/值的配對

Element.toggleAttribute()
  - Element.toggleAttribute(name [, force]);
  - 切换给定元素的某个布尔值属性的状态（如果属性不存在则添加属性，属性存在则移除属性）

Element.setAttribute()
  - element.setAttribute(name, value);
  - 设置指定元素上的某个属性值。如果属性已经存在，则更新该值


Element.before()
  - child.before(span);
  - 方法可以在ChildNode这个节点的父节点中插入一些列的 Node 或者 DOMString 对象，
  - 位置就是在ChildNode节点的前面，DOMString 对象其实和 Text节点一样的方式来完成插入的。

Element.after()
  - after(... nodes)
  - 方法会在其父节点的子节点列表中插入一些 Node 或 DOMString 对象。插入位置为该节点之后。DOMString 对象会被以 Text 的形式插入。

Element.append()
  - parent.append(p);
  - 在 Element的最后一个子节点之后插入一组 Node 对象或 DOMString 对象。
  - 没有返回值, Node.appendChild() 返回追加對象

Element.prepend()
  - Element.prepend((Node or DOMString)... nodes);
  - 在父节点的第一个子节点之前插入一系列Node对象或者DOMString对象。


Element.insertAdjacentElement()
  - element.insertAdjacentElement(position, element);
  - activeElem.insertAdjacentElement('afterend',div)
  - 将一个给定的元素节点插入到相对于被调用的元素的给定的一个位置。
  'beforebegin': 在该元素本身的前面.
  'afterbegin':只在该元素当中, 在该元素第一个子孩子前面.
  'beforeend':只在该元素当中, 在该元素最后一个子孩子后面.
  'afterend': 在该元素本身的后面.

Element.insertAdjacentHTML()
  -insertAdjacentHTML() 把傳入的字串解析成 HTML 或 XML，並把該節點插入到 DOM 樹指定的位置。
  -它不會重新解析被使用的元素，因此他不會破壞該元素裡面原有的元素。
  - element.insertAdjacentHTML(position, text);
  - position like top
  - d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');

Element.insertAdjacentText()
  - 将一个给定的文本节点插入在相对于被调用的元素给定的位置。
  - element.insertAdjacentText(position, element);
  - position like top
  - para.insertAdjacentText('afterbegin',textInput.value);

Element.replaceChildren()
  - Element.replaceChildren(...nodesOrDOMStrings)
  - 将一个 Node 的后代替换为指定的后代集合。这些新的后代可以为 DOMString 或 Node 对象

Element.replaceWith()
  - child.replaceWith(span);
  - Node 对象或者 DOMString 对象，替换了该节点父节点下的子节点 。

----




---移除

Node.removeChild()
  - node.removeChild(child);
  -從 DOM 移除一個子節點，並傳回移除的節點。 可刪除被v8binding的 dom映射，立即無法使用且不可挽回。

Node.replaceChild()
  - parentNode.replaceChild(newChild, oldChild);
  - 用指定的节点替换当前节点的一个子节点，并返回被替换掉的节点。
  - 可探討DOM binding 還在嗎?


Element.remove()
  - node.remove();
  - 把对象从它所属的 DOM 树中删除。

Element.removeAttribute()
  - element.removeAttribute(attrName);
  - 指定的元素中删除一个属性。

----





location  对象的位置（URL),含有文檔的 URL 相關的信息，并提供了改變該 URL 和加載其他 URL 的方法。
----
  document.location
  document.location === window.location 接口位置相等
  document.location.href //url整個
  document.location.host //返回域名(包含port) 192.168.31.121:8080
  document.location.search  //返回URL参数包含(?)
  document.location.hash   // 返回標示符URL参数包含(#)。
  document.location.reload // fn重仔頁面資源
  document.location.replace // fn 用給定的URl跳轉至該頁面，不會有紀錄
---


可設定功能類型
---
document.designMode // 控制整個文件是否能夠編輯 = "on" || "off"
document.dir // 文档的文字朝向 = 'ltr' || 'rtl'
---


}

```

## 參考資料及引用

- [What, exactly, is the DOM?](https://bitsofco.de/what-exactly-is-the-dom/)
- [Virtual DOM](https://www.gushiciku.cn/pl/gFY6/zh-tw)
- [前端为什么操作 DOM 是最耗性能的呢？](https://www.zhihu.com/question/324992717/answer/707044362)
- [v8](https://www.jianshu.com/p/53de5e4deb43)
- [document 与 element 上的函数为什么不是一个?](https://www.zhihu.com/question/269333790/answer/350467595)
- [HTML 標籤週期表](https://html5.tool.webfrontend.dev/)
- [渲染過程](https://www.cnblogs.com/111testing/p/11186335.html)
- [chorme BindingDesign](https://chromium.googlesource.com/chromium/src.git/+/62.0.3178.1/third_party/WebKit/Source/bindings/core/v8/V8BindingDesign.md)

[1]: https://zh.m.wikipedia.org/zh-tw/WebKit "Webkit"
[2]: https://www.796t.com/post/YjJ2dWc=.html "dom繼承"

<GitTalk/>
