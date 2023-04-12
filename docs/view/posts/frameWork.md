---
layout: doc
---

<!-- ---
title: 前端與框架的關係
date: 2022-10-28 00:06:03
tags: [JavaScript, framework, vue]
categories: [JavaScript]
sticky: 999
--- -->

# 前端與框架的秘密

## 前言: JS 誕生與戰國時代

1995 年 JavaScript 誕生，**布蘭登·艾克 Brendan Eich**只花了 <span style="color:red;">10 天</span> 時間設計出 JavaScript 語言。
而那時正處於瀏覽器的戰國時代，各家瀏覽器都有自己的 JS 規格。語法的實現不一，常常造成困擾，為了兼容都塞在 window 屬性裡，現今印出 window 的屬性，也有許多歷史的痕跡。直到後來才有了 ECMA 組織訂出了標準。

<!-- ### JS 的爸爸 -->

<!-- ### 混亂的 Window -->

## jQuery 的大統一

2006 年，jQuery 發布了，當時前端面對的是瀏覽器兼容性問題(瀏覽器戰爭遺毒)，jQuery 在處理 DOM 兼容上，開發出大量的 DOM/BOM 兼容方案，並且相當的輕量，還使用了鏈式連結，提供開發者們快捷的開發方式，並能開發出更穩定的應用，導致被大量地使用。而這也是間接導致前後端分離的原因之一。
但我們並不能稱 jQuery 是一個框架，它只是一個**library 函式庫**，但它是前端框架的啟蒙者。

## JS 與 jQuery 的差異

JS

```JavaScript
var checkValue;
var elements = document.getElementsByTagName(‘input’);
for (var n = 0; n < elements.length; n++){
if (elements[n].type == ‘radio’ && elements[n].name == ‘RadioGroup’ && elements[n].checked){
checkedValue = elements[n].value;
}
```

jQuery

```JavaScript
var checkValue = $(‘[name=”radioGroup”]:checked’).val();
```

## jQuery 的消逝與退場

隨著網頁應用的越加廣泛，頁面邏輯也就越加複雜，jQ 的優勢也漸漸的消逝，為了開發越加複雜的應用，開發者必須新增不同功能的 jQ 庫，來解決開發複雜頁面所遇到的問題，慢慢地成為開發者的負擔。雖然不斷有新的 library 出世，但一直沒有人可以取代 jQ，一直到 2010 年的 Angular 被提出，一個新的想法，「前端框架」的概念才橫空出世。

# 何謂框架的概念，框架又是為了解決甚麼問題?

要回答這個問題，我們需要回到業務模型開始分析

**web1.0**: MVC 模型開發應用，頁面顯示和邏輯功能都綁定再一起，前後端並未進行明確的職責分工，也就是說一個頁面中會混入不同的語言邏輯。

**web2.0**: AJAX 技術的出現，前端透過 AJAX 非同步方式來獲取資料，並使用 jQ 展現頁面及邏輯操作，後端透過提供 Api 接口，此合作方式將頁面與資料分離，這也是最初的前後端分離雛形！但仍是 MVC 的模型。

## 舊有的業務模型 MVC

模型（Model): 工程師編寫程式應有的功能、資料庫進行資料管理和資料庫設計。（實現演算法，實現頁面功能等等...）
視圖（View):圖形介面設計，也就是客戶端頁面。
控制器（Controller):負責轉發請求，對請求進行處理後，通知 model。

## 新的業務模型 MVVM

Model: 代表數據模型。
View: 用戶操作介面。
ViewModel： 業務邏輯層。

簡單來說，MVVM 可以讓業務邏輯反映在頁面上，邏輯層又與數據層雙向綁定，達到互相連動的效果。

**MVVM 就是框架的概念，簡化數據與 UI 頁面的依賴，也解決了數據頻繁更新的問題**，
開發者不用再依賴一堆 jQ 套件，前端不需要再把邏輯和頁面混在一起做撒尿牛丸，資料實時反映在 view 上，後端不需要再對前端頁面進行加工，降低開發者們的精神負擔,達到各端專注分工的合作模式。

