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


## WrapperObject和V8binding

而瀏覽器透過內部引擎與WebKit(dom)進行綁定(v8 binding)，建立出一個可以在記憶體中訪問到的**映射物件(wrapper object)**。
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
> 1.JS 夠過與 DOM 的映射關係操作頁面
> 2.頁面內容的控制
> 3.表格、表單資料事件
> 4.監聽各種使用者互動
> 5.懶加載其他資源
> 6.組件化、工程化開發複雜的應用
---
那有哪些可以創建元素，建立映射的方法呢?

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

## DOM樹與CSSOM樹和Render樹

## 重排與重繪

## 節流與防抖

## Dom與 VDom

<!-- ## 封裝庫 與 mini react -->

## 參考資料及引用
- [What, exactly, is the DOM?](https://bitsofco.de/what-exactly-is-the-dom/)
- [Virtual DOM](https://www.gushiciku.cn/pl/gFY6/zh-tw)
- [前端为什么操作 DOM 是最耗性能的呢？](https://www.zhihu.com/question/324992717/answer/707044362)
- [v8](https://www.jianshu.com/p/53de5e4deb43)

[1]: <https://zh.m.wikipedia.org/zh-tw/WebKit> (Webkit)

