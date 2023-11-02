---
layout: doc
date: 2023-06-10 17:35:00
description: 學習React框架
title: React-005 函式鉤子與狀態驅動
---

# 學習 React 框架 - 005 函式鉤子與狀態驅動

## React為何要實作[Hooks](https://react.dev/reference/react)?

React Hooks 是在版本 16.8.0 中引入的。它們與類組件生命週期事件完全不同。
簡單來說，在日益複雜的開發需求的提出下,我們需要觀測某些依賴值的變動，在不同的時間點上，在瀏覽器上顯示這個變動.驅動副作用、管理副作用、副作用最佳化等等...
Hooks即是這些方式的實現。

根據Hooks的功能不同，所能做到的事務也大不相同。
接下來，會依照基礎即進階Hooks分享與探討~

## Basic Hooks

## [useState](https://react.dev/reference/react/useState)

狀態 讓組件**記住**用戶輸入等信息。組件可以使用狀態來存儲輸入值，或任何你想保存且依照你設定邏輯更改的變量。


## [useEffect](https://react.dev/reference/react/useEffect)

渲染及重新渲染時觸發的hook

- 惰性初始化 *lazy state initial first frame evoked => computed extra expensive*
- 只在必要時(觀測值變化時觸發) *shallow comparison attention with what you consent*
- 可抽出變成客製化function

### hooks [flow](https://github.com/donavon/hook-flow/blob/master/hook-flow.pdf)

此流程圖簡述了Hooks在 mount、update、unmount 時的流程.

### codepen [模擬hooks掛載順序](https://codepen.io/eepson123tw/pen/poxmxeQ?editors=1111)

依照上方的流程圖，我們可以清晰地區分

### 當組件被掛載時

render start ⇒ lazy initiallizers ⇒ render end ⇒ LayoutEffects ⇒  dom update(Painting/User  see change) ⇒ some state change ⇒ render start⇒ render end⇒ layoutEffects run again ⇒ cleanLayout ⇒ dom update ⇒  cleanEffect⇒Run Effect

### 當組件被卸載時

render start ⇒ render end ⇒ child component cleanup ⇒ parent component cleanup ⇒ parent component  run effect

- 子組件觸發更新時，只會觸發子組件的flow

注意若為子組件時，可能會覺得在父組件渲染完成時，子組件先行渲染，但並非如此，因為底層都是會直接調用react.createElement，react 會在父組件掛載完成時，才會依序渲染並執行子組件effect.

空陣列會⇒觀測所有⇒也即是告訴React目前並不取決於應用程序的狀態⇒指觸發render時的那一次

### 需注意 lifting state

將組件狀態提升至頂層，並由頂層下放更新函式到各組件管理

react state 盡量將state封裝在真正需要他的地方 co locate the state to where it needs to be.


## [React實作 Pokemon](https://pokemon.zeabur.app/)

嘗試使用react basic hooks實作一個可以無限滾動 且 RWD 的 神奇寶貝卡片列表(原來神奇寶北這麼多隻了 = = ) 


## 參考資料

[useState lazy initialization and function updates](https://kentcdodds.com/blog/use-state-lazy-initialization-and-function-updates)


<GitTalk/>
