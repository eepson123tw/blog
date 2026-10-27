---
title: Day 3 狀態與副作用
description: 學習 React 框架
icon: i-lucide-air-vent
gitTalk: false
date: 2023-05-06 19:00:20
read: '5'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
navigation:
  icon: i-lucide-air-vent
---
> 學習 React 框架 - 003 組件狀態與副作用更新

## 狀態的抽象

在實際的開發場景中,前端會接收到很多的資料,不論是頁面初始的預設資料,還是由後端傳遞而來的 api 資料,需要一個能保存的方法,
而狀態是一個 React 實作出來的函示.

根據 React 的基本概念理論一文中描述,UI 被 State (狀態)所影響變更出不同的樣態,更希望每個 UI 能保存自有的狀態,並透過我們設計好的函式,**單向的更新狀態**.
::code-group

```javascript [引用自基本概念]
/* 將狀態的管理結合 UI 的邏輯抽象,就像是組件一樣,我們定義props進來的參數,
  並依照副作用函示更新,傳遞下來的狀態.
  可以發現,抽象的組件中並沒有其餘觸發副作用的函式,
  也是為了保持資料狀態的不可變性,資料只能依照我們的設計,單向的變更.
*/
function FancyNameBox(user, likes, onClick) {
  return FancyBox([
    'Name: ',
    NameBox(`${user.firstName} ${user.lastName}`),
    'Likes: ',
    LikeBox(likes),
    LikeButton(onClick),
  ]);
}

// Implementation Details(設置狀態的初始值,及使狀態更新的副作用函式)

let likes = 0;
function addOneMoreLike() {
  likes++;
  rerender(); // 非常重要 當狀態更新時，我們需要觸發頁面的更新
}

// Init 資料狀態初始化

FancyNameBox(
  { firstName: 'Sebastian', lastName: 'Markbåge' },
  likes,
  addOneMoreLike
);
```

::

## useState

組件在 React 中只是一個函式的封裝,當函式被執行,記憶體中的指向就會被排出,我們希望狀態能依照頁面邏輯的使用,保存在我們的組件中,React 實作了一個能讓狀態持續存在的 hook（可以視為官方提供的工具函式）useState.

[範例](https://codepen.io/eepson123tw/pen/NWOyNYP?editors=1010)

::callout{color="warning" icon="lucide:eraser"}
從範例中我們可以觀察我們在組件中調用 useState,並設置初始值,依照我們定義的方式更改 state,並且 state 變更後,頁面 rerender 後發現狀態已被更新.
::

## useState 內部的作用

簡單來說 useState 幫我們做到了兩件事,

1. 讓原先會在 rerender 後不能保存的狀態值,繼續存在.
2. 狀態更新後再次觸發了 rerender.

::callout{color="warning" icon="lucide:eraser"}
useState 是一個封裝後的閉包空間,就是狀態抽象的實作.
::

```javascript
// 簡易的抽象
function useState(state) {
  const setState = (action) => {
    action(state);
    React.root.reRender(<App />); // rerender
  };
  return [state, setState];
}
```

當每次調用 useState 時,我們都會從函式收到 state,及觸發的副作用函式,再來就是更新頁面.
此抽象只是非常簡單的一個描述,實際的實作更爲複雜,初始值的觀測,搭配節點的切片等等...**真的是非常有趣 😇😇**

## 狀態管理 Array Object

::callout{color="error" icon="lucide:ambulance"}
React 狀態管理中,必須將任何型別的資料視為不可變的,不應直接改變在 React 狀態下的對象。相反，當你想更新一個對象(or 陣列)時，需要**創建一個新對象（或複制一個現有對象**），然後設置狀態使用該 copy.
::

將物件資料交由 state 管理時我們可以使用解構的方式去更動 state 狀態,[範例](https://codepen.io/eepson123tw/pen/NWOyNYP?editors=1011)

而陣列資料的狀態管理,就如物件一般,我們不應去直接改變陣列中的值,而是需要創建或是回傳新對象.

```javascript
setAry(
  // Replace the state
  [
    // with a new array
    ...ary,
    { id: nextId++, name },
  ]
);
```

另外再變更複雜的物件型態時,必須留意是否變更**記憶體的共同指向**,不然容易出現非預期的錯誤歐.

## 重置狀態 with key

Key 是一個辨明節點的屬性,常常使用在渲染列表時,可以讓 react 辨識節點的獨特性.
但在管理狀態時也可以透過 Key 來實現重置狀態.主要是利用 key 值改變則重新渲染的特性.

[範例](https://codepen.io/eepson123tw/pen/NWOyNYP?editors=0011)

## 參考資料

若想了解為何狀態是不可變的,[可以前往](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react)

- [可視化的理解 React](https://react.gg/visualized#history-of-the-web)
- [React 官方文件](https://react.dev/)
- [React Basic](https://github.com/reactjs/react-basic)
- [Build your own React](https://pomb.us/build-your-own-react/)
