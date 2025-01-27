---
title: 記憶體布局
description: JavaScript、G/O、prototype chain
icon: 'lucide:lamp-desk'
gitTalk: false
date: 2022-05-06 23:23:00
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

在許多的面試裡，js 的基礎問題是常常會被面試官詢問，像是 Hoisting，var/let/const 差異，閉包...，而今天想跟各位分享的也是眾多基礎題的其中之一，原型鍊(prototype chain)，要分享原型鍊則需提到 js 記憶體中的布局。
在我們尚未執行代碼之前，我們所寫的 JS 以及宿主環境預設的 API 會被存放在「靜態區」，執行時 V8 會按照執行順序將代碼移動到相應的其他區域，而甚麼是宿主的環境呢?常被提到的像是 client 端(browser)、sever 端(node)

> 而在 ECMAScript 的規範中沒有對「宿主環境」給出明確的定義。它沒有明確地指出標準輸入和輸出需要確切地在哪個對象中實現，這導致 JS 的內置實現有一定的混亂性。但我們可以客觀地認為： 瀏覽器為 V8 提供基礎的消息循環系統、Global Object、Web API，而 V8 的核心是實現了 ECMAScript 標準定義的一些 Native Object 和一些核心函數 此外 V8 還提供了垃圾回收器、協程功能。

--引用自業界前輩的分析

## 記憶體的布局

JS 的值有兩種類型，基礎值 primitive value 與 引用值 reference value

- 基礎值 Number，String，Boolean，Null，Undefined,Symbol
- 引用值 Object，function，Array，RegExp，Data，Date

常常會在網路上搜尋到 js 是傳值、傳址、傳參考?當我再找資料時，也常常被這些術語搞得十分頭痛。
其實我們可以透過簡易圖繪圖畫出記憶體的指向，而不是強記這些術語，反而會十分地清晰。

在畫圖之前，讓我們來想想，以下的程式碼是怎麼被存放在記憶體中的吧。

```javascript
const a = 1;
const b = 2;
const c = 'aaron';
const d = true;
const e = [];
const f = {};
function fn() {}
```

### 記憶體繪圖

![範例1](/images/memory_layout/ex1.webp)

在簡易的繪圖中，發現若我們聲明的變量被覆值為基礎值時，記憶體所存的就會是那個值(**其實仍然會是一個地址，因為記憶方便我們先簡化為基礎值本身**)，而引用值則會是以一個地址被記憶體記住。

---

## 原型鍊

其實在我們執行程式碼後，會生出一個全域 Global Object，而全域 Global Object 會與宿主環境相關，若我們在 Web 環境中執行，瀏覽器會為我們提供 DOM、BOM、setTimeout、setInterval 巴拉巴拉一大堆的 web api...，而它們都會被掛在 Global Object 中，然後掛到 window 中給我們使用。

```javascript
Object.keys(window).length
＞＞326 有點肥
```

---

基於上方的簡易的繪圖我們理解到記憶體的引用值中存放的就是一個地址，那這個地址裡還有甚麼呢?

### 原型鍊中有兩個重要的屬性

```javascript
 __proto__ 是一個 屬性，值是一個地址
 prototype 是一個 object，裡面放公用函數
```

```javascript
const e = [];
const f = {};
function fn() {}
```

![範例2](/images/memory_layout/ex2.webp)

```javascript
const e = [];
e.__proto__ === Array.prototype;
true;
const f = {};
f.__proto__ === Object.prototype;
true;
function fn() {}
fn.__proto__ === Function.prototype;
true;
```

而各自原型物件中也有**proto**存在，陣列原型的 proto 地址會指向物件原型，而物件原型的 proto 地址則指向 null，這大概只能硬記了。

```javascript
Array.prototype.__proto__ === Object.prototype;
true;
dir(Object.prototype__proto__);
undefined;
```

大致上分享完了，原型鍊簡單來說就引用值的 proto 地址像一條鍊子把原型方法分享給串連起來的樣子。
這樣就能理解，為什麼我們聲明變量為引用值時，可以調用那些方法了~

補充:
若在瀏覽器中測試下方程式碼，會發生一個很有趣的事件。

```javascript
function person() {}
```

person.**proto** 指向 funciton.prototype (如上方解釋)
若呼叫，person.prototype 瀏覽器會回傳一個空物件{constructor: ƒ}，
會讓人誤以為 person.prototype 會在一開始開出這個物件的記憶體位置，其實不然。
需要等到呼叫時才會建立。例如 特地寫 person.prototype 或是 new obj 時產生。