<!-- # MVC 與 MVVM 資料夾架構差異 -->

# 框架御三家

**React** 開源於 2013 年 5 月，目前有 196K 星數，爸爸是 FB。
**Angular** 開源於 2009 年，目前有 84.4K 星數，爸爸是 Google。
**Vue** 開源於 2014 年，200K 星數，創作者是尤宇溪，目前沒有爸爸。
三大框架都有各自的愛好者，學習成本為 Angular>React>Vue。

## React

`UI = fn(state)`
React 的核心思想，頁面可以靠著抽象的函式包覆狀態後產生 UI，也就是 UI 是將數據投影到不同形式的函式中。相同的輸入提供相同的輸出。維持純粹且簡單的使用方法。

目前版本為 18 版本，16.8 版本後引入 Hook Api ，能更好的控制副作用及進行狀態管理，並將生命週期的概念移除，使用統一的流管理函式，可將依賴抽象化，合理地控制渲染流程，降低開發人員的心智負擔，但需要對 Js 有一定的理解，才能方便的操作。

## Vue

三大框架中最年輕的一個，也最綜合的一個。

Vue 核心分為`聲明式的描述UI，渲染器，組件，編譯器`。

各個核心相互依賴，構成了一個比 React 更為複雜的框架，框架本身進行了許多優化處理，結合其餘框架的精華，有生命週期，有 hook 式的使用方法，有 Class optional 的使用方式，有 Fn composition 的組合方式，官方檔案文件齊全，開法上手快速，擁有許多框架語法糖供開法者使用，也提供了 JSX 的撰寫模式，讓你寫近乎原生的 JS。

簡單來說，就是要什麼有什麼，甚麼都碰一點~

## Angular

最古老且完整的框架

基於 TypeScript 進行開發，具有完整且龐大的依賴體系庫，指令式的開發模式及組件切分的概念被眾多框架仿效，學習成本陡峭，已與許多良好的開發模式可以依循，大型且需要高穩定度的網站，多使用此框架。

<!-- # 2021 年度 框架滿意度及使用度 -->

# 後起之秀（學不完的框架）

**Svelte** 是一種全新的構建用戶界面的框架。Svelte 有別於傳統框架，它將大量的優化工作放到了構建應用程序的編譯階段來處理。**無虛擬 DOM，無須添加狀態管理工具**

**SolidJS** 用於在 Web 上構建快速的聲明式 UI。它**與 React 共享許多想法**，但不使用虛擬 DOM 來提供更高效和更實用的開發人員體驗。

**Qwik** 類似 react 的前端 ssr 框架，大幅優化甚至取消了 hydration 的過程，不光是延遲加載組件，還可以延遲加載點擊事件等代碼，幾乎可以做到， 只加載當前用到的 js 代碼與 css 代碼，dom 元素沒有出現在屏幕的可視區，則不執行組件內部方法。

## 結語

各框架為了解決日益複雜化的前端應用問題，演化出了不同的核心想法，有自由無限制的控制模式，也有規定繁雜的設計概念，隨著瀏覽器引擎的進化，前端框架勢必隨著更新，觀察框架也是在觀察前端的脈動，前端工程在這些思想的衝擊下，也會越加發展成熟茁壯。

參考資料：

[Js 起源與前世](https://javascript.alphacamp.co/javascript-past-and-present.html)
[盤點 Web20 年](https://kknews.cc/tech/vlypb5l.html)
[前端框架演進之路](https://www.notion.so/b9059106045a4432a2f697402372126e#29689bd6e5954a1f979289312dcdbd6f)
[UI is a function of state](https://www.kn8.lt/blog/ui-is-a-function-of-data/)
[Front-end frameworks and librariese](https://2021.stateofjs.com/zh-Hant/libraries/front-end-frameworks/)
[如何利用 Qwik 和 Partytown 削减掉 页面中 99% 的 JavaScript ](https://zhuanlan.zhihu.com/p/445122206)
